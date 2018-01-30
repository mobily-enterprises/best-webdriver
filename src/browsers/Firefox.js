const Browser = require('./Browser')
const utils = require('../utils')

/**
 * Class that represents the {@link https://github.com/mozilla/geckodriver Firefox webdriver}.
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

    // Firefox's empty firefoxOptions
    this.setAlwaysMatchKey('moz:firefoxOptions', {}, true)

    // The required browser's name
    this.setAlwaysMatchKey('browserName', 'firefox')

    // Add specific Options
    for (var k in specific) {
      if (specific.hasOwnProperty(k)) {
        this.alwaysMatch['moz:firefoxOptions'][ k ] = specific[ k ]
      }
    }
  }

  /**
   * @inheritdoc
   */
  run (options) {
    var executable = process.platform === 'win32' ? 'geckodriver.exe' : 'geckodriver'
    options.args.push('--port=' + options.port)
    return utils.exec(executable, options)
  }
}

exports = module.exports = Firefox
