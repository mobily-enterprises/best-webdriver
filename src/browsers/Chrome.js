const Browser = require('./Browser')
const ChromeDriver = require('../drivers/ChromeDriver')

/**
 * Class that represents the {@link https://sites.google.com/a/chromium.org/chromedriver/ Chrome browser}.
 *
 *
 * It:
 *  * makes absolute sure that `chromeOptions.w3c` is set to `true`. This is crucial so that chrome
 *    is compliant with the w3c webdriver standard, which is what this API expects.
 *  * passed the `specific` properties onto the `alwaysMatch.chromeOptions`. Check
 *    {@link https://sites.google.com/a/chromium.org/chromedriver/capabilities#TOC-chromeOptions-object Chrome's specific options}
 *    to see what you can pass as keys to the `specific` parameter
 *
 * Check the {@link https://chromium.googlesource.com/chromium/src/+/lkcr/docs/chromedriver_status.md Status of Chrome}
 * in terms of implementation of the w3c specs
 *
 * @extends Browser
 */
class Chrome extends Browser {
  constructor () {
    super(...arguments)

    // Give it a nice, lowercase name
    this.name = 'chrome'

    // Sets the key for specificKey, used by Browser#setSpecificKey()
    this.specificKey = 'chromeOptions'

    // This is crucial so that Chrome obeys w3c
    this.setSpecificKey('w3c', true, true)

    // The required browser's name
    this.setAlwaysMatchKey('browserName', 'chrome')
  }

  /**
   * Returns the specific driver for this browser.
   * Specific drivers will ensure that implementation problems
   * are fixed, by fixing return values or implementing features
   * manually.
   *
   * This example is for {@link Chrome}, but will apply to
   * {@link Firefox}, {@link Edge}, {@link Safari} and {@link Remote} too.
   *
   * @example
   * const browsers = require('best-chromedriver').browsers
   *
   * // Get the constructors for the Chrome configurator/runner and for
   * // the specific driver
   * var Chrome = browsers.Chrome
   * var ChromeDriver = Chrome.Driver
   *
   * // Make up the driver
   * var chrome = new Chrome()
   * var driver = new ChromeDriver(chrome)
   * await driver.newSession()
   */
  static get Driver () {
    return ChromeDriver
  }
}

exports = module.exports = Chrome
