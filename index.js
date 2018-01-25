/*
  TODO:

  Make up skeleton:
  [X] WED 24 Finish off methods in main list
  [ ] FRI-SAT 26 27 Finish off Actions API calls
  [ ] SUN 28 Install JSDoc, check generated documentation
  [ ] MON 29 Add missing findElement*** docs, make sure they appear in doc
  [ ] TUE 30 Manage errors properly: sometimes calls fail but it's not a proper error
  [ ] WED 31 Put it online on Github pages
  [ ] THR 1 Add code to run chrome (or whatever) automatically, passing parameters for port and more
  [ ] FRI 2 Add "wait" statement, poll and checks for a condition with possible timeout
  [ ] SAT 3 Write initial tests (ah!)
  [ ] SAT 3 Submit code for review
  [ ] SUN 4 Write more tests

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

sloc `find . -iname \*js | grep -v test | grep -v example | grep -v node_modules`

---------- Result ------------

            Physical :  13670
              Source :  5654
             Comment :  6584
 Single-line comment :  666
       Block comment :  5918
               Mixed :  92
               Empty :  1529
               To Do :  8

Number of files read :  32

cat `find . -iname \*js | grep -v test | grep -v example | grep -v node_modules`  | grep ^class | wc
92     380    3231

{ actions:
   [ { actions:
        [ { type: 'pointerMove',
            origin:
             { 'element-6066-11e4-a52e-4f735466cecf': 'b88dfe93-1c6c-44c9-9bf5-a73553a8d167',
               ELEMENT: 'b88dfe93-1c6c-44c9-9bf5-a73553a8d167' },
            duration: 100,
            x: 0,
            y: 0 },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerUp', button: 0 } ],
       parameters: { pointerType: 'mouse' },
       type: 'pointer',
       id: 'default mouse' } ] }

{ actions:
  [ { actions:
       [ { type: 'pointerMove',
           origin:
            { 'element-6066-11e4-a52e-4f735466cecf': '6f32c095-44a6-4069-bee6-d9bb01e4669b',
              ELEMENT: '6f32c095-44a6-4069-bee6-d9bb01e4669b' },
           duration: 100,
           x: 0,
           y: 0 },
         { type: 'pointerDown', button: 0 },
         { type: 'pointerUp', button: 0 },
         { type: 'pointerDown', button: 0 },
         { type: 'pointerUp', button: 0 } ],
      parameters: { pointerType: 'mouse' },
      type: 'pointer',
      id: 'default mouse' } ] }

{ actions:
   [ { actions:
        [ { type: 'pointerMove',
            origin:
             { 'element-6066-11e4-a52e-4f735466cecf': '395a840e-d243-408c-affd-386c31025b4e',
               ELEMENT: '395a840e-d243-408c-affd-386c31025b4e' },
            duration: 100,
            x: 0,
            y: 0 },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove',
            origin:
             { 'element-6066-11e4-a52e-4f735466cecf': '3e30e030-9ae9-4cbf-a808-3b6f6f70d5cb',
               ELEMENT: '3e30e030-9ae9-4cbf-a808-3b6f6f70d5cb' },
            duration: 100,
            x: 0,
            y: 0 },
          { type: 'pointerUp', button: 0 } ],
       parameters: { pointerType: 'mouse' },
       type: 'pointer',
       id: 'default mouse' } ] }

{ actions:
  [ { actions:
       [ { type: 'pointerMove',
           origin:
            { 'element-6066-11e4-a52e-4f735466cecf': '5946043f-08a7-4116-9ecb-543556e07447',
              ELEMENT: '5946043f-08a7-4116-9ecb-543556e07447' },
           duration: 100,
           x: 0,
           y: 0 },
         { type: 'pointerDown', button: 0 },
         { type: 'pointerMove',
           origin: 'pointer',
           duration: 100,
           x: 100,
           y: 100 },
         { type: 'pointerUp', button: 0 } ],
      parameters: { pointerType: 'mouse' },
      type: 'pointer',
      id: 'default mouse' } ] },

{ actions:
   [ { actions:
        [ { type: 'keyDown', value: 'f' },
          { type: 'keyUp', value: 'f' },
          { type: 'keyDown', value: 'o' },
          { type: 'keyUp', value: 'o' },
          { type: 'keyDown', value: 'o' },
          { type: 'keyUp', value: 'o' },
          { type: 'keyDown', value: 'b' },
          { type: 'keyUp', value: 'b' },
          { type: 'keyDown', value: 'a' },
          { type: 'keyUp', value: 'a' },
          { type: 'keyDown', value: 'r' },
          { type: 'keyUp', value: 'r' } ],
       type: 'key',
       id: 'default keyboard' } ] }

{ actions:
  [ { actions:
       [ { type: 'pause', duration: 0 },
         { type: 'pause', duration: 0 },
         { type: 'pause', duration: 0 },
         { type: 'keyDown', value: 'f' },
         { type: 'keyUp', value: 'f' },
         { type: 'keyDown', value: 'o' },
         { type: 'keyUp', value: 'o' },
         { type: 'keyDown', value: 'o' },
         { type: 'keyUp', value: 'o' },
         { type: 'keyDown', value: 'b' },
         { type: 'keyUp', value: 'b' },
         { type: 'keyDown', value: 'a' },
         { type: 'keyUp', value: 'a' },
         { type: 'keyDown', value: 'r' },
         { type: 'keyUp', value: 'r' } ],
      type: 'key',
      id: 'default keyboard' },
    { actions:
       [ { type: 'pointerMove',
           origin:
            { 'element-6066-11e4-a52e-4f735466cecf': 'b4def06e-66bc-4fe7-9190-a128b920479d',
              ELEMENT: 'b4def06e-66bc-4fe7-9190-a128b920479d' },
           duration: 100,
           x: 0,
           y: 0 },
         { type: 'pointerDown', button: 0 },
         { type: 'pointerUp', button: 0 },
         { type: 'pause', duration: 0 },
         { type: 'pause', duration: 0 },
         { type: 'pause', duration: 0 },
         { type: 'pause', duration: 0 },
         { type: 'pause', duration: 0 },
         { type: 'pause', duration: 0 },
         { type: 'pause', duration: 0 },
         { type: 'pause', duration: 0 },
         { type: 'pause', duration: 0 },
         { type: 'pause', duration: 0 },
         { type: 'pause', duration: 0 },
         { type: 'pause', duration: 0 } ],
      parameters: { pointerType: 'mouse' },
      type: 'pointer',
      id: 'default mouse' } ] }

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

class Device {
  constructor (id) {
    this.id = id
  }

  static get pause () {
    return 'keyDown'
  }

  makeAction (type, args) {
    return {}
  }
}

//  KEYBOARD: "pause", "keyUp", "keyDown"
class Keyboard extends Device {
  static get UP () {
    return 'keyUp'
  }

  static get DOWN () {
    return 'keyDown'
  }

  makeAction (type, args) {
    return {}
  }
}

//  POINTER: "pause", "pointerUp", "pointerDown", "pointerMove", or "pointerCancel
class Pointer extends Device {
  constructor (id, pointerType) {
    super(id)
    this.pointerType = pointerType
  }

  static get UP () {
    return 'pointerUp'
  }

  static get DOWN () {
    return 'pointerDown'
  }

  static get MOVE () {
    return 'pointerMove'
  }

  static get CANCEL () {
    return 'pointerCancel'
  }

  makeAction (type, args) {
    return {}
  }
}

class Actions {
  constructor (devices = {}) {
    var self = this
    this.actions = []

    /*
    this.devices = [
      new Pointer( { id: 'mouse', type: Pointer.Type.MOUSE} ),
      new keyboard( { id: 'keyboard'})
    ]
  */

    // Assign `devices`. If not there, assign a default 'mouse' and 'keyboard'
    if (Object.keys(devices).length) {
      this.devices = devices
    } else {
      this.devices = {
        mouse: { type: Actions.Types.POINTER, pointerType: Actions.subTypes.MOUSE },
        keyboard: { type: Actions.Types.KEYBOARD }
      }
    }

    // Make up a _tickSetters object, where each key
    // is a deviceId. So, for devices `mouse` and `keyboard`,
    // action.tick.mouse() and and action.tick.keyboard() work.
    // Note that the tickSetters also return a _tickSetters object. So,
    // action.tick.mouse(...).keyboard(...) is possible
    var r = this._tickSetters = {
      get tick () {
        return self.tick
      },
      compile: self.compile.bind(self)
    }
    Object.keys(this.devices).forEach((deviceId) => {
      r[ deviceId ] = function (action) {
        self._setAction(deviceId, action)
        return r
      }
    })
  }

  static get Types () {
    return {
      POINTER: 'pointer',
      KEYBOARD: 'key'
    }
  }

  static get subTypes () {
    return {
      MOUSE: 'mouse',
      PEN: 'pen',
      TOUCH: 'touch'
    }
  }

  compile () {
    var actions = []

    Object.keys(this.devices).forEach((deviceId) => {
      var device = this.devices[deviceId]

      var deviceActions = []
      deviceActions.type = device.type
      deviceActions.id = deviceId
      if (device.type === Actions.Types.POINTER) {
        deviceActions.parameters = { pointerType: device.pointerType }
      }

      this.actions.forEach((action) => {
        deviceActions.push(action[ deviceId ])
      })
      actions.push({ actions: deviceActions })
    })

    console.log('ACTIONS:', require('util').inspect(actions, {depth: 10}))

/*
    { actions:
      [ { actions:
           [ { type: 'pause', duration: 0 },
             { type: 'pause', duration: 0 },
             { type: 'pause', duration: 0 },
             { type: 'keyDown', value: 'f' },
             { type: 'keyUp', value: 'f' },
             { type: 'keyDown', value: 'o' },
             { type: 'keyUp', value: 'o' },
             { type: 'keyDown', value: 'o' },
             { type: 'keyUp', value: 'o' },
             { type: 'keyDown', value: 'b' },
             { type: 'keyUp', value: 'b' },
             { type: 'keyDown', value: 'a' },
             { type: 'keyUp', value: 'a' },
             { type: 'keyDown', value: 'r' },
             { type: 'keyUp', value: 'r' } ],
          type: 'key',
          id: 'default keyboard' },

        { actions:
           [ { type: 'pointerMove',
               origin:
                { 'element-6066-11e4-a52e-4f735466cecf': 'b4def06e-66bc-4fe7-9190-a128b920479d',
                  ELEMENT: 'b4def06e-66bc-4fe7-9190-a128b920479d' },
               duration: 100,
               x: 0,
               y: 0 },
             { type: 'pointerDown', button: 0 },
             { type: 'pointerUp', button: 0 },
             { type: 'pause', duration: 0 },
             { type: 'pause', duration: 0 },
             { type: 'pause', duration: 0 },
             { type: 'pause', duration: 0 },
             { type: 'pause', duration: 0 },
             { type: 'pause', duration: 0 },
             { type: 'pause', duration: 0 },
             { type: 'pause', duration: 0 },
             { type: 'pause', duration: 0 },
             { type: 'pause', duration: 0 },
             { type: 'pause', duration: 0 },
             { type: 'pause', duration: 0 } ],
          parameters: { pointerType: 'mouse' },
          type: 'pointer',
          id: 'default mouse' } ] }
*/

    console.log('COMPILE!')
  }

  _setAction (deviceId, action) {
    this._currentAction[ deviceId ] = action
  }

  get tick () {
    var deviceIds = Object.keys(this.devices)

    // Make up the action object. It will be an object where
    // each key is a device ID.
    // By default, ALL actions are set as 'pause'
    var action = {}
    deviceIds.forEach((deviceId) => {
      action[ deviceId ] = { type: 'pause' }
    })
    this.actions.push(action)

    // Set _currentAction, which is what the tickSetters will
    // change
    this._currentAction = action

    // Return the _tickSetters, so that actions.tick.mouse() works
    return this._tickSetters
  }
}

var actions = new Actions()
console.log('BEFORE:', actions, '\n\nAND:', actions.actions, '\n\n')

actions.tick.mouse({ type: 'pointerDown', button: 0 }).keyboard({ type: 'keyDown', value: 'r' })
actions.tick.mouse({ type: 'pointerUp', button: 0 })
actions.tick.mouse({ type: 'pointerUp', button: 0 }).keyboard({ type: 'keyUp', value: 'r' })
actions.tick.mouse({ type: 'pointerUp', button: 0 }).tick.keyboard({ type: 'keyDown', value: 'p' }).compile()
actions.compile()

console.log('IT IS:', actions, '\n\nAND:', actions.actions)

process.exit()

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

    // Sets the ID. Having `element-XXX` and `ELEMENT` as keys to the object means
    // that it can be used by switchToFrame()
    var idx = 'element-6066-11e4-a52e-4f735466cecf'
    this.id = this.ELEMENT = this[idx] = value[idx]

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
   * @return {Promise<Element>} An object representing the element.
   * @example
   *   var el = await driver.findElement( Driver.using.CSS, '[name=q]' )
   *
  */
  async findElement (using, value) {
    var res = await this._execute('post', `/element/${this.id}/element`, {using, value})
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
   * @return {Promise<[Element},Element,...]>} An array of elements
   * @example
   *   var el = await driver.findElements( Driver.using.CSS, '.item' })
   *
  */
  async findElements (using, value) {
    var res = await this._execute('post', `/element/${this.id}/elements`, {using, value})
    if (!Array.isArray(res.value)) throw new Error('Result from findElements must be an array')
    return res.value.map((v) => new Element(this.driver, v))
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
    return !!(await this._execute('get', `/element/${this.id}/selected`)).value
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
  async getAttribute (name) {
    return (await this._execute('get', `/element/${this.id}/attribute/${name}`)).value
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
  async getProperty (name) {
    return (await this._execute('get', `/element/${this.id}/property/${name}`)).value
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
  async getCssValue (name) {
    return (await this._execute('get', `/element/${this.id}/css/${name}`)).value
  }

  /**
   * Get text value from element
   *
   * @return {Promise<string>} The text
   * @example
   *   var el = await driver.findElementCss('a' })
   *   var text = el.getText()
  */
  async getText () {
    return (await this._execute('get', `/element/${this.id}/text`)).value
  }

  /**
   * Get tag name from element
   *
   * @return {Promise<string>} The tag's name
   * @example
   *   var el = await driver.findElementCss('.link' })
   *   var tagName = el.getTagName()
  */
  async getTagName () {
    return (await this._execute('get', `/element/${this.id}/name`)).value
  }

  /**
   * Get rectfrom element
   *
   * @return {Promise<string>} The rect info

   * @example
   *   var el = await driver.findElementCss('a' })
   *   var rect = el.getRect()
  */
  async getRect () {
    return (await this._execute('get', `/element/${this.id}/rect`)).value
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
    return !!(await this._execute('get', `/element/${this.id}/enabled`)).value
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
   *   await el.sendKeys("This is a search" + Element.KEY.ENTER)
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
    var res = (await this._execute('get', `/element/${this.id}/screenshot`, { scroll })).value
    return Buffer.from(res, 'base64')
  }

  async _execute (method, command, params) {
    return this.driver._execute(method, command, params)
  }
}

class DriverBase {
  constructor (ip = null, port = null, capabilities = {}) {
    this.ip = ip
    this.port = port
    this.sessionCapabilities = capabilities
    this.sessionId = null
    this._urlBase = `http://${this.ip}:${this.port}/session`
  }

  _ready () {
    return this.sessionId && this.ip && this.port
  }

  inspect () {
    return `DriverBase { ip: ${this.ip}, port: ${this.port} }`
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
      return value
    } catch (e) {
      this.sessionId = null
      this._sessionData = {}
      this._urlBase = `http://${this.ip}:${this.port}/session`
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
      var res = await this._execute('delete', '')
      this.sessionId = null
      this._sessionData = {}
      this._urlBase = `http://${this.ip}:${this.port}/session`
      return res
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
    var _urlBase = `http://${this.ip}:${this.port}`
    return (await request.get({ url: `${_urlBase}/status`, json: true })).value
  }

  async _execute (method, command, params) {
    // Check that session has been created
    if (!(method === 'post' && command === '' && !this.sessionId)) {
      if (!this._ready()) throw new Error('Executing command on non-ready driver')
    }

    var p = { url: `${this._urlBase}${command}` }

    p.json = method === 'post' ? params || {} : true

    // Getting the result
    var res = await request[method](p)

    // Return the result, checking if everything is OK
    return checkRes(res)
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
  async getTimeouts () {
    return (await this._execute('get', '/timeouts')).value
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
  async setTimeouts (parameters) {
    return (await this._execute('post', '/timeouts', parameters)).value
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
  async getCurrentUrl () {
    return (await this._execute('get', '/url')).value
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
  async getTitle () {
    return (await this._execute('get', '/title')).value
  }

  /**
   * Get the current window's handle
   *
   * @return {Promise<string>} The handle
   *
   * @example
   *   var title = await driver.getWindowHandle()
  */
  async getWindowHandle () {
    return (await this._execute('get', '/window')).value
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
  async getWindowHandles () {
    return (await this._execute('get', '/window/handles')).value
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
  async getWindowRect () {
    return (await this._execute('get', '/window/rect')).value
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
  async setWindowRect (rect) {
    return (await this._execute('post', '/window/rect', rect)).value
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
    await this._execute('post', '/window/maximize')
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
  async getPageSource () {
    return (await this._execute('get', '/source')).value
  }

  /**
   * Execute sync script
   *
   * @param {string} script The string with the script to be executed
   * @param {array} [args] The arguments to be passed to the script

   * @return {...} Whatever was returned by the javascript code with a `return` statement
   *
   * @example
   *   await driver.executeScript("return 'Hello ' + arguments[0];", ['tony'])
  */
  async executeScript (script, args = []) {
    return (await this._execute('post', '/execute/sync', { script, args })).value
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
   *   await driver.executeAsyncScript("var name = arguments[0];var cb = arguments[1];cb('Hello ' + name);", ['tony'])
  */
  async executeAsyncScript (script, args = []) {
    return (await this._execute('post', '/execute/async', { script, args })).value
  }

  /**
   * Get all cookies
   *
   * @return {[Object, Object,...]} An array of cookie objects.
   *
   * @example
   *   var list = await driver.getAllCookies()
  */
  async getAllCookies () {
    return (await this._execute('get', '/cookie')).value
  }

  /**
   * Get cookies matching a specific name
   *
   * @return {Object} A cookie object
   *
   * @example
   *   var cookie = await driver.getNamedCookies('NID')
  */
  async getNamedCookie (name) {
    return (await this._execute('get', `/cookie/${name}`)).value
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
  async getAlertText () {
    return (await this._execute('get', '/alert/text')).value
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
    var res = (await this._execute('get', '/screenshot')).value
    return Buffer.from(res, 'base64')
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
    var res = await this._execute('get', '/element/active')
    return new Element(this, res)
  }

  // ******************************************************************************
  // ******************************************************************************
  // ******************************************************************************
  // ******************************************************************************
  // ******************************************************************************
  // ******************************************************************************
  // ******************************************************************************
  // ******************************************************************************

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
    var driver = new Driver('127.0.0.1', 4444) // 4444 or 9515
    var parameters = new FirefoxParameters()
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
    console.log('PAGE SOURCE:', await driver.getPageSource())
    // var q = await driver.findElementCss('[name=q]')
    // await q.sendKeys('stocazzo' + Element.KEY.ENTER)
    // console.log('WTF', q, q.id, q.ELEMENT)

    // console.log('EXECUTE 0 PRETEND:')
    // await driver.sleep(5000)

    /*
    console.log('EXECUTE 0:', await driver.executeScript("prompt('pippo');return 'Hello ' + arguments[0];", ['tony']))
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

    /*
    { name: 'test',
        value: 'a test',
        path: '/',
        domain: '.example.com',
        expiry: 1732569047,
        secure: true,
        httpOnly: true }
    */

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
