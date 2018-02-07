const DO = require('deepobject')
const Driver = require('../drivers/Driver')

/**
 * A base class that represents a generic browser. All browsers ({@link Chrome},
{@link Firefox}) will inherit from this class
 */
class Browser {
  /**
   * Base class for all browser objects such as {@link Chrome}, {@link Firefox},
   * {@link Safari}, {@link Edge}, and {@link Remote Remote}
   *
   * The main aim of Browser objects is to:
   *
   *  * Provide a configuration object that will be used when creating a new session with the webdriver
   *  * Provide a static {@link Browser.Driver} property that points to the right specific {@link Driver}.
   *
   *  A basic (empty) session configuration object looks like this:
   *
   *        {
   *          capabilities: {
   *            alwaysMatch: {},
   *            firstMatch: []
   *          }
   *        }
   *
   * When connecting straight to a locally launched webdriver process, the main use of the session configuraiton
   * object is the setting of browser-specific information.
   * For example when creating a {@link Chrome} object, the basic configuration looks like this:
   *
   *        {
   *          capabilities: {
   *            alwaysMatch: {
   *              chromeOptions: { w3c: true }
   *            },
   *            firstMatch: []
   *          }
   *        }
   *
   * This will ensure that Chrome will "speak" the w3c protocol.
   *
   * Configuration options are set with the methods {@link Browser#setAlwaysMatchKey},
   * {@link Browser#addFirstMatch}, {@link Browser#setRootKey} and {@link Browser#setSpecificKey}
   *
   */
  constructor () {
    this.sessionParameters = {
      capabilities: {
        alwaysMatch: {},
        firstMatch: []
      }
    }
    // Give it a nice, lowercase name
    this.name = 'browser'
    this.specificKey = null
    this.executable = null
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
   * this.setAlwaysMatchKey('platformName', 'linux')
   * this.setAlwaysMatchKey('timeouts.implicit', 10000)
   */
  setAlwaysMatchKey (path, value, force = false) {
    var alwaysMatch = this.sessionParameters.capabilities.alwaysMatch
    if (force || typeof DO.get(alwaysMatch, path) === 'undefined') {
      DO.set(alwaysMatch, path, value)
    }
    return this
  }

  /**
   * Adds a property to the `firstMatch` array in the browser's capabilities.
   *
   * @param {string} name The name of the property to set
   * @param {*} value The value to assign
   * @param {boolean} force It will overwrite keys if needed
   *
   * @example
   * this.addFirstMatch('browserName', 'chrome')
   * this.addFirstMatch('browserName', 'firefox')
   */
  addFirstMatch (name, value, force = false) {
    if (force || !this.sessionParameters.capabilities.firstMatch.indexOf(name) === -1) {
      this.sessionParameters.capabilities.firstMatch.push({ [name]: value })
    }
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
   * this.setRootKey('login', 'blah')
   * this.setRootKey('pass', 'blah')
   */
  setRootKey (path, value, force = true) {
    if (force || typeof DO.get(this.sessionParameters, path) === 'undefined') {
      DO.set(this.sessionParameters, path, value)
    }
    return this
  }

  /**
   * Sets a configuration option for the specific browser.
   *
   * @param {string} path The name of the property to set. It can be a path; if path is has a `.` (e.g.
   *                      `something.other`), the property
   *                      `sessionParameters.something.other` will be set
   * @param {*} value The value to assign
   * @param {boolean} force It will overwrite keys if needed
   *
   * @example
   * this.setSpecificKey('FIXME1', 'blah')
   * this.setSpecificKey('FIXME2', 'blah')
   */
  setSpecificKey (path, value, force = true) {
    if (!this.specificKey) {
      throw new Error('setSpecificKey called for a browser that doesn\'t support them')
    }
    if (force || typeof DO.get(this.sessionParameters, this.specificKey + '.' + path) === 'undefined') {
      DO.set(this.sessionParameters, `capabilities.alwaysMatch.${this.specificKey}.${path}`, value)
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
    return Driver
  }
}
exports = module.exports = Browser
