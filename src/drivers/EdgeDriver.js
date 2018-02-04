const Driver = require('./Driver')

/**
 * Browser-specific class, which knows how to run() the executable by overriding
 * the {@link Driver}'s {@link Driver#run} method.
 *
 * This class also  adds a compatibility layer to the Driver to work around Chrome's
 * lack of full s3c support
 * It inherits from {@link Driver}, but tries to make the unsupported webdriver calls actually work
 */

class EdgeDriver extends Driver {
  constructor (...args) {
    super(...args)
    // Set the default executable
    this.setExecutable('MicrosoftWebDriver.exe')
  }
}

exports = module.exports = EdgeDriver
