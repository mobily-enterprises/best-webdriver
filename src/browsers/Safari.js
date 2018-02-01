const Browser = require('./Browser')
const utils = require('../utils')

/**
 * Class that represents the {@link https://developer.apple.com/library/content/releasenotes/General/WhatsNewInSafari/Articles/Safari_10_0.html#//apple_ref/doc/uid/TP40014305-CH11-DontLinkElementID_28 Safari webdriver}.
 *
 *
 * It implements the `run()` method, which will run `safariDrive`
 * Check the {@link https://webkit.org/blog/6900/webdriver-support-in-safari-10/ Status of Safari}
 * in terms of implementation of the w3c specs
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

    // Set the default executable
    this.setExecutable('safariDriver')
  }

  /**
   * @inheritdoc
   */
  run (options) {
    options.args.push('--port=' + options.port)
    return utils.exec(this._executable, options)
  }
}

exports = module.exports = Safari
