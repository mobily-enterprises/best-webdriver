const Driver = require('./src/Driver')
const Actions = require('./src/actions/Actions')
const browser = require('./src/browsers/index')

exports = module.exports = { Driver, browser, Actions }

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
    [-] Document remaining methods
      [-] Document Browsers (Chrome, Firefox, Generic), decide how to document them
      [ ] Document InputDevice
      [ ] Document Actions
    [ ] Write guide in README.md
    [ ] Check other themes, hopefully better
  [ ] Make Docco documentation
  [ ] Put documentation online on Github pages
  [X] Submit code for review on codereview

  [ ] Write initial tests (ah!)
  [ ] Write more tests

https://codereview.stackexchange.com/questions/186203/check-an-es6-api-implementation-can-you-see-anything-terrible
*/
