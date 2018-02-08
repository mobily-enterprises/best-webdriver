const Driver = require('./Driver')

/**
 * Browser-specific class, which knows how to run() the executable by overriding
 * the {@link Driver}'s {@link Driver#run} method.
 *
 * This class also  adds a compatibility layer to the webdriver Driver to work around Chrome's
 * lack of full w3c support.
 *
 * It inherits from {@link Driver}, but tries to make the unsupported webdriver calls actually work
 */

class SafariDriver extends Driver {
  constructor (...args) {
    super(...args)
    // Set the default executable
    this.setExecutable(process.platform === 'win32' ? 'safariDriver.exe' : 'safariDriver')

    // Set the browser's name
    this.name = 'safari'
  }
}

exports = module.exports = SafariDriver
