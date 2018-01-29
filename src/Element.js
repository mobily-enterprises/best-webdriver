const FindHelpersMixin = require('./FindHelpersMixin')
const utils = require('./utils')
const KEY = require('./KEY')

/**
 * The base class for Elements
 * @mixes FindHelpersMixin
 * @augments FindHelpersMixin
 *
 * An Element object is returned by {@link Driver#findElement} and
 * {@link Driver#findElements}.
 *
 * Element objects are then used to either get specific information about them
 * using for example `element.getText()`, or to perform actions on them such as
 * `element.click()` or `element.findElements` (which will return more elements)
 * @inheritdoc
 */
var Element = class {
  /**
   * Constructor. You never have to run this yourself, since both {@link Driver#findElement}
   * and {@link Driver#findElements} will run `new Element()` for you based on what was
   * returned by the webdriver.
   *
   * @param {Driver} driver The driver that originally created this element
   * @param {object} elObject An element object as it was returned by the webdriver.
   *
  */
  constructor (driver, elObject) {
    var value

    // Assssign the driver
    this.driver = driver

    // elObject will contain `value` if it's a straight answer from the webdriver
    // Otherwise, it's assumed to be passed `res.value`
    if (utils.isObject(elObject) && elObject.value) value = elObject.value
    else value = elObject

    // Sets the ID. Having `element-XXX` and `ELEMENT` as keys to the object means
    // that it can be used by switchToFrame()
    var idx = 'element-6066-11e4-a52e-4f735466cecf'
    this.id = this.ELEMENT = this[idx] = value[idx]

    // No ID could be find
    if (!this.id) throw new Error('Could not get element ID from element object')
  }

  /** Alias to {@link Driver#waitFor Driver's waitFor function}
   * @async
   */
  waitFor (timeout = 0, pollInterval = 0) {
    timeout = timeout || this.driver._defaultPollTimeout
    pollInterval = pollInterval || this.driver._pollInterval
    return this.driver.waitFor.call(this, timeout, pollInterval)
  }

  /** Constant returning special KEY characters (enter, etc.)
   *  Constant are from the global variable {@link KEY}
   *  @static
   *
   * @example
   * var el = await driver.findElementCss('#input')
   * await e.sendKeys("This is a search" + Element.KEY.ENTER)
   */
  static get KEY () { return KEY }

  /**
   * Find an element within this element
   *
   * Note that you are encouraged to use one of the helper functions:
   * `findElementCss()`, `findElementLinkText()`, `findElementPartialLinkText()`,
   * `findElementTagName()`, `findElementXpath()`
   *
   * @param {string} using It can be `Driver.Using.CSS`, `Driver.Using.LINK_TEXT`,
   *                `Driver.Using.PARTIAL_LINK_TEXT`, `Driver.Using.TAG_NAME`,
   *                `Driver.Using.XPATH`
   * @param {string} value The parameter to the `using` method
   *
   * @return {Promise<Element>} An object representing the element.
   *
   * @example
   * // Find the element using the driver's `findElement()` call
   * var ul = await driver.findElement({ Driver.Using.CSS, value: 'ul' )
   * // Find the first LI element within the found UL
   * var items = await ul.findElement({ Driver.Using.CSS, value: 'li')
   *
   */
  async findElement (using, value) {
    var el = await this._execute('post', `/element/${this.id}/element`, {using, value})
    return new Element(this.driver, el)
  }

  /**
   * Find several elements within this element
   *
   * Note that you are encouraged to use one of the helper functions:
   * `findElementCss()`, `findElementLinkText()`, `findElementPartialLinkText()`,
   * `findElementTagName()`, `findElementXpath()`
   *
   * @param {string} using It can be `Driver.Using.CSS`, `Driver.Using.LINK_TEXT`,
   *                `Driver.Using.PARTIAL_LINK_TEXT`, `Driver.Using.TAG_NAME`,
   *                `Driver.Using.XPATH`
   * @param {string} value The parameter to the `using` method
   *
   * @return {Promise<Array<Element>>} An array of elements
   *
   * @example
   * // Find the element using the driver's `findElement()` call
   * var ul = await driver.findElement({ Driver.Using.CSS, value: 'ul' )
   * // Find ALL LI sub-elements within the found UL element
   * var items = await ul.findElements({ Driver.Using.CSS, value: 'li')
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
   * var el = await driver.findElementCss('#main')
   * var isSelected = await el.isSelected()
   *
   */
  async isSelected () {
    return !!(await this._execute('get', `/element/${this.id}/selected`))
  }

  /**
   * Get attribute called `name` from element
   * @async
   * @param {string} name The name of the attribute to be fetched
   *
   * @return {Promise<string>} The attribute's value
   * @example
   * var el = await driver.findElementCss('a' })
   * var href = el.getAttribute('href')
   *
   */
  getAttribute (name) {
    return this._execute('get', `/element/${this.id}/attribute/${name}`)
  }

  /**
   * Get property called `name` from element
   * @async
   *
   * @param {string} name The name of the property to be fetched
   *
   * @return {Promise<string>} The property's value
   * @example
   * var el = await driver.findElementCss('a' })
   * var href = el.getProperty('href')
   *
   */
  getProperty (name) {
    return this._execute('get', `/element/${this.id}/property/${name}`)
  }

  /**
   * Get css value from element
   * @async
   *
   * @param {string} name The name of the CSS value to be fetched
   *
   * @return {Promise<string>} The CSS's value
   * @example
   * var el = await driver.findElementCss('a' })
   * var height = el.getCssValue('height')
   *
   */
  getCssValue (name) {
    return this._execute('get', `/element/${this.id}/css/${name}`)
  }

  /**
   * Get text value from element
   * @async
   *
   * @return {Promise<string>} The text
   * @example
   * var el = await driver.findElementCss('a' })
   * var text = el.getText()
   */
  getText () {
    return this._execute('get', `/element/${this.id}/text`)
  }

  /**
   * Get tag name from element
   * @async
   *
   * @return {Promise<string>} The tag's name
   * @example
   * var el = await driver.findElementCss('.link' })
   * var tagName = el.getTagName()
   */
  getTagName () {
    return this._execute('get', `/element/${this.id}/name`)
  }

  /**
   * Get rect from element
   * @async
   *
   * @return {Promise<string>} The rect info

   * @example
   * var el = await driver.findElementCss('a' })
   * var rect = el.getRect()
   */
  getRect () {
    return this._execute('get', `/element/${this.id}/rect`)
  }

  /**
   * Check that the element is enabled
   *
   * @return {Promise<boolean>} true of false
   * @example
   * var el = await driver.findElementCss('#main')
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
   * var el = await driver.findElementCss('#button')
   * await el.click()
   *
   */
  async click () {
    await this._execute('post', `/element/${this.id}/click`)
    return this
  }

  /**
   * Clear an element
   *
   * @return {Promise<Element>} The element itself
   * @example
   * var el = await driver.findElementCss('#input')
   * await el.clear()
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
   * var el = await driver.findElementCss('#input')
   * await e.sendKeys("This is a search" + Element.KEY.ENTER)
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
   * var el = await driver.findElementCss('#input')
   * var screenshot = await el.takeScreenshot()
   *
   */
  async takeScreenshot (scroll = true) {
    var data = await this._execute('get', `/element/${this.id}/screenshot`, { scroll })
    return Buffer.from(data, 'base64')
  }

  /**
   * @private
   */
  async _execute (method, command, params) {
    return this.driver._execute(method, command, params)
  }
}

exports = module.exports = Element = FindHelpersMixin(Element)
