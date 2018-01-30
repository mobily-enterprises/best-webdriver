const Driver = require('./src/Driver')
const Actions = require('./src/actions/Actions')
const browser = require('./src/browsers/index')

exports = module.exports = { Driver, browser, Actions }

// "docs": "rm -rf docs/*;node_modules/jsdoc/jsdoc.js --template node_modules/jsdoc-template -c .jsdoc.config.js -R README.md -P package.json; mv _out/*/*/** docs;rm -rf _out;touch docs/.nojekyll"

/*
  [X] Install JSDoc, check generated documentation
  [X] Finish development off
    [X] Add _isCompiled to actions
    [X] Rename Element into Element
  [-] Finish off JSDOC documentation
    [X] Make markdown work
    [X] All element methods
    [X] All async methods marked as such (some return promises but aren't marked async)
    [X] See how to clone documentation for findElement and findElements
    [X] All helper mixins documented within the classes
    [X] Write examples for findElementHelpers
    [X] All gloval consts
    [X] Split into smaller files
    [X] Document remaining methods
      [X] Document Browsers (Chrome, Firefox, Generic), decide how to document them
      [X] Put API online on Github pages
      [X] Check other JSDoc themes, hopefully better
      [X] Document InputDevice
      [X] Document Actions
      [X] Make sure Globals are indexed right
      [X] Document Pointer and Keyboard in Actions
    [ ] Write guide in README.md
  [X] Submit code for review on codereview
  [ ] Write initial tests (ah!)
  [ ] Write more tests

https://codereview.stackexchange.com/questions/186203/check-an-es6-api-implementation-can-you-see-anything-terrible
*/
