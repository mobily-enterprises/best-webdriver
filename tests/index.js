/*
  [X] Quit straight away if there are no browsers
  [X] Write up a basic HTML file for testing
  [X] Start a basic web server and launch it
  [X] Write out empty list of tests to be done
  [X] Implement ONE read test
  [ ] Actually implement tests
    [ ] Write non-element tests
    [ ] Write some element tests
    [ ] Write some action tests
    [ ] Do some slow ajax, test waitFor()
*/

const { Driver, browser, Actions } = require('best-webdriver') // eslint-disable-line no-unused-vars
const chai = require('chai')
const express = require('express')
const http = require('http')
const path = require('path')
const { forEach } = require('p-iteration')

// chai.should()
const expect = chai.expect

var allBrowsers = [ browser.Chrome, browser.Firefox, browser.Edge, browser.Safari ]
var browsers = []
var server

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

function startServer () {
  return new Promise((resolve) => {
    // Serve static files in `public` (the whole client-side app)
    const app = express()
    app.use('/', express.static(path.join(__dirname, 'www')))
    var server = http.createServer(app)

    server.listen({ port: 0 }, () => {
      resolve(server)
    })
  })
}

/* eslint-disable no-unused-expressions */
/* globals describe,it,before,after */

describe('start all tests', async function () {
  //
  before(async function () {
    // Start all browsers
    for (var i = 0, l = allBrowsers.length; i < l; i++) {
      var Browser = allBrowsers[i]
      if (await browserThere(Browser)) {
        browsers.push(Browser)
      }
    }
    if (!browsers.length) {
      throw new Error('No webdrivers found')
    }

    // Start the local HTTP server
    server = await startServer()
    var port = server.address().port
    console.log(`Started local server: http://127.0.0.1:${port}/`)
  })

  // Close things up
  after(async function () {
    server.close()
  })

  describe('basic non-element calls', async function () {
    it('status', async function () {
      forEach(browsers, async (Browser) => {
        var driver = new Driver(new Browser())
        await driver.newSession()
        var status = await driver.status()
        expect(status).to.be.a('object')
        await driver.deleteSession()
        await driver.stopWebDriver()
        console.log('Status:', status)
      })
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
    it('getTitle', async function () {
      expect(true).to.be.true
    })
    it('getWindowHandles/switchToWindow', async function () {
      expect(true).to.be.true
    })
    it('switchToFrame/switchToParentFrame', async function () {
      expect(true).to.be.true
    })
    it('getWindowRect/setWindowRect', async function () {
      expect(true).to.be.true
    })
    it('maximizeWindow/minimizeWindow/fullScreenWindow', async function () {
      expect(true).to.be.true
    })
    it('getPageSource', async function () {
      expect(true).to.be.true
    })
    it('executeScript/executeAsyncScript', async function () {
      expect(true).to.be.true
    })
    it('getAllCookies/getNamedCookie/addCookie/deleteCookie/deleteAllCookies', async function () {
      expect(true).to.be.true
    })
    it('dismissAlert/acceptAlert/getAlertText/sendAlertText', async function () {
      expect(true).to.be.true
    })
    it('takeScreenshot', async function () {
      expect(true).to.be.true
    })
    it('getActiveElement', async function () {
      expect(true).to.be.true
    })
  })

  describe('actions', async function () {
    it('mouse actions', async function () {
      expect(true).to.be.true
    })
    it('keyboard actions', async function () {
      expect(true).to.be.true
    })
    it('mouse and keyboard actions', async function () {
      expect(true).to.be.true
    })
    it('dragging', async function () {
      expect(true).to.be.true
    })
  })

  describe('waitFor', async function () {
    it('wait for an element', async function () {
      expect(true).to.be.true
    })
    it('wait for specific window title', async function () {
      expect(true).to.be.true
    })
  })

  describe('elements', async function () {
    it('driver\'s findElement', async function () {
      expect(true).to.be.true
    })

    it('driver\'s findElementS', async function () {
      expect(true).to.be.true
    })

    it('element\'s isSelected', async function () {
      expect(true).to.be.true
    })
    it('element\'s getAttribute', async function () {
      expect(true).to.be.true
    })

    it('element\'s getProperty', async function () {
      expect(true).to.be.true
    })
    it('element\'s getCssValue', async function () {
      expect(true).to.be.true
    })
    it('element\'s getText', async function () {
      expect(true).to.be.true
    })
    it('element\'s getTagName', async function () {
      expect(true).to.be.true
    })
    it('element\'s getRect', async function () {
      expect(true).to.be.true
    })
    it('element\'s isEnabled', async function () {
      expect(true).to.be.true
    })
    it('element\'s click', async function () {
      expect(true).to.be.true
    })
    it('element\'s clear', async function () {
      expect(true).to.be.true
    })
    it('element\'s sendKeys', async function () {
      expect(true).to.be.true
    })
    it('element\'s takeScreenshot', async function () {
      expect(true).to.be.true
    })
    it('element\'s findElement', async function () {
      expect(true).to.be.true
    })
    it('element\'s findElements', async function () {
      expect(true).to.be.true
    })
  })
})
