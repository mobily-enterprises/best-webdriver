/*
  TODO:

  Make up skeleton:
  [ ] Run each method, document parameters making constants when necessary
  [ ] Install JSDoc, check generated documentation
  [ ] You wrote an API! Double check documentation, put it online

  Finish it off:
  [ ] Add browser requirement string spec, and other parameters
  [ ] Add code to run chrome (or whatever) automatically, passing parameters for port and more
  [ ] Add "wait" statement, poll and checks for a condition with possible timeout

  Make it production-ready
  [ ] Write tests

DONE:
  [X] Figure out why sessionId is in value in firefox, and in object root in chrome
  [X] Understand the element-6066-11e4-a52e-4f735466cecf and w3c_compliant issue
  [X] Maybe create element type, and have call-forwarding for nice chaining.
  [X] Allow entering a string as sendKeys, add constants if needed
  [X] Understand the real differences between different browsers' responses in calls

  http://usejsdoc.org/

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

    // Get the element, falling back on ELEMENT property if W3C property not found
    this.driver = driver

    // elObject will contain `value` if it's a straight answer from the webdriver
    // Otherwise, it's assumed to be passed `res.value`
    if (isObject(elObject) && elObject.value) value = elObject.value
    else value = elObject

    // Get the ID, using W3C's standard way
    this.id = value['element-6066-11e4-a52e-4f735466cecf']

    // Nevermind W3C standards, let's go for a fishing expedition
    // It will look for the `ELEMENT` property, or the `id` property,
    // or just the string itself

    // If ELEMENT property exists, that's going to be the ID
    if (!this.id && isObject(value)) this.id = value.ELEMENT

    if (!this.id && isObject(value)) this.id = value.id

    // If value is a straight string, that's going to be the ID
    if (!this.id && typeof value === 'string') this.id = value

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
    var res = await this.execute('post', `/element/${this.id}/element`, {using, value})
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
    var res = await this.execute('post', `/element/${this.id}/elements`, {using, value})

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
    var res = await this.execute('get', `/element/${this.id}/selected`)
    checkRes(res)
    return !!res.value
  }

  async getAttribute (name) {
    var res = await this.execute('get', `/element/${this.id}/attribute/${name}`)
    checkRes(res)
    return res.value
  }

  async getProperty (name) {
    var res = await this.execute('get', `/element/${this.id}/property/${name}`)
    checkRes(res)
    return res.value
  }

  getCssValue (name, p) {
    return this.execute('get', `/element/${this.id}/css/${name}`)
  }
  getText (p) {
    return this.execute('get', `/element/${this.id}/text`)
  }
  getTagName (p) {
    return this.execute('get', `/element/${this.id}/name`)
  }
  getRect (p) {
    return this.execute('get', `/element/${this.id}/rect`)
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
  async isEnabled (p) {
    var res = await this.execute('get', `/element/${this.id}/enabled`, p)
    checkRes(res)
    return !!res.value
  }
  click (p) {
    return this.execute('post', `/element/${this.id}/click`, p)
  }
  clear (p) {
    return this.execute('post', `/element/${this.id}/clear`, p)
  }
  sendKeys (p) {
    // W3c: Adding 'value' to parameters, so that Chrome works too
    p.value = p.text.split('')
    return this.execute('post', `/element/${this.id}/value`, p)
  }
  takeScreenshot () {
    return this.execute('get', `/element/${this.id}/screenshot`)
  }

  ready () {
    return this.driver && this.id
  }
  async execute (method, command, params) {
    if (!this.ready) throw new Error('Element not ready')
    return this.driver.execute(method, command, params)
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

  ready () {
    return this.sessionId && this.ip && this.port
  }

  async newSession () {
    try {
      var res = await this.execute('post', '', { desiredCapabilities: {} })

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

      // Nevermind following W3C standards: fishing info out with pot-luck technique
      } else {
        this.sessionId = res.sessionId || value.sessionId
        if (value.browserName) this.sessionCapabilities = value
        if (value.capabilities && value.capabilities.browserName) this.sessionCapabilities = value.capabilities
        if (value.capabilities) this.sessionCapabilities = value.capabilities
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
      var res = await this.execute('delete', '')
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

  async execute (method, command, params) {
    if (!this.ready) throw new Error('Executing command on non-ready driver')

    var p = { url: `${this._urlBase}${command}` }

    if (params && (method === 'post')) {
      p.json = params
    } else {
      p.json = true
    }

    // This will return a promise
    return request[method](p)
  }

  static get using () { return USING }

  // The next block alone will implement 100% of the protocol
  getTimeouts (p) {
    return this.execute('get', '/timeouts', p)
  }

  setTimeouts (p) {
    return this.execute('post', '/timeouts', p)
  }

  navigateTo (p) {
    return this.execute('post', '/url', p)
  }

  getCurrentUrl (p) {
    return this.execute('get', '/url', p)
  }

  back (p) {
    return this.execute('post', '/back', p)
  }

  forward (p) {
    return this.execute('post', '/forward', p)
  }

  refresh (p) {
    return this.execute('post', '/refresh', p)
  }

  getTitle (p) {
    return this.execute('get', '/title', p)
  }

  getWindowHandle (p) {
    return this.execute('get', '/window', p)
  }

  closeWindow (p) {
    return this.execute('delete', '/window', p)
  }

  switchToWindow (p) {
    return this.execute('post', '/window', p)
  }

  getWindowHandles (p) {
    return this.execute('get', '/window/handles', p)
  }

  switchtoFrame (p) {
    return this.execute('post', '/frame', p)
  }

  switchtoParentFrame (p) {
    return this.execute('post', '/parent/frame', p)
  }

  getWindowRect (p) {
    return this.execute('get', '/window/rect', p)
  }

  setWindowRect (p) {
    return this.execute('post', '/window/rect', p)
  }

  maximizeWindow (p) {
    return this.execute('post', '/window/maximize', p)
  }

  minimizeWindow (p) {
    return this.execute('post', '/window/minimize', p)
  }

  fullScreenWindow (p) {
    return this.execute('post', '/window/fullscreen', p)
  }

  getPageSource (p) {
    return this.execute('get', '/source', p)
  }

  executeScript (p) {
    return this.execute('post', '/execute/sync', p)
  }

  executeAsyncScript (p) {
    return this.execute('post', '/execute/async', p)
  }

  getAllCookies (p) {
    return this.execute('get', '/cookie', p)
  }

  getNamedCookie (name, p) {
    return this.execute('get', `/cookie/${name}`, p)
  }

  addCookie (p) {
    return this.execute('post', '/cookie', p)
  }

  deleteCookie (name, p) {
    return this.execute('get', `/cookie/${name}`, p)
  }

  deleteAllCookies (p) {
    return this.execute('delete', '/cookie', p)
  }

  performActions (p) {
    return this.execute('post', '/actions', p)
  }

  releaseActions (p) {
    return this.execute('delete', '/actions', p)
  }

  dismissAlert (p) {
    return this.execute('post', '/alert/dismiss', p)
  }

  acceptAlert (p) {
    return this.execute('post', '/alert/accept', p)
  }

  getAlertText (p) {
    return this.execute('get', '/alert/text', p)
  }

  sendAlertText (p) {
    return this.execute('post', '/alert/text', p)
  }

  takeScreenshot (p) {
    return this.execute('get', '/screenshot', p)
  }

  getActiveElement (p) {
    return this.execute('get', '/element/active', p)
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
    var res = await this.execute('post', '/element', {using, value})
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
   * @example
   *   var el = await driver.findElements({ Driver.using.CSS, value: '.item' )
   *
  */
  async findElements (using, value) {
    var res = await this.execute('post', '/elements', {using, value})

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
    var driver = new Driver('127.0.0.1', 4444)
    console.log('SESSION: ', await driver.newSession())

    // await driver.navigateTo({ url: 'http://www.google.com' })

    // var el = await driver.findElements({ using: Driver.using.CSS, value: '[name=q]' })
    // console.log('ELEMENTS:', el)

    // console.log('TRY:', await el[0].sendKeys({ text: 'thisworksonfirefox', value: ['c', 'h', 'r', 'o', 'm', 'e'] }))
    // console.log('TRY:', await el[0].sendKeys({ text: 'thisworksonfirefoxandchrome' + Element.KEY.ENTER }))

    await driver.navigateTo({ url: 'http://usejsdoc.org' })
    var article = await driver.findElementCss('article')
    console.log('Article:', article)

    var dts = await article.findElementsCss('dt')
    console.log('DTs:', dts)

    console.log('Selected:', await dts[0].isSelected())
    console.log('Enabled:', await dts[0].isEnabled())

    var h2 = await driver.findElementCss('h2#block-tags')
    console.log('SEE ATTR:', await h2.getAttribute('id'))
    console.log('SEE PROP:', await h2.getProperty('id'))

    await driver.sleep(2000)

    // console.log('TIMEOUTS:', await driver.getTimeouts())

    // console.log('And:', await driver.getCurrentUrl())

    await driver.deleteSession()
  } catch (e) {
    console.log('ERROR:', e)
  }
})()
