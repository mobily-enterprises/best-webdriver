const Browser = require('./Browser')
const utils = require('../utils')

/**
 * Class that represents the {@link https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/ Edge webdriver}.
 *
 *
 * It implements the `run()` method, which will run `MicrosoftWebDriver.exe`
 * Check the {@link https://docs.microsoft.com/en-us/microsoft-edge/webdriver Status of Edge}
 * in terms of implementation of the w3c specs
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

    // Set the default executable
    this.setExecutable('MicrosoftWebDriver.exe')
  }

  /**
   * @inheritdoc
   */
  run (options) {
    options.args.push('--port=' + options.port)
    return utils.exec(this._executable, options)
  }
}

exports = module.exports = Edge
