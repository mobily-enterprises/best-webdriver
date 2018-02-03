const consolelog = require('debug')('webdriver:Driver')
const getPort = require('get-port')
const request = require('request-promise-native')
const utils = require('../utils')
const Element = require('../Element.js')
const FindHelpersMixin = require('../FindHelpersMixin')
const USING = require('../USING')
/**
 * The main driver class used to create a driver and actually use this API
 * It will spawn a webdriver process by default.
 * @mixes FindHelpersMixin
 * @augments FindHelpersMixin
 *
 * @example
 * // Create a driver using the Chrome browser
 * var driver1 = new Driver(new Chrome())
 * await driver.newSession()
 *
 * // Create a driver, but does NOT spawn a new webcontroller process
 * var driver2 = new Driver(new Chrome(), {
 *   spawn: false,
 *   hostname: '127.0.0.1',
 *   port: 4444
 * })
 * await driver.newSession()
 *
 */
var Driver = class {
  //
  /**
   * Constructor returning a Driver object, which will be used to pilot the passed browser
   *
   * @param {Browser} browser The browser that this API will pilot
   * @param {Object} opt Options to configure the driver
   * @param {string} opt.hostname=127.0.0.1 The hostname to connect to.
   * @param {number} opt.port The port. If not specified, a free port will automatically be found
   * @param {number} opt.pollInterval=300 How many milliseconds to wait between each poll when using `waitFor()` by default
   * @param {boolean} opt.spawn=true If true, it will spawn a new webdriver process when a new session is created
   * @param {Object} opt.env=process.env (If spawn === true) The environment to pass to the spawn webdriver
   * @param {string} opt.stdio=ignore (If spawn === true) The default parameter to pass to {@link https://nodejs.org/api/child_process.html#child_process_options_stdio stdio} when spawning new preocess.
   * @param {Array} opt.args (If spawn === true) The arguments to pass to the webdriver command
   */
  constructor (browser, options = {}) {
    this._browser = browser
    this._hostname = options.hostname || '127.0.0.1'
    this._spawn = typeof options.spawn !== 'undefined' ? !!options.spawn : true
    this._executable = null
    this._webDriverRunning = !this._spawn

    // Parameters passed onto child process
    this._port = options.port
    this._env = utils.isObject(options.env) ? options.env : process.env
    this._stdio = options.stdio || 'ignore'
    this._args = Array.isArray(options.args) ? options.args : []

    this._killCommand = null
    this._commandResult = null

    this._pollInterval = 300
    this._pollTimeout = 10000
    this._urlBase = null
  }

  /**
   * Set executable for the browser
   *
   * @param {string} executable The name of the executable to run
   */
  setExecutable (executable) {
    this._executable = executable
  }

  /**
   * Run the actual webdriver's executable, depending on the browser
   *
   * @param {Object} opt Options to configure the webdriver executable
   * @param {number} opt.port The port the webdriver executable will listen to
   * @param {Array} opt.args The arguments to pass to the webdriver executable
   * @param {Object} opt.env The environment to pass to the spawn webdriver
   * @param {string} opt.stdio The default parameter to pass to {@link https://nodejs.org/api/child_process.html#child_process_options_stdio stdio} when spawning new preocess.
   *
   */
  async run (options) {
    options.args.push('--port=' + options.port)
    return utils.exec(this._executable, options)
  }

  /**
    * Set the default poll interval
    *
    * @param {number} interval How many milliseconds between each polling attempt
    *
    * @example
    * // Create a driver using the Chrome browser
    * var driver = new drivers.ChromeDriver(new browsers.Chrome())
    * driver.setPollInterval(200)
    */
  setPollInterval (ms) {
    this._pollInterval = ms
  }

  /**
    * Set the default waitFor timeout
    *
    * @param {number} timeout How many milliseconds between failing the call
    *
    * @example
    * var driver = new drivers.ChromeDriver(new browsers.Chrome())
    * driver.setPollTimeout(200)
    */
  setPollTimeout (ms) {
    this._pollTimeout = ms
  }

  /**
    * This method will wrap ANY method in Driver or Element with a polling mechanism, which will retry
    * the call every `pollInterval` milliseconds (it defaults to 300, but it can
    * be set when running the Driver's constructor)
    * It's also possible to pass an extra parameter to the original method in Driver,
    * which represents a checker function that will need to return truly for success
    *
    * @async
    * @param {(number)} timeout How long to poll for
    *
    * @example
    * // Create a driver using the Chrome browser
    * var driver = new drivers.ChromeDriver(new browsers.Chrome())
    * await driver.navigateTo('http://www.google.com')
    *
    * // The findElementCss has 5 seconds to work
    * var el = driver.waitFor(5000).findElementCss('[name=q]')
    *
    * // The findElementsCss (note the plural: it returns an array)
    * // has 10 seconds to work, AND the result needs to be not-empty
    * // (see the tester function added)
    * await el.waitFor(10000).findElementsCss('.listItem', (r) => r.length))
   */
  waitFor (timeout = 0, pollInterval = 0) {
    timeout = timeout || this._pollTimeout
    pollInterval = pollInterval || this._pollInterval
    var self = this
    return new Proxy({}, {
      get (target, name) {
        // if (name in target) { return target[name] }
        if (typeof self[name] === 'function') {
          return async function (...args) {
            // If the last argument is a function, it's assumed
            // to be the checker. If not, the checker is set as
            // a yes-man noop function
            if (typeof args[args.length - 1] === 'function') {
              var checker = args.pop()
            } else {
              checker = () => true
            }

            var endTime = new Date(Date.now() + timeout)
            var success = false
            var errors = []
            while (true) {
              try {
                consolelog(`Attempting call ${name} with timeout ${timeout} and arguments ${args}`)
                var res = await self[name].apply(self, args)

                // If the flow gets to this point, the call was successful. However,
                // it's also too late. Even though the call went through, it will be
                // considered failed
                if (new Date() > endTime) {
                  consolelog('Call was successful, BUT it was too late. This will fail.')
                  errors.push(new Error('Call successful but too late'))
                  break
                }
                consolelog('Call was successful, checking the result with the provided checker...')
                success = !!checker(res)
                consolelog('Checker returned:', success)
              } catch (e) {
                consolelog('Call resulted in error, checker won\'t be run')
                errors.push(e)
              }
              if (success || new Date() > endTime) {
                consolelog(`Time to get out of the cycle. Success is ${success}`)
                break
              }
              consolelog(`Sleeping for ${pollInterval}, trying again later...`)
              await utils.sleep(pollInterval)
            }

            // If attempt is successful, return res
            if (success) return res
            else {
              var error = new Error('Call was unsuccessful')
              error.errors = errors
              throw error
            }
          }
        } else {
          return self[name]
        }
      } // End of Proxy getter
    }) // End of Proxy
  }

  /**
   * @private
   */
  _ready () {
    return !!(this._sessionId && this._webDriverRunning)
  }

  /**
   * Start the right webdriver, depending on what browser is attached to it.
   * Since webdrivers can take a little while to answer, this method also checks
   * that the webdriver process is actively and properly dealing with connections
   * This method is called by {@link Driver#newSession|newSession}
   *
   * @example
   * var driver = new drivers.ChromeDriver(new browsers.Chrome())
   * await driver.startWebDriver()
   */
  async startWebDriver () {
    // If it's already connected, nothing to do
    if (this._webDriverRunning) return

    // If spawning is required, do so
    if (this._spawn && this._executable) {
      // No port: find a free port
      if (!this._port) {
        this._port = await getPort({ host: this._hostname })
      }

      // Options: port, args, env, stdio
      var res = await this.run({
        port: this._port,
        args: this._args,
        env: this._env,
        stdio: this._stdio }
      )
      this._killCommand = res.killCommand
    }

    // It's still possible that no port has been set, since spawn was false
    // and no port was defined. In such a case, use the default 4444
    if (!this._port) this._port = '4444'

    // `_hostname` and `_port` are finally set: make up the first `urlBase`
    this._urlBase = `http://${this._hostname}:${this._port}/session`

    await this.sleep(200)

    // Check that the server is up, by asking for the status
    // It might take a little while for the
    var success = false
    for (var i = 0; i < 40; i++) {
      if (i > 5) {
        console.log(`Attempt n. ${i} to connect to ${this._hostname}, port ${this._port}... `)
      }
      try {
        await this.status()
        success = true
        break
      } catch (e) {
        await this.sleep(300)
      }
    }
    if (!success) {
      throw new Error(`Could not connect to the driver`)
    }

    // Connection worked...
    this._webDriverRunning = true
  }

  /**
    * Stops the webdriver process, if running. It does so by sending it a SIGTERM message.
    * You can specify the message to send the process
    *
    * @param {(string|number)} signal=SIGTERM The signal to send. To know which signals you can send,
    *
    * @example
    * // Create a driver using the Chrome browser
    * var driver = new drivers.ChromeDriver(new browsers.Chrome())
    * // ...
    * // ...
    * await driver.stopWebDriver()
   */
  async stopWebDriver (signal = 'SIGTERM') {
    if (this._killCommand) {
      this._killCommand(signal)

      // this.killWebDriver('SIGTERM')
      this._webDriverRunning = false

      this._port = 0
    }
  }

  /**
   * Sleep for ms milliseconds
   * NOTE: you shouldn't use this as a quick means to wait for AJAX calls to finish.
   * If you need to poll-wait, use {@link Driver#waitFor waitFor}
   *
   * @param {number} ms The number of milliseconds to wait for
   *   *
   * @example
   *   await driver.sleep(1000)
   *
  */
  async sleep (ms) {
    return utils.sleep(ms)
  }

  /**
    * @private
   */
  inspect () {
    return `Driver { ip: ${this.Name}, port: ${this._port} }`
  }

  /**
   * Create a new session. If the driver was created with `spawn` set to `true`, it will
   * run the webdriver for the associated browser before asking for the session
   * @return {Promise<object>} An object containing the keys `sessionId` and `capabilities`
   *
   * @example
   * var driver = new drivers.ChromeDriver(new browsers.Chrome())
   * var session = await driver.newSession()
   */
  async newSession () {
    try {
      if (this._sessionId) {
        throw new Error('Session already created. Call deleteSession() first')
      }
      // First of all, try and run the webdriver, if it's not running already
      await this.startWebDriver()

      var value = await this._execute('post', '', this._browser.getSessionParameters())

      // W3C conforming response; check if value is an object containing a `capabilities` object property
      // and a `sessionId` string property
      if (utils.isObject(value) &&
          utils.isObject(value.capabilities) &&
          typeof value.capabilities.browserName === 'string' &&
          typeof value.sessionId === 'string'
      ) {
        this._sessionCapabilities = value.capabilities
        this._sessionId = value.sessionId
      }
      if (!this._sessionId || !this._sessionCapabilities) throw new Error('Could not get sessionId and capabilities out of returned object')

      this._urlBase = `http://${this._hostname}:${this._port}/session/${this._sessionId}`
      return value
    } catch (e) {
      this._sessionId = null
      this._sessionData = {}
      this._urlBase = `http://${this._hostname}:${this._port}/session`
      throw (e)
    }
  }

  /**
   * Delete the current session. This will not kill the webdriver process (if one
   * was spawned). You can create a new session with {@link Driver#newSession|newSession}
   *
   * @return {Promise<Driver>} The driver itself
   *
   * @example
   * await driver.deleteSession()
   */
  async deleteSession () {
    try {
      var value = await this._execute('delete', '')
      this._sessionId = null
      this._sessionData = {}
      this._urlBase = `http://${this._hostname}:${this._port}/session`
      return value
    } catch (e) {
      throw (e)
    }
  }

  /**
   * Get status
   *
   * @return {Promise<object>} An object status, which is guaranteed by the superClass
   *                           to include `ready` (boolean) and `message`
   *
   * @example
   * var status = await driver.status()
   */
  async status () {
    var _urlBase = `http://${this._hostname}:${this._port}`
    var res = await request.get({ url: `${_urlBase}/status`, json: true })
    return utils.checkRes(res).value
  }

  /**
   * Perform actions as specified in the passed actions object
   * To see how to create an actions object, check the
   * {@link Actions Actions class}
   *
   * @param {Actions} actions An object
   *
   * @return {Promise<Driver>} The driver itself
   *
   * @example
   * var actions = new Actions()
   * actions.tick.keyboardDown('R').keyboardUp('R')
   * await driver.performActions(actions)
  */
  async performActions (actions) {
    actions.compile()
    await this._execute('post', '/actions', { actions: actions.compiledActions })
    return this
  }

  /**
   * Release the current actions
   * @example
   * await driver.releaseActions(actions)
   *
  */
  async releaseActions () {
    await this._execute('delete', '/actions')
    return this
  }

  /**
    * @private
   */
  async _execute (method, command, params) {
    // Check that session has been created
    if (!(method === 'post' && command === '' && !this._sessionId)) {
      if (!this._ready()) throw new Error('Executing command on non-ready driver')
    }

    var p = { url: `${this._urlBase}${command}` }

    p.json = method === 'post' ? params || {} : true

    // Getting the result
    var res = await request[method](p)

    // Return the result, checking if everything is OK
    return utils.checkRes(res).value
  }

  /**
   * A value used by {@link Driver#findElement} and
   * {@link Driver#findElements} to decide what kind of
   * filter will be applied
   */
  static get Using () {
    return USING
  }

/**
 * Get timeout settings in the page
 * @async
 *
 * @return {Promise<Object>} A promise resolving to an object
 *                   with keys `implicit`, `pageLoad` and `script `. E.g.
 *                  `{ implicit: 0, pageLoad: 300000, script: 30000 }`
 *
 * @example
 * var timeouts = await driver.getTimeouts()
 */
  getTimeouts () {
    return this._execute('get', '/timeouts')
  }

  /**
   * Set timeouts
   * @async
   *
   * @param {Object} param The object with the timeouts
   * @param {number} param.implicit Implicit timeout
   * @param {number} param.pageLoad Timeout for page loads
   * @param {number} param.script Timeout for scripts
   *
   * @example
   * var timeouts = await driver.setTimeouts({ implicit: 7000 })
   */
  setTimeouts (parameters) {
    return this._execute('post', '/timeouts', parameters)
  }

  /**
   * Navigate to page
   *
   * @return {Promise<Driver>} The driver itself
   *
   * @example
   * await driver.navigateTo('http://www.google.com')
   */
  async navigateTo (url) {
    await this._execute('post', '/url', { url })
    return this
  }

  /**
   * Bake a cake without coffee
   * Also, get the current URL
   * @async
   *
   * @return {Promise<string>} The URL
   * @example
   * var currentUrl = await driver.getCurrentUrl()
  */
  getCurrentUrl () {
    return this._execute('get', '/url')
  }

  /**
   * Go back one step
   *
   * @return {Promise<Driver>} The driver itself
   *
   * @example
   * await driver.back()
   */
  async back () {
    await this._execute('post', '/back')
    return this
  }

  /**
   * Go forward one step
   *
   * @return {Promise<Driver>} The driver itself
   *
   * @example
   * await driver.forward()
   */
  async forward () {
    await this._execute('post', '/forward')
    return this
  }

  /**
   * Refresh the page
   *
   * @return {Promise<Driver>} The driver itself
   *
   * @example
   * await driver.refresh()
   */
  async refresh () {
    await this._execute('post', '/refresh')
    return this
  }

  /**
   * Get page's title
   *
   * @return {Promise<string>} The page's title
   * @async
   *
   * @example
   * var title = await driver.getTitle()
   */
  getTitle () {
    return this._execute('get', '/title')
  }

  /**
   * Get the current window's handle
   * @async
   *
   * @return {Promise<string>} The handle, as a string
   *
   * @example
   * var title = await driver.getWindowHandle()
   */
  getWindowHandle () {
    return this._execute('get', '/window')
  }

  /**
   * Close the current window
   *
   * @return {Promise<Driver>} The driver itself
   *
   * @example
   * await driver.closeWindow()
   */
  async closeWindow () {
    await this._execute('delete', '/window')
  }

  /**
   * Get window handles as an array
   * @async
   *
   * @return {Promise<Array<string>>} An array of window handles
   *
   * @example
   * var wins = await driver.getWindowHandles()
   */
  getWindowHandles () {
    return this._execute('get', '/window/handles')
  }

  /**
   * Switch to window
   *
   * @return {Promise<Driver>} The driver itself
   *
   * @param {handle} string The window handle to switched to
   * @example
   * var wins = await driver.getWindowHandles()
   * if (wins[1]) await switchToWindow (wins[1])
   */
  async switchToWindow (handle) {
    await this._execute('post', '/window', { handle })
    return this
  }

  /**
   * Switch to frame
   * @async
   *
   * @param {string|number|Element} frame Element object, or element ID, of the frame
   * @return {Promise<Driver>} The driver itself
   *
   * @example
   * var frame = await driver.findElementCss('iframe')
   * await driver.switchToFrame(frame)
   */
  switchToFrame (id) {
    // W3c: Chrome is not compliant, so we have to do its job
    if (id instanceof Element || typeof id === 'object') id = id.id
    return this._execute('post', '/frame', { id })
  }

  /**
   * Switch to the parent frame
   *
   * @return {Promise<Driver>} The driver itself
   *
   * @example
   *   var frame = await driver.findElementCss('iframe')
   *   await driver.switchToFrame(frame)
   *   await driver.switchToParentFrame()
   */
  async switchToParentFrame () {
    await this._execute('post', '/frame/parent')
    return this
  }

  /**
   * Get window rect
   * @async
   *
   * @return {Promise<Object>} An object with properties `height`, `width`, `x`, `y`
   *
   * @example
   * await driver.getWindowRect()
   */
  getWindowRect () {
    return this._execute('get', '/window/rect')
  }

  /**
   * Set window rect
   * @async
   *
   * @param {Promise<Object>} rect An object with properties `height`, `width`, `x`, `y`
   * @param {Object} rect.height The desired height
   * @param {Object} rect.width The desired width
   * @param {Object} rect.x The desired x position
   * @param {Object} rect.y The desired y position
   *
   * @return {Promise<Object>} An object with properties `height`, `width`, `x`, `y`
   *
   * @example
   * await driver.getWindowRect()
   */
  setWindowRect (rect) {
    return this._execute('post', '/window/rect', rect)
  }

  /**
   * Maximize window
   *
   * @return {Promise<Driver>} The driver itself
   *
   * @example
   * await driver.maximizeWindow()
  */
  async maximizeWindow () {
    return this._execute('post', '/window/maximize')
  }

  /**
   * Minimize window
   * @async
   *
   * @return {Promise<Driver>} The driver itself
   *
   * @example
   * await driver.minimizeWindow()
  */
  minimizeWindow () {
    return this._execute('post', '/window/minimize')
  }

  /**
   * Make window full screen
   * @async
   *
   * @return {Promise<Driver>} The driver itself
   *
   * @example
   *   await driver.fullScreenWindow()
  */
  fullScreenWindow () {
    return this._execute('post', '/window/fullscreen')
  }

  /**
   * Get page source
   * @async
   *
   * @return {Promise<string>} The current page's source
   *
   * @example
   * await driver.getPageSource()
   */
  getPageSource () {
    return this._execute('get', '/source')
  }

  /**
   * Execute sync script
   * @async
   *
   * @param {string} script The string with the script to be executed
   * @param {array} args The arguments to be passed to the script

   * @return Whatever was returned by the javascript code with a `return` statement
   *
   * @example
   * await driver.executeScript('return 'Hello ' + arguments[0];', ['tony'])
   */
  executeScript (script, args = []) {
    return this._execute('post', '/execute/sync', { script, args })
  }

  /**
   * Execute async script
   * NOTE: An extra argument is passed to the script, in addition to the arguments
   *       in `args`: it's the callback the script will need to call
   *       once the script has executed.
   *       To return a value from the async script, pass that value to the callback
   * @async
   *
   * @param {string} script The string with the script to be executed
   * @param {Array} args The arguments to be passed to the script
   *
   * @return Whatever was returned by the javascript code by calling the callback
   *
   * @example
   * var script = 'var name = arguments[0];var cb = arguments[1];cb(\'Hello \' + name);'
   * await driver.executeAsyncScript(script, ['tony'])
   */
  executeAsyncScript (script, args = []) {
    return this._execute('post', '/execute/async', { script, args })
  }

  /**
   * Get all cookies
   * @async
   *
   * @return {Array<Object>} An array of cookie objects.
   *
   * @example
   *   var list = await driver.getAllCookies()
  */
  getAllCookies () {
    return this._execute('get', '/cookie')
  }

  /**
   * Get cookies matching a specific name
   * @async
   *
   * @return {Object} A cookie object
   *
   * @example
   *   var cookie = await driver.getNamedCookies('NID')
  */
  getNamedCookie (name) {
    return this._execute('get', `/cookie/${name}`)
  }

  /**
   * Get cookies matching a specific name
   * @param {object} cookie The cookie object
   *
   * @return {Promise<Driver>} The driver itself
   *
   * @example
   *   await driver.addCookie({
   *     name: 'test',
   *     value: 'a test',
   *     path: '/',
   *     domain: 'google.com.au',
   *     expiry: 1732569047,
   *     secure: true,
   *     httpOnly: true})
  */
  async addCookie (cookie) {
    await this._execute('post', '/cookie', { cookie })
    return this
  }

  /**
   * Delete cookie matching a specific name
   *
   * @return {Promise<Driver>} The driver itself
   *
   * @example
   *   var cookie = await driver.deleteCookie('test')
  */
  async deleteCookie (name) {
    await this._execute('delete', `/cookie/${name}`)
    return this
  }

  /**
   * Delete all cookies
   *
   * @return {Promise<Driver>} The driver itself
   *
   * @example
   *   var list = await driver.deleteAllCookies()
  */
  async deleteAllCookies () {
    await this._execute('delete', '/cookie')
    return this
  }

  /**
   * Dismiss an alert
   *
   * @return {Promise<Driver>} The driver itself
   *
   * @example
   *   await driver.dismissAlert()
  */
  async dismissAlert () {
    await this._execute('post', '/alert/dismiss')
    return this
  }

  /**
   * Accepts an alert
   *
   * @return {Promise<Driver>} The driver itself
   *
   * @example
   *   await driver.acceptAlert()
  */
  async acceptAlert () {
    await this._execute('post', '/alert/accept')
    return this
  }

  /**
   * Get an alert's text
   * @async
   *
   * @return {string} The alert's text
   *
   * @example
   *   var text = await driver.getAlertText()
  */
  getAlertText () {
    return this._execute('get', '/alert/text')
  }

  /**
   * Send text to an alert
   *
   * @param {string} text The text that should be sent
   *
   * @return {Promise<Driver>} The driver itself
   *
   * @example
   *   await driver.sendAlertText('This is my answer')
  */
  async sendAlertText (text) {
    await this._execute('post', '/alert/text', { text })
    return this
  }

  /**
   * Take screenshot
   *   *
   * @return {buffer} The screenshot data
   *
   * @example
   *   await driver.sendAlertText()
  */
  async takeScreenshot () {
    var value = await this._execute('get', '/screenshot')
    return Buffer.from(value, 'base64')
  }

  /**
   * Get active element
   *
   * @return {Element} An object representing the element.
   *
   * @example
   *   var el await driver.getActiveElement()
  */
  async getActiveElement () {
    var value = await this._execute('get', '/element/active')
    return new Element(this, value)
  }

  /**
   * Find an element.
   * Note that you are encouraged to use one of the helper functions:
   * `findElementCss()`, `findElementLinkText()`, `findElementPartialLinkText()`,
   * `findElementTagName()`, `findElementXpath()`
   *
   * @param {string} using It can be `Driver.Using.CSS`, `Driver.Using.LINK_TEXT`,
   *                `Driver.Using.PARTIAL_LINK_TEXT`, `Driver.Using.TAG_NAME`,
   *                `Driver.Using.XPATH`
   * @param {string} value The parameter to the `using` method
   *
   * @return {Element} An object representing the element.
   * @example
   *   var el = await driver.findElement({ Driver.Using.CSS, value: '[name=q]' )
   *
  */
  async findElement (using, value) {
    var el = await this._execute('post', '/element', {using, value})
    return new Element(this, el)
  }

  /**
   * Find several elements
   * Note that you are encouraged to use one of the helper functions:
   * `findElementsCss()`, `findElemenstLinkText()`, `findElementsPartialLinkText()`,
   * `findElementsTagName()`, `findElementsXpath()`
   *
   * @param {string} using It can be `Driver.Using.CSS`, `Driver.Using.LINK_TEXT`,
   *                `Driver.Using.PARTIAL_LINK_TEXT`, `Driver.Using.TAG_NAME`,
   *                `Driver.Using.XPATH`
   * @param {string} value The parameter to the `using` method
   *
   * @return [{Element},{Element},...] An array of elements
   *
   * @example
   *   var el = await driver.findElements({ Driver.Using.CSS, value: '.item' )
   *
  */
  async findElements (using, value) {
    var els = await this._execute('post', '/elements', {using, value})
    if (!Array.isArray(els)) throw new Error('Result from findElements must be an array')
    return els.map((v) => new Element(this, v))
  }
}

exports = module.exports = Driver = FindHelpersMixin(Driver)
