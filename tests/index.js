/*
  [ ] Quit straight away if there are no browsers
  [ ] Start a basic web server and launch it
  [ ] Get some basic test files from selenium-node
  [ ] Write out empty list of tests to be done
  [ ] Actually implement tests
    [ ] Run first non-element tests
    [ ] Run some element tests
    [ ] Run some actions
    [ ] Do some slow ajax, test waitFor()
*/

const { Driver, browser, Actions } = require('best-webdriver') // eslint-disable-line no-unused-vars
const chai = require('chai')

// chai.should()
const expect = chai.expect

var allBrowsers = [ browser.Chrome, browser.Firefox, browser.Edge, browser.Safari ]
var browsers = []

async function browserThere (Browser) {
  var browser = new Browser()
  var driver = new Driver(browser)
  console.log('Checking:', browser.name)
  try {
    await driver.startWebDriver()
  } catch (e) {
    console.log(`${browser.name} not found.`)
    return false
  }
  await driver.stopWebDriver()
  console.log(`${browser.name} found!`)
  return true
}

/* eslint-disable no-unused-expressions */
/* globals describe,it,before */

describe('start all tests', async function () {
  //
  before(async function () {
    for (var i = 0, l = allBrowsers.length; i < l; i++) {
      var Browser = allBrowsers[i]
      if (await browserThere(Browser)) {
        browsers.push(Browser)
      }
    }
  })

  describe('basic non-element calls', async function () {
    it('status', async function () {
      expect(true).to.be.true
    })
    it('timeouts', async function () {
      expect(true).to.be.true
    })
    it('navigateTo/getCurrentUrl', async function () {
      expect(true).to.be.true
    })
    it('back/forward/refresh', async function () {
      expect(true).to.be.true
    })
  })

  describe('close it all down', async function () {
    it('close all browsers down', async function () {
    })
  })
})
