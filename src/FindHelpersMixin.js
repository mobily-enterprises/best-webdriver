const USING = require('./USING')

/**
 * It provides utility methods for the `findElement` and `findElements`.
 * Both {@link Driver} and {@link Element} include this mixin
 * @mixin FindHelpersMixin
 */
const FindHelpersMixin = (superClass) => class extends superClass {
  /**
   * Find first element matching CSS
   * @memberof FindHelpersMixin#
   * @async
   *
   * @param {string} value The CSS expression
   *
   * @example
   * var list = driver.findElementCss('.list')
   * var listTitle = list.findElementCss('.title')
   */
  findElementCss (value) {
    return this.findElement(USING.CSS, value)
  }

  /**
   * Find first element matching text
   * @memberof FindHelpersMixin#
   * @async
   *
   * @param {string} value The text to match
   *
   * @example
   * var a = driver.findElementLinkText('cick here')
   * // or...
   * var el = driver.findElementCss('#something') // or
   * var l = item.findElementLinkText('click here')
   */
  findElementLinkText (value) {
    return this.findElement(USING.LINK_TEXT, value)
  }

  /**
   * Find first element matching link text
   * @memberof FindHelpersMixin#
   * @async
   *
   * @param {string} value The link text to match
   *
   * @example
   * var a = driver.findElementPartialLinkText('cick here')
   * // or...
   * var el = driver.findElementCss('#something') // or
   * var l = item.findElementPartialLinkText('click here')
   */
  findElementPartialLinkText (value) {
    return this.findElement(USING.PARTIAL_LINK_TEXT, value)
  }

  /**
   * Find first element matching tag name
   * @memberof FindHelpersMixin#
   * @async
   *
   * @param {string} value The tag name to match
   *
   * @example
   * var item = driver.findElementTagName('item') // or
   * var subItem = item.findElementTagName('subitem')
   */
  findElementTagName (value) {
    return this.findElement(USING.TAG_NAME, value)
  }

  /**
   * Find first element matching xpath
   * @memberof FindHelpersMixin#
   * @async
   *
   * @param {string} value The xpath to match
   *
   * @example
   * var item = driver.findElementXpath('/html/body/form[1]') // or
   * var subItem = item.findElementXpath('/div/div/subitem')
   */
  findElementXpath (value) {
    return this.findElement(USING.XPATH, value)
  }

  /**
   * Find all elements matching CSS
   * @memberof FindHelpersMixin#
   * @async
   *
   * @param {string} value The CSS expression
   *
   * @example
   * var allItems = driver.findElementsCss('.list')
   * var item = allItems[0]
   * var allTitles = item.findElementsCss('.title')
   */
  findElementsCss (value) {
    return this.findElements(USING.CSS, value)
  }

  /**
   * Find all elements matching text
   * @memberof FindHelpersMixin#
   * @async
   *
   * @param {string} value The text to match
   *
   * @example
   * var links = driver.findElementsLinkText('cick here')
   * // or...
   * var el = driver.findElementCss('#something') // or
   * var links = item.findElementsLinkText('click here')
   */
  findElementsLinkText (value) {
    return this.findElements(USING.LINK_TEXT, value)
  }

  /**
   * Find all elements matching link text
   * @memberof FindHelpersMixin#
   * @async
   *
   * @param {string} value The link text to match
   *
   * @example
   * var links = driver.findElementsPartialLinkText('cick here')
   * // or...
   * var el = driver.findElementCss('#something') // or
   * var links = item.findElementsPartialLinkText('click here')
   */
  findElementsPartialLinkText (value) {
    return this.findElements(USING.PARTIAL_LINK_TEXT, value)
  }

  /**
   * Find all elements matching tag name
   * @memberof FindHelpersMixin#
   * @async
   *
   * @param {string} value The tag name to match
   *
   * @example
   * var items = driver.findElementsTagName('item') // or
   * var el = items[0]
   * var subItem = el.findElementsTagName('subitem')
   */
  findElementsTagName (value) {
    return this.findElements(USING.TAG_NAME, value)
  }

  /**
   * Find all elements matching xpath
   * @memberof FindHelpersMixin#
   * @async
   *
   * @param {string} value The xpath to match
   *
   * @example
   * var items = driver.findElementsXpath('/html/body') // or
   * var el = items[0]
   * var subItems = el.findElementXpath('/div/div/subitem')
   */
  findElementsXpath (value) {
    return this.findElements(USING.XPATH, value)
  }
}

exports = module.exports = FindHelpersMixin
