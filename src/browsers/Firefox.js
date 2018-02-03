const Browser = require('./Browser')
const utils = require('../utils')
const FirefoxDriver = require('../drivers/FirefoxDriver')

/**
 * Class that represents the {@link https://github.com/mozilla/geckodriver Firefox browser}.
 *
 *
 * It implements the `run()` method, which will run `geckodriver` or `geckodriver.exe`
 * (depending on the platform).
 * It also:
 *  * passed the `specific` properties onto the `alwaysMatch.moz:firefoxOptions`. Check
 *    {@link https://github.com/mozilla/geckodriver#mozfirefoxoptions Firefox's specific options}
 *    to see what you can pass as keys to the `specific` parameter
 *
 * Check the {@link https://developer.mozilla.org/en-US/docs/Mozilla/QA/Marionette/WebDriver/status Status of Firefox}
 * in terms of implementation of the w3c specs
 *
 * @extends Browser
 */

class Firefox extends Browser {
  constructor (alwaysMatch = {}, firstMatch = [], root = {}, specific = {}) {
    super(...arguments)

    // Give it a nice, lowercase name
    this.name = 'firefox'

    // Sets the key for specificKey, used by Browser#setSpecificKey()
    this.specificKey = 'moz:firefoxOptions'

    // Firefox's empty firefoxOptions
    this.setAlwaysMatchKey('moz:firefoxOptions', {}, true)

    // The required browser's name
    this.setAlwaysMatchKey('browserName', 'firefox')

    // Set the default executable
    this.setExecutable(process.platform === 'win32' ? 'geckodriver.exe' : 'geckodriver')
  }

  /**
   * @inheritdoc
   */
  run (options) {
    options.args.push('--port=' + options.port)
    return utils.exec(this._executable, options)
  }

  static get Driver () {
    return FirefoxDriver
  }
}

exports = module.exports = Firefox
