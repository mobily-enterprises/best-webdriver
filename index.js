/*
TODO:
  [X] Figure out why sessionId is in value in firefox, and in object root in chrome
  [X] Understand the element-6066-11e4-a52e-4f735466cecf and w3c_compliant issue
  [X] Maybe create element type, and have call-forwarding for nice chaining.

  [ ] Allow entering a string as sendKeys, add constants if needed
  [ ] Add browser requirement string spec, and other parameters
  [ ] Run each method, document parameters making constants when necessary
  [ ] Add code to run chrome (or whatever) automatically, passing parameters for port and more
  [ ] Understand the real differences between different browsers' responses in calls
  [ ] Add "wait" statement, poll and checks for a condition with possible timeout

  https://chromium.googlesource.com/chromium/src/+/lkcr/docs/chromedriver_status.md
*/

var request = require('request-promise-native')

class Element {
  constructor (driver, elObject) {
    var value

    // Get the element, falling back on ELEMENT property if W3C property not found
    this.driver = driver

    // elObject will contain `value` if it's a straight answer from the webdriver
    // Otherwise, it's assumed to be passed `res.value`
    if (this.isObject(elObject) && elObject.value) value = elObject.value
    else value = elObject

    // Get the ID, using W3C's standard way
    this.id = value['element-6066-11e4-a52e-4f735466cecf']

    // Nevermind W3C standards, let's go for a fishing expedition
    // It will look for the `ELEMENT` property, or the `id` property,
    // or just the string itself

    // If ELEMENT property exists, that's going to be the ID
    if (!this.id && this.isObject(value)) this.id = value.ELEMENT

    if (!this.id && this.isObject(value)) this.id = value.id

    // If value is a straight string, that's going to be the ID
    if (!this.id && typeof value === 'string') this.id = value

    // No ID could be find
    if (!this.id) throw new Error('Could not get element ID from element object')
  }

  isObject (p) { return typeof p === 'object' && p !== null && !Array.isArray(p) }

  findElement (p) {
    return this.execute('post', `/element/${this.id}/element`, p)
  }
  findElements (p) {
    return this.execute('post', `/element/${this.id}/elements`, p)
  }
  isSelected (p) {
    return this.execute('get', `/element/${this.id}/selected`, p)
  }
  getAttribute (name, p) {
    return this.execute('get', `/element/${this.id}/attribute/${name}`, p)
  }
  getProperty (name, p) {
    return this.execute('get', `/element/${this.id}/property/${name}`, p)
  }
  getCssValue (name, p) {
    return this.execute('get', `/element/${this.id}/css/${name}`, p)
  }
  getText (p) {
    return this.execute('get', `/element/${this.id}/text`, p)
  }
  getTagName (p) {
    return this.execute('get', `/element/${this.id}/name`, p)
  }
  getRect (p) {
    return this.execute('get', `/element/${this.id}/rect`, p)
  }
  isEnabled (p) {
    return this.execute('get', `/element/${this.id}/enabled`, p)
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
  takeScreenshot (p) {
    return this.execute('get', `/element/${this.id}/screenshot`, p)
  }

  ready () {
    return this.driver && this.id
  }
  async execute (method, command, params) {
    if (!this.ready) throw new Error('Element not ready')
    return this.driver.execute(method, command, params)
  }
}

class Driver {
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

  isObject (p) { return typeof p === 'object' && p !== null && !Array.isArray(p) }

  async newSession () {
    try {
      var res = await this.execute('post', '', { desiredCapabilities: {} })

      // W3C conforming response; checked if value is an object containing a `capabilities` object property
      // and a `sessionId` string property
      var value = res.value
      if (this.isObject(value) &&
          this.isObject(value.capabilities) &&
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

    if (params && (method === 'post' || method === 'get')) {
      p.json = params
    }

    // This will return a promise
    return request[method](p)
  }

  static get using () {
    return {
      CSS: 'css selector',
      LINK_TEXT: 'link text',
      PARTIAL_LINK_TEXT: 'partial link text',
      TAG_NAME: 'tag name',
      XPATH: 'xpath'
    }
  }

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

  async findElement (p) {
    var res = await this.execute('post', '/element', p)
    return new Element(this, res)
  }

  async findElements (p) {
    var res = await this.execute('post', '/elements', p)
    if (Array.isArray(res.value)) {
      res = res.value.map((v) => new Element(this, v))
    }
    return res
  }

  findElementFromElement (el, p) {
    return this.execute('post', `/element/${el.id}/element`, p)
  }

  findElementsFromElement (el, p) {
    return this.execute('post', `/element/${el.id}/elements`, p)
  }

  isElementSelected (el, p) {
    return this.execute('get', `/element/${el.id}/selected`, p)
  }

  getElementAttribute (el, name, p) {
    return this.execute('get', `/element/${el.id}/attribute/${name}`, p)
  }

  getElementProperty (el, name, p) {
    return this.execute('get', `/element/${el.id}/property/${name}`, p)
  }

  getElementCssValue (el, name, p) {
    return this.execute('get', `/element/${el.id}/css/${name}`, p)
  }

  getElementText (el, p) {
    return this.execute('get', `/element/${el.id}/text`, p)
  }

  getElementTagName (el, p) {
    return this.execute('get', `/element/${el.id}/name`, p)
  }

  getElementRect (el, p) {
    return this.execute('get', `/element/${el.id}/rect`, p)
  }

  isElementEnabled (el, p) {
    return this.execute('get', `/element/${el.id}/enabled`, p)
  }

  elementClick (el, p) {
    return this.execute('post', `/element/${el.id}/click`, p)
  }

  elementClear (el, p) {
    return this.execute('post', `/element/${el.id}/clear`, p)
  }

  elementSendKeys (el, p) {
    // W3c: Adding 'value' to parameters, so that Chrome works too
    p.value = p.text.split('')
    return this.execute('post', `/element/${el.id}/value`, p)
  }

  takeElementScreenshot (el, p) {
    return this.execute('get', `/element/${el.id}/screenshot`, p)
  }

  async sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

(async () => {
  try {
    var driver = new Driver('127.0.0.1', 4444)
    console.log('SESSION: ', await driver.newSession())
    await driver.navigateTo({ url: 'http://www.google.com' })

    var el = await driver.findElement({ using: Driver.using.CSS, value: '[name=q]' })
    console.log('ELEMENT:', el)

    // console.log('TRY:', await el[0].sendKeys({ text: 'thisworksonfirefox', value: ['c', 'h', 'r', 'o', 'm', 'e'] }))
    console.log('TRY:', await el.sendKeys({ text: 'thisworksonfirefoxandchrome' }))

    await driver.sleep(2000)

    // console.log('TIMEOUTS:', await driver.getTimeouts())

    // console.log('And:', await driver.getCurrentUrl())

    await driver.deleteSession()
  } catch (e) {
    console.log('ERROR:', e)
  }
})()
