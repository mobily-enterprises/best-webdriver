const DO = require('deepobject')

/**
 * A class that represents a Webdriver configuration
 */
class Config {
  /**
   * The main aim of Config class is to provide a configuration object that
   * will be used when creating a new session with the webdriver
   *
   *  A basic (empty) session configuration object looks like this:
   *
   *        {
   *          capabilities: {
   *            alwaysMatch: {
   *              'goog:chromeOptions': { w3c: true }
   *            },
   *            firstMatch: []
   *          }
   *        }
   *
   * Note that `goog:chromeOptions` is set as this option is necessary to make the
   * Chrome webdriver work with this API.
   *
   * Configuration options are set with the methods {@link Config#setAlwaysMatch},
   * {@link Config#addFirstMatch}, {@link Config#set} and {@link Config#setSpecific}
   *
   */
  constructor () {
    this.sessionParameters = {
      capabilities: {
        alwaysMatch: {
          'goog:chromeOptions': { w3c: true }
        },
        firstMatch: []
      }
    }
  }

  /**
   * Method to set the `alwaysMatch` property in the browser's capabilities
   *
   * @param {string} path The name of the property to set. It can be a path; if path is has a `.` (e.g.
   *                      `something.other`), the property
   *                      `sessionParameters.capabilities.alwaysMatch.something.other` will be set
   * @param {string} path.browserName The user agent
   * @param {string} path.browserVersion Identifies the version of the user agent
   * @param {string} path.platformName Identifies the operating system of the endpoint node
   * @param {boolean} path.acceptInsecureCerts Indicates whether untrusted and self-signed TLS certificates are implicitly trusted on navigation for the duration of the session
   * @param {string} path.pageLoadStrategy Defines the current session’s page load strategy. It can be `none`, `eager` or `normal`
   * @param {object} path.proxy Defines the current session’s proxy configuration. See the
                     {@link https://w3c.github.io/webdriver/webdriver-spec.html#dfn-proxy-configuration spec's
                     proxy options}
   * @param {boolean} path.setWindowRect Indicates whether the remote end supports all of the commands in Resizing and Positioning Windows
   * @param {object} path.timeouts Describes the timeouts imposed on certain session operations. Can have keys `implicit`, `pageLoad` or `script`
   * @param {string} path.unhandledPromptBehavior Describes the current session’s user prompt handler. It
   *                 can be: `dismiss`, `accept`, `dismiss and notify`, `accept and notify`, `ignore`
   * @param {*} value The value to assign to the property
   * @param {boolean} force It will overwrite keys if already present.
   *
   * @example
   * this.setAlwaysMatch('platformName', 'linux')
   * this.setAlwaysMatch('timeouts.implicit', 10000)
   */
  setAlwaysMatch (path, value, force = false) {
    var alwaysMatch = this.sessionParameters.capabilities.alwaysMatch
    if (force || typeof DO.get(alwaysMatch, path) === 'undefined') {
      DO.set(alwaysMatch, path, value)
    }
    return this
  }

  /**
   * Adds a property to the `firstMatch` array in the browser's capabilities.
   *
   * @param {string} key The name of the property to set
   * @param {*} value The value to assign
   * @param {boolean} force It will overwrite keys if needed
   *
   * @example
   * this.addFirstMatch({browserName: 'chrome'})
   * this.addFirstMatch({browserName: 'firefox'})
   * NOTE: WAS:
   * this.addFirstMatch({'browserName', 'chrome')
   * this.addFirstMatch('browserName', 'firefox')
   */
  // addFirstMatch (key, value, force = false) {
  //  if (force || !this.sessionParameters.capabilities.firstMatch.indexOf(key) === -1) {
  //    this.sessionParameters.capabilities.firstMatch.push({ [key]: value })
  //  }
  //  return this
  //}
  addFirstMatch (obj) {
    this.sessionParameters.capabilities.firstMatch.push(obj)

    return this
  }

  /**
   * Sets a key (or a path) on the object which will be sent to the webdriver when
   * creating a session
   *
   * @param {string} path The name of the property to set. It can be a path; if path is has a `.` (e.g.
   *                      `something.other`), the property
   *                      `sessionParameters.something.other` will be set
   * @param {*} value The value to assign
   * @param {boolean} force It will overwrite keys if needed
   *
   * @example
   * this.set('login', 'blah')
   * this.set('pass', 'blah')
   */
  set (path, value, force = true) {
    if (force || typeof DO.get(this.sessionParameters, path) === 'undefined') {
      DO.set(this.sessionParameters, path, value)
    }
    return this
  }

  /**
   * Sets a configuration option for the specific browser.
   *
   * @param {browserName} name The name of the browser to set. It can be
   *                       `chrome`, `firefox`, `safari` or `edge`
   * @param {string} path The name of the property to set. It can be a path; if path is has a `.` (e.g.
   *                      `something.other`), the property
   *                      `sessionParameters.something.other` will be set
   * @param {*} value The value to assign
   * @param {boolean} force It will overwrite keys if needed
   *
   * @example
   * this.setSpecific('chrome', 'FIXME1', 'blah')
   * this.setSpecific('safari', 'FIXME2', 'blah')
   */
  setSpecific (browserName, path, value, force = true) {
    var specificKey
    switch (browserName) {
      case 'chrome': specificKey = 'goog:chromeOptions'; break
      case 'edge': specificKey = 'edgeOptions'; break
      case 'firefox': specificKey = 'moz:firefoxOptions'; break
      case 'safari': specificKey = 'safari.options'; break
    }

    if (!specificKey) {
      throw new Error('setSpecificKey called for a browser that doesn\'t support them')
    }
    if (force || typeof DO.get(this.sessionParameters, specificKey + '.' + path) === 'undefined') {
      DO.set(this.sessionParameters, `capabilities.alwaysMatch.${specificKey}.${path}`, value)
    }
    return this
  }

  /**
   * Return the current session parameters. This is used by the {@link Driver#newSession} call
   * to get the parameters to be sent over
   *
   * @return {Object} The full session parameters
   *
   */
  getSessionParameters () {
    return this.sessionParameters
  }
}
exports = module.exports = Config
