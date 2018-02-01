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
      'src/Driver.js',
      'src/Element.js',
      'src/browsers/Browser.js',
      'src/browsers/Chrome.js',
      'src/browsers/Firefox.js',
      'src/browsers/Safari.js',
      'src/browsers/Edge.js',
      'src/browsers/Remote.js',
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
