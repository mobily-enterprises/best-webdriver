/*
  TODO:

  Make up skeleton:
  [ ] Run each method, document parameters making constants when necessary
    [ ] Include Actions API

  [ ] Install JSDoc, check generated documentation
  [ ] Add missing findElement*** docs, make sure they appear in doc
  [ ] You wrote an API! Double check documentation, put it online

https://stackoverflow.com/questions/48396991/the-capabilities-object-in-webdriver-what-are-capabilities-and-firstmatch-e

  Finish it off:
  [ ] Add code to run chrome (or whatever) automatically, passing parameters for port and more
  [ ] Add "wait" statement, poll and checks for a condition with possible timeout

  Make it production-ready
  [ ] Write tests (ah!)

DONE:
  [X] Figure out why sessionId is in value in firefox, and in object root in chrome
  [X] Understand the element-6066-11e4-a52e-4f735466cecf and w3c_compliant issue
  [X] Maybe create element type, and have call-forwarding for nice chaining.
  [X] Allow entering a string as sendKeys, add constants if needed
  [X] Understand the real differences between different browsers' responses in calls
  [X] Add browser requirement string spec, and other parameters

  http://usejsdoc.org/
  https://w3c.github.io/webdriver/webdriver-spec.html#get-element-property
  https://chromium.googlesource.com/chromium/src/+/lkcr/docs/chromedriver_status.md
  https://stackoverflow.com/questions/6460604/how-to-describe-object-arguments-in-jsdoc
*/

var request = require('request-promise-native')

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

class Parameters {
  constructor () {
    this.data = {
      capabilities: {
        alwaysMatch: {},
        firstMatch: []
      }
    }
  }
  alwaysMatch (name, value) {
    this.data.capabilities.alwaysMatch[ name ] = value
  }

  firstMatch (name, value) {
    this.data.capabilities.firstMatch.push({ [name]: value })
  }

  rootParameter (name, value) {
    this.data[ name ] = value
  }

  getData () {
    return this.data
  }
}

class ChromeParameters extends Parameters { // eslint-disable-line no-unused-vars
  constructor () {
    super()

    // This is crucial so that Chrome obeys w3c
    this.alwaysMatch('chromeOptions', { w3c: true })
    this.alwaysMatch('browserName', 'chrome')
  }
}

class FirefoxParameters extends Parameters { // eslint-disable-line no-unused-vars
  constructor () {
    super()
    this.alwaysMatch('browserName', 'firefox')
  }
}

const FindHelpersMixin = (superClass) => class extends superClass {
  // TODO: Document these once I know documentation works
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

    // Get the ID, using W3C's standard way
    this.id = value['element-6066-11e4-a52e-4f735466cecf']

    // No ID could be find
    if (!this.id) throw new Error('Could not get element ID from element object')
  }

  static get KEY () { return KEY }

  /**
   * Find an element within the queried element

   * @param {string} using It can be `Driver.using.CSS`, `Driver.using.LINK_TEXT`,
   *                `Driver.using.PARTIAL_LINK_TEXT`, `Driver.using.TAG_NAME`,
   *                `Driver.using.XPATH`
   * @param {string} value The parameter to the `using` method
   *
   * @return {Element} An object representing the element.
   * @example
   *   var el = await driver.findElement( Driver.using.CSS, '[name=q]' )
   *
  */
  async findElement (using, value) {
    var res = await this._execute('post', `/element/${this.id}/element`, {using, value})
    checkRes(res)
    return new Element(this.driver, res)
  }

  /**
   * Find several elements within the queried element
   *
   * @param {string} using It can be `Driver.using.CSS`, `Driver.using.LINK_TEXT`,
   *                `Driver.using.PARTIAL_LINK_TEXT`, `Driver.using.TAG_NAME`,
   *                `Driver.using.XPATH`
   * @param {string} value The parameter to the `using` method
   *
   * @return [{Element},{Element},...] An array of elements
   * @example
   *   var el = await driver.findElements( Driver.using.CSS, '.item' })
   *
  */
  async findElements (using, value) {
    var res = await this._execute('post', `/element/${this.id}/elements`, {using, value})

    checkRes(res)
    if (!Array.isArray(res.value)) throw new Error('Result from findElements must be an array')

    return res.value.map((v) => new Element(this.driver, v))
  }

  /**
   * Check that the element is selected
   *
   * @return {boolean} true of false
   * @example
   *   var el = await driver.findElement( Driver.using.CSS, '#main' })
       var isSelected = await el.isSelected()
   *
  */
  async isSelected () {
    return !!checkRes(await this._execute('get', `/element/${this.id}/selected`)).value
  }

  /**
   * Get attribute called `name` from element
   *
   * @param {string} name The name of the attribute to be fetched
   *
   * @return {string} The attribute's value
   * @example
   *   var el = await driver.findElementCss('a' })
   *   var href = el.getAttribute('href')
   *
  */
  async getAttribute (name) {
    return checkRes(await this._execute('get', `/element/${this.id}/attribute/${name}`)).value
  }

  /**
   * Get property called `name` from element
   *
   * @param {string} name The name of the property to be fetched
   *
   * @return {string} The property's value
   * @example
   *   var el = await driver.findElementCss('a' })
   *   var href = el.getProperty('href')
   *
  */
  async getProperty (name) {
    return checkRes(await this._execute('get', `/element/${this.id}/property/${name}`)).value
  }

  /**
   * Get css value from element
   *
   * @param {string} name The name of the CSS value to be fetched
   *
   * @return {string} The CSS's value
   * @example
   *   var el = await driver.findElementCss('a' })
   *   var height = el.getCssValue('height')
   *
  */
  async getCssValue (name) {
    return checkRes(await this._execute('get', `/element/${this.id}/css/${name}`)).value
  }

  /**
   * Get text value from element
   *
   * @return {string} The text
   * @example
   *   var el = await driver.findElementCss('a' })
   *   var text = el.getText()
  */
  async getText () {
    return checkRes(await this._execute('get', `/element/${this.id}/text`)).value
  }

  /**
   * Get tag name from element
   *
   * @return {string} The tag's name
   * @example
   *   var el = await driver.findElementCss('.link' })
   *   var tagName = el.getTagName()
  */
  async getTagName () {
    return checkRes(await this._execute('get', `/element/${this.id}/name`)).value
  }

  /**
   * Get rectfrom element
   *
   * @return {string} The rect info

   * @example
   *   var el = await driver.findElementCss('a' })
   *   var rect = el.getRect()
  */
  async getRect () {
    return checkRes(await this._execute('get', `/element/${this.id}/rect`)).value
  }

  /**
   * Check that the element is enabled
   *
   * @return {boolean} true of false
   * @example
   *   var el = await driver.findElement( Driver.using.CSS, '#main' })
       var isSelected = await el.isSelected()
   *
  */
  async isEnabled () {
    return !!checkRes(await this._execute('get', `/element/${this.id}/enabled`)).value
  }

  /**
   * Click on an element
   *
   * @return {Element} The element itself
   * @example
   *   var el = await driver.findElement( Driver.using.CSS, '#button' })
       await el.click()
   *
  */
  async click () {
    checkRes(await this._execute('post', `/element/${this.id}/click`))
    return this
  }

  /**
   * Clean an element
   *
   * @return {Element} The element itself
   * @example
   *   var el = await driver.findElement( Driver.using.CSS, '#input' })
   *   await el.clear()
   *
  */
  async clear () {
    checkRes(await this._execute('post', `/element/${this.id}/clear`))
    return this
  }

  /**
   * Send keys to an element
   *
   * @return {Element} The element itself. Concatenate with `Element.KEY` to send
   *                   special characters.
   * @example
   *   var el = await driver.findElement( Driver.using.CSS, '#input' })
   *   await el.sendKeys("This is a search" + Element.KEY.ENTER)
   *
  */
  async sendKeys (text) {
    // W3c: Adding 'value' to parameters, so that Chrome works too
    var value = text.split('')
    checkRes(await this._execute('post', `/element/${this.id}/value`, { text, value }))
    return this
  }

  /**
   * Take screenshot of the element
   *
   * @return {Element} The element itself
   * @example
   *   var el = await driver.findElement( Driver.using.CSS, '#input' })
   *   await el.takeScreenshot()
   *
  */
  async takeScreenshot () {
    checkRes(await this._execute('get', `/element/${this.id}/screenshot`))
    return this
  }

  async _execute (method, command, params) {
    return this.driver._execute(method, command, params)
  }
}

class DriverBase {
  constructor (ip = null, port = null, capabilities = {}) {
    this.ip = ip
    this.port = port
    this.capabilities = capabilities
    this.sessionId = null
    this._urlBase = `http://${this.ip}:${this.port}/session`
  }

  _ready () {
    return this.sessionId && this.ip && this.port
  }

  async newSession (parameters) {
    try {
      var res = await this._execute('post', '', parameters.getData())
      // var res = await this._execute('post', '', { desiredCapabilities: {} })

      // W3C conforming response; checked if value is an object containing a `capabilities` object property
      // and a `sessionId` string property
      var value = res.value
      if (isObject(value) &&
          isObject(value.capabilities) &&
          typeof value.capabilities.browserName === 'string' &&
          typeof value.sessionId === 'string'
      ) {
        this.sessionCapabilities = value.capabilities
        this.sessionId = value.sessionId
      }
      if (!this.sessionId || !this.sessionCapabilities) throw new Error('Could not get sessionId and capabilities out of returned object')

      this._urlBase = `http://${this.ip}:${this.port}/session/${this.sessionId}`
      return res
    } catch (e) {
      this.sessionId = null
      this._sessionData = {}
      this._urlBase = `http://${this.ip}:${this.port}/session`
      throw (e)
    }
  }

  async deleteSession () {
    try {
      var res = await this._execute('delete', '')
      this.sessionId = null
      this._sessionData = {}
      this._urlBase = `http://${this.ip}:${this.port}/session`
      return res
    } catch (e) {
      throw (e)
    }
  }

  async status () {
    var _urlBase = `http://${this.ip}:${this.port}`
    return request.get(`${_urlBase}/status`)
  }

  async _execute (method, command, params) {
    // Check that session has been created
    if (!(method === 'post' && command === '' && !this.sessionId)) {
      if (!this._ready()) throw new Error('Executing command on non-ready driver')
    }

    var p = { url: `${this._urlBase}${command}` }

    p.json = method === 'post' ? params || {} : true

    // This will return a promise
    return request[method](p)
  }

  static get using () { return USING }

/**
 * Get timeouts for session
 * *
 * @return {object} An object with keys { implicit: 0, pageLoad: 300000, script: 30000 }
 *
 * @example
 *   var timeouts = await driver.getTimeouts()
*/
  async getTimeouts () {
    return checkRes(await this._execute('get', '/timeouts')).value
  }

  /**
   * Set timeouts for session
   *
   * @param {object} param The object with the timeouts
   * @param {number} param.implicit Implicit timeout
   * @param {number} param.pageLoad Timeout for page loads
   * @param {number} param.script Timeout for scripts
   *
   * @example
   *   var timeouts = await driver.setTimeouts({ implicit: 7000 })
  */
  async setTimeouts (parameters) {
    return checkRes(await this._execute('post', '/timeouts', parameters)).value
  }

  /**
   * Navigate to page
   *
   * @return {Driver} The driver itself
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
   * @example
   *   var currentUrl = await driver.setCurrentUrl()
  */
  getCurrentUrl () {
    return this._execute('get', '/url')
  }

  /**
   * Go back one step
   *
   * @return {Driver} The driver itself
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
   * @return {Driver} The driver itself
   *
   * @example
   *   await driver.forward()
  */
  async forward () {
    await this._execute('post', '/forward')
    return this
  }

  refresh (p) {
    return this._execute('post', '/refresh', p)
  }

  getTitle (p) {
    return this._execute('get', '/title', p)
  }

  getWindowHandle (p) {
    return this._execute('get', '/window', p)
  }

  closeWindow (p) {
    return this._execute('delete', '/window', p)
  }

  switchToWindow (p) {
    return this._execute('post', '/window', p)
  }

  getWindowHandles (p) {
    return this._execute('get', '/window/handles', p)
  }

  switchtoFrame (p) {
    return this._execute('post', '/frame', p)
  }

  switchtoParentFrame (p) {
    return this._execute('post', '/parent/frame', p)
  }

  getWindowRect (p) {
    return this._execute('get', '/window/rect', p)
  }

  setWindowRect (p) {
    return this._execute('post', '/window/rect', p)
  }

  maximizeWindow (p) {
    return this._execute('post', '/window/maximize', p)
  }

  minimizeWindow (p) {
    return this._execute('post', '/window/minimize', p)
  }

  fullScreenWindow (p) {
    return this._execute('post', '/window/fullscreen', p)
  }

  getPageSource (p) {
    return this._execute('get', '/source', p)
  }

  executeScript (p) {
    return this._execute('post', '/execute/sync', p)
  }

  executeAsyncScript (p) {
    return this._execute('post', '/execute/async', p)
  }

  getAllCookies (p) {
    return this._execute('get', '/cookie', p)
  }

  getNamedCookie (name, p) {
    return this._execute('get', `/cookie/${name}`, p)
  }

  addCookie (p) {
    return this._execute('post', '/cookie', p)
  }

  deleteCookie (name, p) {
    return this._execute('get', `/cookie/${name}`, p)
  }

  deleteAllCookies (p) {
    return this._execute('delete', '/cookie', p)
  }

  dismissAlert (p) {
    return this._execute('post', '/alert/dismiss', p)
  }

  acceptAlert (p) {
    return this._execute('post', '/alert/accept', p)
  }

  getAlertText (p) {
    return this._execute('get', '/alert/text', p)
  }

  sendAlertText (p) {
    return this._execute('post', '/alert/text', p)
  }

  takeScreenshot (p) {
    return this._execute('get', '/screenshot', p)
  }

  getActiveElement (p) {
    return this._execute('get', '/element/active', p)
  }

  performActions (p) {
    return this._execute('post', '/actions', p)
  }

  releaseActions (p) {
    return this._execute('delete', '/actions', p)
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
    var res = await this._execute('post', '/element', {using, value})
    checkRes(res)
    return new Element(this, res)
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
    var res = await this._execute('post', '/elements', {using, value})

    checkRes(res)
    if (!Array.isArray(res.value)) throw new Error('Result from findElements must be an array')
    return res.value.map((v) => new Element(this, v))
  }

  async sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Mixin the find helpers with DriverBase and ElementBase
var Driver = FindHelpersMixin(DriverBase)
var Element = FindHelpersMixin(ElementBase)

;(async () => {
  try {
    //
    var driver = new Driver('127.0.0.1', 9515) // 4444 or 9515
    var parameters = new ChromeParameters()
    console.log('SESSION: ', await driver.newSession(parameters))

/*
* `browserName` -- Browser name -- string Identifies the user agent.
* `browserVersion` -- Browser version -- string Identifies the version of the user agent.
* `platformName` -- Platform name -- string Identifies the operating system of the endpoint node.
* `acceptInsecureCerts` -- Accept insecure TLS certificates -- boolean -- Indicates whether untrusted and self-signed TLS certificates are implicitly trusted on navigation for the duration of the session.
* `pageLoadStrategy` -- Page load strategy -- string -- Defines the current session’s page load strategy.
* `proxy` -- Proxy configuration JSON -- Object -- Defines the current session’s proxy configuration.
* `setWindowRect` -- Window dimensioning/positioning "setWindowRect" -- boolean -- Indicates whether the remote end supports all of the commands in Resizing and Positioning Windows.
* `timeouts` -- Session timeouts -- configuration JSON -- Object -- Describes the timeouts imposed on certain session operations.
* `unhandledPromptBehavior` Unhandled prompt behavior -- string -- Describes the current session’s user prompt handler.
*/

    // console.log('SESSION: ', await driver.newSession({}))

    // await driver.navigateTo({ url: 'http://www.google.com' })

    // var el = await driver.findElements({ using: Driver.using.CSS, value: '[name=q]' })
    // console.log('ELEMENTS:', el)

    // console.log('TRY:', await el[0].sendKeys({ text: 'thisworksonfirefox', value: ['c', 'h', 'r', 'o', 'm', 'e'] }))
    // console.log('TRY:', await el[0].sendKeys({ text: 'thisworksonfirefoxandchrome' + Element.KEY.ENTER }))

    await driver.navigateTo('http://usejsdoc.org')
    var article = await driver.findElementCss('article')
    console.log('Article:', article)

    console.log('TIMEOUTS:', await driver.getTimeouts())
    // console.log('SETTIMEOUTS:', await driver.setTimeouts({ implicit: 0, pageLoad: 300000, script: 30000 }))
    console.log('TIMEOUTS AGAIN:', await driver.getTimeouts())

    var dts = await article.findElementsCss('dt')
    console.log('DTs:', dts)

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

    await driver.navigateTo('http://www.google.com')
    var q = await driver.findElementCss('[name=q]')
    await q.sendKeys('stocazzo' + Element.KEY.ENTER)

    await driver.sleep(2000)

    // console.log('TIMEOUTS:', await driver.getTimeouts())

    // console.log('And:', await driver.getCurrentUrl())

    await driver.deleteSession()
  } catch (e) {
    console.log('ERROR:', e)
  }
})()
