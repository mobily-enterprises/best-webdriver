const Browser = require('./Browser')

/**
 * Class that represents a generic webdriver
 *
 * Use this class when connecting to a Selenium proxy webdriver, which will in turn forward your
 * request to the appropriate webdriver depending on the requirements
 *
 * The `run()` method isn't implemented (since there is nothing to run).
 *
 * @extends Browser
 */

class Remote extends Browser { // eslint-disable-line no-unused-vars
}

exports = module.exports = Remote
