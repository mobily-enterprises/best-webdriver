module.exports = {
  tags: {
    allowUnknownTags: true,
    dictionaries: ['jsdoc']
  },
  opts: {
    destination: './_out',
    encoding: 'utf8',
    recurse: false
  },
  source: {
    include: [
      'src/FindHelpersMixin.js',
      'src/KEY.js',
      'src/USING.js',
      'src/drivers/Driver.js',
      'src/drivers/ChromeDriver.js',
      'src/drivers/FirefoxDriver.js',
      'src/drivers/SafariDriver.js',
      'src/drivers/EdgeDriver.js',
      'src/Element.js',
      'src/config/Config.js',
      'src/actions/Actions.js',
      'src/actions/InputDevice.js',
      'src/actions/Pointer.js',
      'src/actions/Keyboard.js'
    ],
    excludePattern: '(node_modules/|docs)'
  },
  plugins: ['plugins/markdown'],
  templates: {
    referenceTitle: 'Best Webdriver API',
    disableSort: true
  }
}
