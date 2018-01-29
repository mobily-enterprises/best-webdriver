const Browser = require('./Browser')
const utils = require('../utils')

// https://github.com/mozilla/geckodriver/blob/master/README.md
// https://github.com/mozilla/geckodriver
// STATUS: https://developer.mozilla.org/en-US/docs/Mozilla/QA/Marionette/WebDriver/status
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

  run (options) {
    var executable = process.platform === 'win32' ? 'geckodriver.exe' : 'geckodriver'
    options.args.push('--port=' + options.port)
    return utils.exec(executable, options)
  }
}

exports = module.exports = Firefox
