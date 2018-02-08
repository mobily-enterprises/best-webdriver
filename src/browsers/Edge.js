const Browser = require('./Browser')
const EdgeDriver = require('../drivers/EdgeDriver')

/**
 * Class that represents the {@link https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/ Edge browser}.
 * Check the {@link https://docs.microsoft.com/en-us/microsoft-edge/webdriver Status of Edge}
 * in terms of implementation of the webdriver specs
 *
 * @extends Browser
 */
class Edge extends Browser {
  constructor () {
    super(...arguments)

    // Give it a nice, lowercase name
    this.name = 'edge'

    // Sets the key for specificKey, used by Browser#setSpecificKey()
    this.specificKey = 'edgeOptions'

    // The required browser's name
    this.setAlwaysMatchKey('browserName', 'edge')
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
    return EdgeDriver
  }
}

exports = module.exports = Edge
