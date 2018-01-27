/*
  [ ] Install JSDoc, check generated documentation
  [ ] Add missing findElement*** docs, make sure they appear in doc
  [ ] Put it online on Github pages, including docco
  [ ] Submit code for review

  [ ] Write initial tests (ah!)
  [ ] Write more tests
*/

var request = require('request-promise-native')
const { spawn } = require('child_process')
var DO = require('deepobject')
const getPort = require('get-port')
var consolelog = require('debug')('webdriver')

const KEY = require('./KEY.js')

const USING = {
  CSS: 'css selector',
  LINK_TEXT: 'link text',
  PARTIAL_LINK_TEXT: 'partial link text',
  TAG_NAME: 'tag name',
  XPATH: 'xpath'
}

function isObject (p) { return typeof p === 'object' && p !== null && !Array.isArray(p) }

function checkRes (res) {
  if (!isObject(res)) throw new Error('Unexpected non-object received from webdriver')
  if (typeof res.value === 'undefined') throw new Error('Missing `value` from object returned by webdriver')
  return res
}

/**
 * Spawns a child process. The returned {@link Command} may be used to wait
 * for the process result or to send signals to the process.
 *
 * "Somewhat" inspired by the `exec` function in the Selenium node driver
 *
 * @param {string} command The executable to spawn.
 * @param {Options=} commandOptions The command options.
 * @return {!Command} The launched command.
 */
function exec (command, commandOptions) {
  var options = commandOptions || {}

  var proc = spawn(command, options.args || [], {
    env: options.env || process.env,
    stdio: options.stdio || 'ignore'
  })

  proc.on('error', (err) => {
    consolelog(`Could not run ${command}:`, err)
    throw new Error(`Error running the webdriver '${command}'`)
  })

  // This process should not wait on the spawned child, however, we do
  // want to ensure the child is killed when this process exits.
  proc.unref()
  process.once('exit', onProcessExit)

  let result = new Promise(resolve => {
    proc.once('exit', (code, signal) => {
      consolelog(`Process ${command} has exited! Code and signal:`, code, signal)
      proc = null
      process.removeListener('exit', onProcessExit)
      resolve({ code, signal })
    })
  })
  return { result, killCommand }

  function onProcessExit () {
    consolelog(`Process closed, killing ${command}`, killCommand)
    killCommand('SIGTERM')
  }

  function killCommand (signal) {
    consolelog(`killCommand() called! sending ${signal} to ${command}`)
    process.removeListener('exit', onProcessExit)
    if (proc) {
      consolelog(`Sending ${signal} to ${command}`)
      proc.kill(signal)
      proc = null
    }
  }
}

function waitForGenerator (self) {
  return function (timeout = 0) {
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

            var endTime = new Date(Date.now() + (timeout || self._defaultPollTimeout))
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
              consolelog('Sleeping, trying again later...')
              await sleep(self._pollInterval)
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
} // End of waitForGenerator

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class Browser {
  constructor (alwaysMatch = {}, firstMatch = [], root = {}) {
    // Sanity check. Things can go pretty bad if these are wrong
    if (!isObject(alwaysMatch)) {
      throw new Error('alwaysMatch must be an object')
    }

    if (!Array.isArray(firstMatch)) {
      throw new Error('firstmatch parameter must be an array')
    }

    if (!isObject(root)) {
      throw new Error('root options must be an object')
    }

    this.sessionParameters = {
      capabilities: {
        alwaysMatch: alwaysMatch,
        firstMatch: firstMatch
      }
    }
    // Copy over whatever is specified in `root`
    for (var k in root) {
      if (root.hasOwnProperty(k)) this.sessionParameters[ k ] = root[k]
    }

    // Give it a nice, lowercase name
    this.name = 'browser'
  }
  setAlwaysMatchKey (name, value, force = false) {
    if (force || !this.sessionParameters.capabilities.alwaysMatch.hasOwnProperty(name)) {
      DO.set(this.sessionParameters.capabilities.alwaysMatch, name, value)
    }
  }

  addFirstMatch (name, value, force = false) {
    if (force || !this.sessionParameters.capabilities.firstMatch.indexOf(name) === -1) {
      this.sessionParameters.capabilities.firstMatch.push({ [name]: value })
    }
  }

  setRootKey (name, value, force = false) {
    if (force || !this.sessionParameters.hasOwnProperty(name)) {
      DO.set(this.sessionParameters, name, value)
    }
  }

  getSessionParameters () {
    return this.sessionParameters
  }

  // Options: port, args, env, stdio
  async run (options) {
  }
}

// https://sites.google.com/a/chromium.org/chromedriver
// https://sites.google.com/a/chromium.org/chromedriver/capabilities
// STATUS: https://chromium.googlesource.com/chromium/src/+/lkcr/docs/chromedriver_status.md
class Chrome extends Browser { // eslint-disable-line no-unused-vars
  constructor (alwaysMatch = {}, firstMatch = [], root = {}, specific = {}) {
    super(...arguments)

    // Give it a nice, lowercase name
    this.name = 'chrome'

    // This is crucial so that Chrome obeys w3c
    this.setAlwaysMatchKey('chromeOptions.w3c', true, true)

    // The required browser's name
    this.setAlwaysMatchKey('browserName', 'chrome')

    // Add specific Options
    for (var k in specific) {
      if (specific.hasOwnProperty(k)) {
        this.alwaysMatch.chromeOptions[ k ] = specific[ k ]
      }
    }
  }

  run (options) {
    var executable = process.platform === 'win32' ? 'chromedriver.exe' : 'chromedriver'
    options.args.push('--port=' + options.port)
    return exec(executable, options)
  }
}

// https://github.com/mozilla/geckodriver
// STATUS: https://developer.mozilla.org/en-US/docs/Mozilla/QA/Marionette/WebDriver/status
class Firefox extends Browser { // eslint-disable-line no-unused-vars
  constructor (alwaysMatch = {}, firstMatch = [], root = {}, specific = {}) {
    super(...arguments)

    // Give it a nice, lowercase name
    this.name = 'firefox'

    // Firefox's empty firefoxOptions
    this.setAlwaysMatchKey('moz:firefoxOptions', {}, true)

    // The required browser's name
    this.setAlwaysMatchKey('browserName', 'firefox')

    // Add specific Options
    for (var k in specific) {
      if (specific.hasOwnProperty(k)) {
        this.alwaysMatch['moz:firefoxOptions'][ k ] = specific[ k ]
      }
    }
  }

  run (options) {
    var executable = process.platform === 'win32' ? 'geckodriver.exe' : 'geckodriver'
    options.args.push('--port=' + options.port)
    return exec(executable, options)
  }
}

class Selenium extends Browser { // eslint-disable-line no-unused-vars
}

class InputDevice {
  constructor (id) {
    this.id = id
  }
}

//  KEYBOARD: "pause", "keyUp", "keyDown"
class Keyboard extends InputDevice {
  constructor (id) {
    super(id)
    this.type = 'key'
  }

  static get UP () {
    return 'keyUp'
  }

  static get DOWN () {
    return 'keyDown'
  }

  tickMethods () {
    return {
      Up: (value) => {
        return {
          type: 'keyUp',
          value
        }
      },

      Down: (value) => {
        return {
          type: 'keyDown',
          value
        }
      }
    }
  }
}

//  POINTER: "pause", "pointerUp", "pointerDown", "pointerMove", or "pointerCancel
class Pointer extends InputDevice {
  constructor (id, pointerType) {
    super(id)
    this.pointerType = pointerType
    this.type = 'pointer'
  }

  static get Type () {
    return {
      MOUSE: 'mouse',
      PEN: 'pen',
      TOUCH: 'touch'
    }
  }

  static get Origin () {
    return {
      VIEWPORT: 'viewport',
      POINTER: 'pointer'
    }
  }

  tickMethods () {
    return {
      Move: (args) => {
        // Work out origin, defaulting to VIEWPORT.
        // If it's an element, it will be seriaslised to please W3c AND Chrome
        // In any case, it MUST be an element, VIEWPORT or POINTER
        var origin
        if (!args.origin) {
          origin = Pointer.Origin.VIEWPORT
        } else {
          if (args.origin instanceof Element) {
            origin = {
              'element-6066-11e4-a52e-4f735466cecf': args.origin.id,
              ELEMENT: args.origin.id
            }
          } else {
            origin = args.origin
            if (origin !== Pointer.Origin.VIEWPORT &&
                origin !== Pointer.Origin.POINTER) {
              throw new Error('When using move(), origin must be an element, Pointer.Origin.VIEWPORT or Pointer.Origin.POINTER')
            } else {
            }
          }
        }

        return {
          type: 'pointerMove',
          duration: args.duration || 0,
          origin,
          x: args.x,
          y: args.y
        }
      },
      Down: (button = 0) => {
        return {
          type: 'pointerDown',
          button
        }
      },
      Up: (button = 0) => {
        return {
          type: 'pointerUp',
          button
        }
      },
      Cancel: () => {
        return {
          type: 'pointerCancel'
        }
      }
    }
  }
}

class Actions {
  constructor (...devices) {
    var self = this
    this.actions = []

    this.compiledActions = []
    // Assign `devices`. If not there, assign a default 'mouse' and 'keyboard'
    if (Object.keys(devices).length) {
      this.devices = devices
    } else {
      this.devices = [
        new Pointer('mouse', Pointer.Type.MOUSE),
        new Keyboard('keyboard')
      ]
    }

    // Make up a _tickSetters object, which are the setters available
    // after `driver.tick`, so that you can do `driver.tick.mouseDown()`
    // The keys `tick` and `compile` are always available, as it's handy to
    // get them as "chained" methods (so that you can do
    // `actions.tick.mouseDown().tick.mouseUp()`
    // The other keys will depend on the devices passed to the
    // `Actions` constructor.
    // With `Actions(new Pointer('fancyMouse'))` will establish
    // `tick.fancyMouseUp()`, `tick.fancyMouseDown()` etc.
    // By default, `new Actions()` will create two devices, called
    // `mouse` and `keyboard`
    //
    this._tickSetters = {
      get tick () {
        return self.tick
      },
      compile: self.compile.bind(self)
    }
    this.devices.forEach((device) => {
      var deviceTickMethods = device.tickMethods()
      Object.keys(deviceTickMethods).forEach((k) => {
        this._tickSetters[device.id + k] = function (...args) {
          if (!self._currentAction[device.id].virgin) {
            throw new Error(`Action for device ${device.id} already defined (${device.id + k}) for this tick`)
          }
          var res = deviceTickMethods[k].apply(device, args)
          self._currentAction[device.id] = res
          return self._tickSetters
        }
        this._tickSetters['pause'] = function (duration = 0) {
          self._currentAction[device.id] = { type: 'pause', duration }
          return self._tickSetters
        }
      })
    })
  }

  static get KEY () { return KEY }

  compile () {
    this.compiledActions = []

    this.devices.forEach((device) => {
      var deviceActions = { actions: [] }
      deviceActions.type = device.type
      deviceActions.id = device.id
      if (device.type === 'pointer') {
        deviceActions.parameters = { pointerType: device.pointerType }
      }

      this.actions.forEach((action) => {
        deviceActions.actions.push(action[ device.id ])
      })
      this.compiledActions.push(deviceActions)
    })

    // console.log('COMPILED ACTIONS:', require('util').inspect(this.compiledActions, {depth: 10}))
  }

  _setAction (deviceId, action) {
    this._currentAction[ deviceId ] = action
  }

  get tick () {
    // Make up the action object. It will be an object where
    // each key is a device ID.
    // By default, ALL actions are set as 'pause'
    var action = {}
    this.devices.forEach((device) => {
      action[ device.id ] = { type: 'pause', duration: 0, virgin: true }
    })
    this.actions.push(action)

    // Set _currentAction, which is what the tickSetters will
    // change
    this._currentAction = action

    // Return the _tickSetters, so that actions.tick.mouse() works
    return this._tickSetters
  }
}

const FindHelpersMixin = (superClass) => class extends superClass {
  findElementCss (value) {
    return this.findElement(Driver.using.CSS, value)
  }

  findElementLinkText (value) {
    return this.findElement(Driver.using.LINK_TEXT, value)
  }

  findElementPartialLinkText (value) {
    return this.findElement(Driver.using.PARTIAL_LINK_TEXT, value)
  }

  findElementTagName (value) {
    return this.findElement(Driver.using.TAG_NAME, value)
  }

  findElementXpath (value) {
    return this.findElement(Driver.using.XPATH, value)
  }

  findElementsCss (value) {
    return this.findElements(Driver.using.CSS, value)
  }

  findElementsLinkText (value) {
    return this.findElements(Driver.using.LINK_TEXT, value)
  }

  findElementsPartialLinkText (value) {
    return this.findElements(Driver.using.PARTIAL_LINK_TEXT, value)
  }

  findElementsTagName (value) {
    return this.findElements(Driver.using.TAG_NAME, value)
  }

  findElementsXpath (value) {
    return this.findElements(Driver.using.XPATH, value)
  }
}

class ElementBase {
  constructor (driver, elObject) {
    var value

    // Assssign the driver
    this.driver = driver

    // elObject will contain `value` if it's a straight answer from the webdriver
    // Otherwise, it's assumed to be passed `res.value`
    if (isObject(elObject) && elObject.value) value = elObject.value
    else value = elObject

    // Sets the ID. Having `element-XXX` and `ELEMENT` as keys to the object means
    // that it can be used by switchToFrame()
    var idx = 'element-6066-11e4-a52e-4f735466cecf'
    this.id = this.ELEMENT = this[idx] = value[idx]

    // No ID could be find
    if (!this.id) throw new Error('Could not get element ID from element object')

    // Make it possible to do element.waitFor()
    this.waitFor = waitForGenerator(this)
  }

  static get KEY () { return KEY }

  /**
   * Find an element within the queried element

   * @param {string} using It can be `Driver.using.CSS`, `Driver.using.LINK_TEXT`,
   *                `Driver.using.PARTIAL_LINK_TEXT`, `Driver.using.TAG_NAME`,
   *                `Driver.using.XPATH`
   * @param {string} value The parameter to the `using` method
   *
   * @return {Promise<Element>} An object representing the element.
   * @example
   *   var el = await driver.findElement( Driver.using.CSS, '[name=q]' )
   *
  */
  async findElement (using, value) {
    var el = await this._execute('post', `/element/${this.id}/element`, {using, value})
    return new Element(this.driver, el)
  }

  /**
   * Find several elements within the queried element
   *
   * @param {string} using It can be `Driver.using.CSS`, `Driver.using.LINK_TEXT`,
   *                `Driver.using.PARTIAL_LINK_TEXT`, `Driver.using.TAG_NAME`,
   *                `Driver.using.XPATH`
   * @param {string} value The parameter to the `using` method
   *
   * @return {Promise<[Element},Element,...]>} An array of elements
   * @example
   *   var el = await driver.findElements( Driver.using.CSS, '.item' })
   *
  */
  async findElements (using, value) {
    var els = await this._execute('post', `/element/${this.id}/elements`, {using, value})
    if (!Array.isArray(els)) throw new Error('Result from findElements must be an array')
    return els.map((v) => new Element(this.driver, v))
  }

  /**
   * Check that the element is selected
   *
   * @return {Promise<boolean>} true of false
   * @example
   *   var el = await driver.findElement( Driver.using.CSS, '#main' })
       var isSelected = await el.isSelected()
   *
  */
  async isSelected () {
    return !!(await this._execute('get', `/element/${this.id}/selected`))
  }

  /**
   * Get attribute called `name` from element
   *
   * @param {string} name The name of the attribute to be fetched
   *
   * @return {Promise<string>} The attribute's value
   * @example
   *   var el = await driver.findElementCss('a' })
   *   var href = el.getAttribute('href')
   *
  */
  getAttribute (name) {
    return this._execute('get', `/element/${this.id}/attribute/${name}`)
  }

  /**
   * Get property called `name` from element
   *
   * @param {string} name The name of the property to be fetched
   *
   * @return {Promise<string>} The property's value
   * @example
   *   var el = await driver.findElementCss('a' })
   *   var href = el.getProperty('href')
   *
  */
  getProperty (name) {
    return this._execute('get', `/element/${this.id}/property/${name}`)
  }

  /**
   * Get css value from element
   *
   * @param {string} name The name of the CSS value to be fetched
   *
   * @return {Promise<string>} The CSS's value
   * @example
   *   var el = await driver.findElementCss('a' })
   *   var height = el.getCssValue('height')
   *
  */
  getCssValue (name) {
    return this._execute('get', `/element/${this.id}/css/${name}`)
  }

  /**
   * Get text value from element
   *
   * @return {Promise<string>} The text
   * @example
   *   var el = await driver.findElementCss('a' })
   *   var text = el.getText()
  */
  getText () {
    return this._execute('get', `/element/${this.id}/text`)
  }

  /**
   * Get tag name from element
   *
   * @return {Promise<string>} The tag's name
   * @example
   *   var el = await driver.findElementCss('.link' })
   *   var tagName = el.getTagName()
  */
  getTagName () {
    return this._execute('get', `/element/${this.id}/name`)
  }

  /**
   * Get rectfrom element
   *
   * @return {Promise<string>} The rect info

   * @example
   *   var el = await driver.findElementCss('a' })
   *   var rect = el.getRect()
  */
  getRect () {
    return this._execute('get', `/element/${this.id}/rect`)
  }

  /**
   * Check that the element is enabled
   *
   * @return {Promise<boolean>} true of false
   * @example
   *   var el = await driver.findElement( Driver.using.CSS, '#main' })
       var isSelected = await el.isSelected()
   *
  */
  async isEnabled () {
    return !!(await this._execute('get', `/element/${this.id}/enabled`))
  }

  /**
   * Click on an element
   *
   * @return {Promise<Element>} The element itself
   * @example
   *   var el = await driver.findElement( Driver.using.CSS, '#button' })
       await el.click()
   *
  */
  async click () {
    await this._execute('post', `/element/${this.id}/click`)
    return this
  }

  /**
   * Clean an element
   *
   * @return {Promise<Element>} The element itself
   * @example
   *   var el = await driver.findElement( Driver.using.CSS, '#input' })
   *   await el.clear()
   *
  */
  async clear () {
    await this._execute('post', `/element/${this.id}/clear`)
    return this
  }

  /**
   * Send keys to an element
   *
   * @return {Promise<Element>} The element itself. Concatenate with `Element.KEY` to send
   *                              special characters.
   * @example
   *   var el = await driver.findElement( Driver.using.CSS, '#input' })
   *   await e.sendKeys("This is a search" + Element.KEY.ENTER)
   *
  */
  async sendKeys (text) {
    // W3c: Adding 'value' to parameters, so that Chrome works too
    var value = text.split('')
    await this._execute('post', `/element/${this.id}/value`, { text, value })
    return this
  }

  /**
   * Take screenshot of the element
   * @param {boolean} scroll If true (by default), it will scroll to the element
   * @return {Promise<Buffer>} The screenshot data in a Buffer object
   * @example
   *   var el = await driver.findElement( Driver.using.CSS, '#input' })
   *   var screenshot = await el.takeScreenshot()
   *
  */
  async takeScreenshot (scroll = true) {
    var data = await this._execute('get', `/element/${this.id}/screenshot`, { scroll })
    return Buffer.from(data, 'base64')
  }

  async _execute (method, command, params) {
    return this.driver._execute(method, command, params)
  }
}

// Options: hostname, port, spawn, env, stdio, args,pollInterval
class DriverBase {
  constructor (browser, options = {}) {
    this._browser = browser
    this._hostname = options.hostname || '127.0.0.1'
    this._spawn = typeof options.spawn !== 'undefined' ? !!options.spawn : true
    this._webDriverRunning = !this._spawn

    // Parameters passed onto child process
    this._port = options.port
    this._env = isObject(options.env) ? options.env : process.env
    this._stdio = options.stdio || 'ignore'
    this._args = Array.isArray(options.args) ? options.args : []

    this._killCommand = null
    this._commandResult = null

    this._pollInterval = 300
    this._defaultPollTimeout = 10000
    this._urlBase = null

    // Make it possible to do driver.waitFor()
    this.waitFor = waitForGenerator(this)
  }

  stopWebDriver (signal = 'SIGTERM') {
    if (this._killCommand) {
      this._killCommand(signal)

      this.killWebDriver('SIGTERM')
      this._webDriverRunning = false
    }
  }

  async startWebDriver () {
    // If it's already connected, nothing to do
    if (this._webDriverRunning) return

    // If spawning is required, do so
    if (this._spawn) {
      // No port: find a free port
      if (!this._port) {
        this._port = await getPort({ host: this._hostname })
      }

      // Options: port, args, env, stdio
      var res = this._browser.run({
        port: this._port,
        args: this._args,
        env: this._env,
        stdio: this._stdio }
      )
      this._killCommand = res.killCommand
      this._commandResult = res.result
    }

    // It's still possible that no port has been set, since spawn was false
    // and no port was defined. In such a case, use the default 4444
    if (!this.port) this.port = '4444'

    // `_hostname` and `_port` are finally set: make up the first `urlBase`
    this._urlBase = `http://${this._hostname}:${this._port}/session`

    // Check that the server is up, by asking for the status
    // It might take a little while for the
    var success = false
    for (var i = 0; i < 10; i++) {
      if (i > 5) {
        consolelog(`Attempt n. ${i} to connect to ${this._hostname}, port ${this._port}... `)
      }
      try {
        await this.status()
        success = true
        break
      } catch (e) {
        await this.sleep(1000)
      }
    }
    if (!success) {
      throw new Error(`Could not connect to the driver`)
    }

    // Connection worked...
    this._webDriverRunning = true
  }

  _ready () {
    return !!(this._sessionId && this._webDriverRunning)
  }

  inspect () {
    return `DriverBase { ip: ${this.Name}, port: ${this._port} }`
  }

  /**
   * Create a new session

   *
   * @return {Promise<session>} o The object with the timeouts
   * @return {object} o.capabiities An object representing the capabilities of the web driver
   * @return {string} o.sessionId The sessionId
   *
   * @example
   *   var timeouts = await driver.setTimeouts({ implicit: 7000 })
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
      if (isObject(value) &&
          isObject(value.capabilities) &&
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
   * Delete the session
   *
   * {Promise<Driver>} The driver itself
   *
   * @example
   *   await driver.deleteSession()
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
   * @return {Promise<string>} The page title
   *
   * @example
   *   var status = await driver.status()
  */
  async status () {
    var _urlBase = `http://${this._hostname}:${this._port}`
    var res = await request.get({ url: `${_urlBase}/status`, json: true })
    return checkRes(res).value
  }

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
    return checkRes(res).value
  }

  static get using () { return USING }

/**
 * Get timeouts
 * *
 * @return {Promise<Object>} A promise resolving to an object
                     with keys `implicit`, `pageLoad` and `script `. E.g.
                    `{ implicit: 0, pageLoad: 300000, script: 30000 }`
 *
 * @example
 *   var timeouts = await driver.getTimeouts()
*/
  getTimeouts () {
    return this._execute('get', '/timeouts')
  }

  /**
   * Set timeouts
   *
   * @param {<object>} param The object with the timeouts
   * @param {number} param.implicit Implicit timeout
   * @param {number} param.pageLoad Timeout for page loads
   * @param {number} param.script Timeout for scripts
   *
   * @example
   *   var timeouts = await driver.setTimeouts({ implicit: 7000 })
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
   *   await driver.navigateTo('http://www.google.com')
  */
  async navigateTo (url) {
    await this._execute('post', '/url', { url })
    return this
  }

  /**
   * Bake a cake without coffee
   *
   * @return {Promise<string>} The URL
   * @example
   *   var currentUrl = await driver.getCurrentUrl()
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
   *   await driver.back()
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
   *   await driver.forward()
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
   *   await driver.forward()
  */
  async refresh () {
    await this._execute('post', '/refresh')
    return this
  }

  /**
   * Get page title
   *
   * @return {Promise<string>} The page title
   *
   * @example
   *   var title = await driver.getTitle()
  */
  getTitle () {
    return this._execute('get', '/title')
  }

  /**
   * Get the current window's handle
   *
   * @return {Promise<string>} The handle
   *
   * @example
   *   var title = await driver.getWindowHandle()
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
   *   await driver.close()
  */
  async closeWindow () {
    await this._execute('delete', '/window')
  }

  /**
   * Switch to window
   *
   * @return {Promise<Driver>} The driver itself
   *
   * @param {handle} string The window handle to switched to
   * @example
   *   await driver.close()
  */
  async switchToWindow (handle) {
    await this._execute('post', '/window', { handle })
    return this
  }

  /**
   * Get window handles as an array
   *
   * @return {Promise<[string,string,...]>} An array of window handles
   *
   * @example
   *   await driver.getWindowHandles()
  */
  getWindowHandles () {
    return this._execute('get', '/window/handles')
  }

  /**
   * Switch to frame
   *
   * @param {string|number|Element} The Element object, or element ID, of the frame
   * @return {Promise<Driver>} The driver itself
   *
   * @example
   *   var frame = await driver.findElementCss('iframe')
   *   await driver.switchToFrame(frame)
  */
  switchToFrame (id) {
    // W3c: Chrome is not compliant, doing its job
    if (id instanceof Element || typeof id === 'object') id = id.id
    return this._execute('post', '/frame', { id })
  }

  /**
   * Switch to the parent frame
   *
   * @return {Promise<Driver>} The driver itself
   *
   * @example
   *   await driver.close()
  */
  async switchToParentFrame () {
    await this._execute('post', '/frame/parent')
    return this
  }

  /**
   * Get window rect
   *
   * @return {Promise<Object>} An object with properties `height`, `width`, `x`, `y`
   *
   * @example
   *   await driver.getWindowRect()
  */
  getWindowRect () {
    return this._execute('get', '/window/rect')
  }

  /**
   * Set window rect
   *
   * @param {Promise<Object>} rect An object with properties `height`, `width`, `x`, `y`
   *
   * @return {Promise<Object>} An object with properties `height`, `width`, `x`, `y`
   *
   * @example
   *   await driver.getWindowRect()
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
   *   await driver.maximizeWindow()
  */
  async maximizeWindow () {
    return this._execute('post', '/window/maximize')
  }

  /**
   * Minimize window
   *
   * @return {Promise<Driver>} The driver itself
   *
   * @example
   *   await driver.minimizeWindow()
  */
  minimizeWindow () {
    return this._execute('post', '/window/minimize')
  }

  /**
   * Make window full screen
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
   *
   * @return {Promise<string>} The current page's source
   *
   * @example
   *   await driver.getPageSource()
  */
  getPageSource () {
    return this._execute('get', '/source')
  }

  /**
   * Execute sync script
   *
   * @param {string} script The string with the script to be executed
   * @param {array} [args] The arguments to be passed to the script

   * @return {...} Whatever was returned by the javascript code with a `return` statement
   *
   * @example
   *   await driver.executeScript('return 'Hello ' + arguments[0];', ['tony'])
  */
  executeScript (script, args = []) {
    return this._execute('post', '/execute/sync', { script, args })
  }

  /**
   * Execute sync script
   * NOTE: An extra argument is added to the passed argument: it's a callback
   *       function that will need to be called once the script has executed.
   *       To return a value, pass that value to the callback
   *
   * @param {string} script The string with the script to be executed
   * @param {array} [args] The arguments to be passed to the script
   *
   * @return {...} Whatever was returned by the javascript code by calling the callback
   *
   * @example
   *   await driver.executeAsyncScript('var name = arguments[0];var cb = arguments[1];cb('Hello ' + name);', ['tony'])
  */
  executeAsyncScript (script, args = []) {
    return this._execute('post', '/execute/async', { script, args })
  }

  /**
   * Get all cookies
   *
   * @return {[Object, Object,...]} An array of cookie objects.
   *
   * @example
   *   var list = await driver.getAllCookies()
  */
  getAllCookies () {
    return this._execute('get', '/cookie')
  }

  /**
   * Get cookies matching a specific name
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
   *   await driver.sendAlertText()
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

  async performActions (actions) {
    if (!actions.compiledActions.length) actions.compile()
    await this._execute('post', '/actions', { actions: actions.compiledActions })
    return this
  }

  async releaseActions () {
    await this._execute('delete', '/actions')
    return this
  }

  /**
   * Find an element

   * @param {string} using It can be `Driver.using.CSS`, `Driver.using.LINK_TEXT`,
   *                `Driver.using.PARTIAL_LINK_TEXT`, `Driver.using.TAG_NAME`,
   *                `Driver.using.XPATH`
   * @param {string} value The parameter to the `using` method
   *
   * @return {Element} An object representing the element.
   * @example
   *   var el = await driver.findElement({ Driver.using.CSS, value: '[name=q]' )
   *
  */
  async findElement (using, value) {
    var el = await this._execute('post', '/element', {using, value})
    return new Element(this, el)
  }

  /**
   * Find several elements
   *
   * @param {string} using It can be `Driver.using.CSS`, `Driver.using.LINK_TEXT`,
   *                `Driver.using.PARTIAL_LINK_TEXT`, `Driver.using.TAG_NAME`,
   *                `Driver.using.XPATH`
   * @param {string} value The parameter to the `using` method
   *
   * @return [{Element},{Element},...] An array of elements
   *
   * @example
   *   var el = await driver.findElements({ Driver.using.CSS, value: '.item' )
   *
  */
  async findElements (using, value) {
    var els = await this._execute('post', '/elements', {using, value})
    if (!Array.isArray(els)) throw new Error('Result from findElements must be an array')
    return els.map((v) => new Element(this, v))
  }

  async sleep (ms) {
    return sleep(ms)
  }
}

// Mixin the find helpers with DriverBase and ElementBase
var Driver = FindHelpersMixin(DriverBase)
var Element = FindHelpersMixin(ElementBase)

;(async () => {
  try {
/*
* `browserName` -- Browser name -- string Identifies the user agent.
* `browserVersion` -- Browser version -- string Identifies the version of the user agent.
* `platformName` -- Platform name -- string Identifies the operating system of the endpoint node.
* `acceptInsecureCerts` -- Accept insecure TLS certificates -- boolean -- Indicates whether untrusted and self-signed TLS certificates are implicitly trusted on navigation for the duration of the session.
* `pageLoadStrategy` -- Page load strategy -- string -- Defines the current session’s page load strategy.
* `proxy` -- Proxy configuration JSON -- Object -- Defines the current session’s proxy configuration.
* `setWindowRect` -- Window dimensioning/positioning 'setWindowRect' -- boolean -- Indicates whether the remote end supports all of the commands in Resizing and Positioning Windows.
* `timeouts` -- Session timeouts -- configuration JSON -- Object -- Describes the timeouts imposed on certain session operations.
* `unhandledPromptBehavior` Unhandled prompt behavior -- string -- Describes the current session’s user prompt handler.
*/

  /*
    // var actions = new Actions(new Pointer('mouse'), new Keyboard('keyboard'))
    var actions = new Actions(new Keyboard('keyboard'))

    console.log('BEFORE:', actions, '\n\nAND:', actions.actions, '\n\n')
    actions.tick.keyboardUp('r')
    actions.tick.keyboardDown('r').tick.keyboardDown('R')
    actions.tick.keyboardDown('p').compile()
    actions.tick.keyboardUp('p')
    actions.compile()
*/

/*
    var driver = new Driver(new Firefox(), { port: 1000, spawn: false })
    await driver.connect() <--- also runs 'driver.newSession()'

    connect will:
      - Look for a free port. Make 'port' a default settable option
      - Run the browser on that port
      - Make the connection on that port
      - Create a session with driver.newSession()
*/
    //
    // var firefox = new Firefox()
    // var chrome = new Chrome()
    // var driver = new Driver('127.0.0.1', 4444) // 4444 or 9515
    // var driver = new Driver(firefox) // 4444 or 9515

    // await driver.newSession(firefox)

    // console.log('SESSION: ', await driver.newSession({}))

    // await driver.navigateTo({ url: 'http://www.google.com' })

    // var el = await driver.findElements({ using: Driver.using.CSS, value: '[name=q]' })
    // console.log('ELEMENTS:', el)

    // console.log('TRY:', await el[0].sendKeys({ text: 'thisworksonfirefox', value: ['c', 'h', 'r', 'o', 'm', 'e'] }))
    // console.log('TRY:', await el[0].sendKeys({ text: 'thisworksonfirefoxandchrome' + Element.KEY.ENTER }))

    var driver = new Driver(new Chrome(), { spawn: true })
    await driver.newSession()

    console.log('Loading Google:', await driver.waitFor(6000).navigateTo('https://www.google.com'))

    console.log('Maximize:')
    await driver.maximizeWindow()
    console.log('(done)')
    await driver.sleep(2000)

    console.log('Minimize:')
    await driver.minimizeWindow()
    console.log('(done)')
    await driver.sleep(2000)

    console.log('Maximize again:')
    await driver.maximizeWindow()
    console.log('(done)')
    await driver.sleep(2000)

    console.log('Full screen:')
    await driver.fullScreenWindow()
    console.log('(done)')
    await driver.sleep(2000)

    await driver.sleep(2000)
    await driver.navigateTo('https://gigsnet.com')

    var el = await driver.findElementCss('body')
    console.log('BODY ELEMENT:', el)

    console.log('GIGSNET', await el.waitFor(10000).findElementsCss('paper-card.my-book-city', (r) => r.length))

    await driver.sleep(3000)

    await driver.navigateTo('http://usejsdoc.org')
    var article = await driver.findElementCss('article')
    console.log('Article:', article)

    console.log('TIMEOUTS:', await driver.getTimeouts())
    // console.log('SETTIMEOUTS:', await driver.setTimeouts({ implicit: 0, pageLoad: 300000, script: 30000 }))
    console.log('TIMEOUTS AGAIN:', await driver.getTimeouts())

    var dts = await article.findElementsCss('dt')
    var dt0Text = await dts[0].getText()
    console.log('TEXT', dt0Text)

    var actions = new Actions()
    console.log('BEFORE:', actions, '\n\nAND:', actions.actions, '\n\n')
    actions.tick.mouseDown().keyboardDown('R')
    actions.tick.mouseMove({ origin: dts[3], x: 10, y: 20, duration: 1000 })
    actions.tick.mouseDown().keyboardUp('r')
    actions.tick.mouseUp().tick.keyboardDown('p')
    actions.tick.keyboardUp('p')
    actions.compile()

    await driver.performActions(actions)

    // process.exit(0)
    /* eslint-disable */

    console.log('Selected:', await dts[0].isSelected())
    console.log('Enabled:', await dts[0].isEnabled())

    var h2 = await driver.findElementCss('h2#block-tags')
    console.log('SEE ATTR:', await h2.getAttribute('id'))
    // console.log('SEE PROP:', await h2.getProperty('id'))
    console.log('SEE CSS VAL:', await h2.getCssValue('height'))
    console.log('SEE TAG NAME VAL:', await h2.getTagName())
    // console.log('SEE RECT:', await h2.getRect())

    console.log('SEE CLICK:', await h2.click())
    // console.log('SEE CLEAR:', await h2.clear())
    // console.log('SEE SCREENSHOT:', await h2.takeScreenshot())

    await driver.waitFor(6000).navigateTo('http://www.google.com')
    console.log('PAGE SOURCE:', await driver.getPageSource())
    // var q = await driver.findElementCss('[name=q]')
    // await q.sendKeys('stocazzo' + Element.KEY.ENTER)
    // console.log('WTF', q, q.id, q.ELEMENT)

    // console.log('EXECUTE 0 PRETEND:')
    // await driver.sleep(5000)

    /*
    console.log('EXECUTE 0:', await driver.executeScript('prompt('pippo');return 'Hello ' + arguments[0];', ['tony']))
    await driver.sleep(2000)
    console.log('Alert text:', await driver.getAlertText())
    await driver.sendAlertText('aaaaa')
    // await driver.dismissAlert()
    await driver.sleep(2000)
    */

    var el = await driver.getActiveElement()
    console.log('Active Element:', el)
    var elsc = await el.takeScreenshot(true)
    console.log('Active Element screenshot:', elsc)

    var sc = await driver.takeScreenshot()
    console.log('Screenshot:', sc)

    var fs = require('fs')
    fs.writeFileSync('/tmp/elsc.png', elsc)
    fs.writeFileSync('/tmp/sc.png', sc)

    console.log('EXECUTE 1:', await driver.executeAsyncScript("var name = arguments[0];var cb = arguments[1];cb('Hello ' + name);", ['tony']))

    console.log('Cookies', await driver.getAllCookies())
    console.log('Cookie named', await driver.getNamedCookie('NID'))

    console.log('Deleting cookie named', await driver.deleteCookie('NID'))
    console.log('ALL Cookies again', await driver.getAllCookies())
    console.log('Deleting ALL cookies', await driver.deleteAllCookies())
    console.log('ALL Cookies again 2', await driver.getAllCookies())

    console.log('Set cookie', await driver.addCookie({
      name: 'test',
      value: 'a test',
      path: '/',
      domain: 'google.com.au',
      expiry: 1732569047,
      secure: true,
      httpOnly: true
    }))

    console.log('Cookie named test', await driver.getNamedCookie('test'))


    // console.log('EXECUTE 1:', await driver.executeAsyncScript("var a = arguments; var name = a[0]; var cb = a[1]; alert('Hello ' + name); setTimeout( () => { cb('ahah!') }, 2000);", ['tony']))
    // console.log('EXECUTE:', await driver.executeScript("alert('Stocazzo! '+ arguments[0])", ['a', 'b', 'c']))
    console.log('Window handleS:', await driver.getWindowHandles())

    // console.log('Switch to frame:', await driver.switchToFrame(q))
    console.log('Switch to parent frame:', await driver.switchToParentFrame())

    console.log('STATUS:', await driver.status())

    console.log('TITLE:', await driver.getTitle())

    console.log('RECT:', await driver.getWindowRect())
    console.log('SET RECT:', await driver.setWindowRect({x: 10, y: 10, width: 800, height: 800}))

    console.log('CURRNET URL:', await driver.getCurrentUrl())
    console.log('BACK:')
    await driver.back()
    console.log('CURRNET URL:', await driver.getCurrentUrl())
    console.log('BACK:')
    await driver.forward()
    console.log('CURRNET URL:', await driver.getCurrentUrl())
    console.log('Refreshing...')
    await driver.refresh()
    console.log('Window handle:', await driver.getWindowHandle())
    var wn = await driver.getWindowHandle()
    console.log('Switch to window:')
    await driver.switchToWindow(wn)

    console.log('Maximize:')
    await driver.maximizeWindow()
    await driver.sleep(1000)

    console.log('Minimize:')
    await driver.minimizeWindow()
    await driver.sleep(1000)

    console.log('Maximize again:')
    await driver.maximizeWindow()
    await driver.sleep(1000)

    console.log('Full screen:')
    await driver.fullScreenWindow()
    await driver.sleep(1000)

    // await driver.closeWindow()

    await driver.sleep(5000)

    // console.log('TIMEOUTS:', await driver.getTimeouts())

    // console.log('And:', await driver.getCurrentUrl())

    // console.log('EXECUTE:', await driver.closeWindow())
    await driver.deleteSession()
  } catch (e) {
    console.log('ERROR:', e)
  }
})()
