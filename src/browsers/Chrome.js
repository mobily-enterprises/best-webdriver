const Browser = require('./Browser')
const utils = require('../utils')

// https://sites.google.com/a/chromium.org/chromedriver
// https://sites.google.com/a/chromium.org/chromedriver/capabilities
// STATUS: https://chromium.googlesource.com/chromium/src/+/lkcr/docs/chromedriver_status.md
class Chrome extends Browser {
  constructor (alwaysMatch = {}, firstMatch = [], root = {}, specific = {}) {
    super(...arguments)

    // Give it a nice, lowercase name
    this.name = 'chrome'

    // This is crucial so that Chrome obeys w3c
    this.setAlwaysMatchKey('chromeOptions.w3c', true, true)

    // The required browser's name
    this.setAlwaysMatchKey('browserName', 'chrome')

    // Add specific Options
    for (var k in specific) {
      if (specific.hasOwnProperty(k)) {
        this.alwaysMatch.chromeOptions[ k ] = specific[ k ]
      }
    }
  }

  run (options) {
    var executable = process.platform === 'win32' ? 'chromedriver.exe' : 'chromedriver'
    options.args.push('--port=' + options.port)
    return utils.exec(executable, options)
  }
}

exports = module.exports = Chrome
