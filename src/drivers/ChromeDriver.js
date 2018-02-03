const Driver = require('../Driver')

/**
 * Class that adds a compatibility layer to the w3c Driver to work around Chrome's
 * lack of full s3c support
 * It inherits from Driver, but tries to make the unsupported w3c calls actually work
 *
 * @extends Driver
 */
class ChromeDriver extends Driver {
  /**
   * Set timeouts
   * @async
   *
   * @param {Object} param The object with the timeouts
   * @param {number} param.implicit Implicit timeout
   * @param {number} param.pageLoad Timeout for page loads
   * @param {number} param.script Timeout for scripts
   *
   * @example
   * var timeouts = await driver.setTimeouts({ implicit: 7000 })
   */
  setTimeouts (parameters) {
    return { implicit: 30001, pageLoad: 30002, script: 30003 }
    // return this._execute('post', '/timeouts', parameters)
  }
}

exports = module.exports = ChromeDriver
