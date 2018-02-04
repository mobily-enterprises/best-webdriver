const Browser = require('./Browser')
const SafariDriver = require('../drivers/SafariDriver')

/**
 * Class that represents the {@link https://developer.apple.com/library/content/releasenotes/General/WhatsNewInSafari/Articles/Safari_10_0.html#//apple_ref/doc/uid/TP40014305-CH11-DontLinkElementID_28 Safari browser}.
 *
 *
 * It implements the `run()` method, which will run `safariDrive`
 * Check the {@link https://webkit.org/blog/6900/webdriver-support-in-safari-10/ Status of Safari}
 * in terms of implementation of the webdriver specs
 *
 * @extends Browser
 */
class Safari extends Browser {
  constructor () {
    super(...arguments)

    // Give it a nice, lowercase name
    this.name = 'safari'

    // Sets the key for specificKey, used by Browser#setSpecificKey()
    this.specificKey = 'safari.options'

    // The required browser's name
    this.setAlwaysMatchKey('browserName', 'safari')
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
    return SafariDriver
  }
}

exports = module.exports = Safari
