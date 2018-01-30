module.exports = {
  opts: {
    destination: './_out'// recurse: true
  },
  source: {
    include: [
      'src/FindHelpersMixin.js',
      'src/KEY.js',
      'src/USING.js',
      'src/Driver.js',
      'src/Element.js',
      'src/browsers/Browser.js',
      'src/browsers/Chrome.js',
      'src/browsers/Firefox.js',
      'src/browsers/Remote.js',
      'src/actions/Actions.js',
      'src/actions/InputDevice.js',
      'src/actions/Keyboard.js',
      'src/actions/Pointer.js'
    ]
  },
  plugins: ['plugins/markdown'],
  templates: {
    referenceTitle: 'Best Webdriver API',
    disableSort: true
  }

  // plugins: ["plugins/summarize"]
}
