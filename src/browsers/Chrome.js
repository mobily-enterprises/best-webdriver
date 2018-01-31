const Browser = require('./Browser')
const utils = require('../utils')

/**
 * Class that represents the {@link https://sites.google.com/a/chromium.org/chromedriver/ Chrome webdriver}.
 *
 *
 * It implements the `run()` method, which will run `chromewebdriver` or `chromewebdriver.exe`
 * (depending on the platform).
 * It also:
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
  constructor (alwaysMatch = {}, firstMatch = [], root = {}, specific = {}) {
    super(...arguments)

    // Give it a nice, lowercase name
    this.name = 'chrome'

    // Sets the key for specificKey, used by Browser#setSpecificKey()
    this.specificKey = 'chromeOptions'

    // This is crucial so that Chrome obeys w3c
    this.setSpecificKey('w3c', true, true)

    // The required browser's name
    this.setAlwaysMatchKey('browserName', 'chrome')

    // Add specific Options
    for (var k in specific) {
      if (specific.hasOwnProperty(k)) {
        this.alwaysMatch.chromeOptions[ k ] = specific[ k ]
      }
    }
  }

  /**
   * @inheritdoc
   */
  run (options) {
    var executable = process.platform === 'win32' ? 'chromedriver.exe' : 'chromedriver'
    options.args.push('--port=' + options.port)
    return utils.exec(executable, options)
  }
}

exports = module.exports = Chrome
