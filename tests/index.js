const { Driver, browser, Actions } = require('best-webdriver') // eslint-disable-line no-unused-vars
const chai = require('chai')
const express = require('express')
const http = require('http')
const path = require('path')

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

function itAll (description, cb) {
  browsers.forEach((Browser) => {
    var driver = new Driver(new Browser())
    it(`[${driver._browser.name}] ${description}`, async function () {
      this.timeout(5000)
      await driver.newSession()
      await cb.call(this, driver)
      await driver.deleteSession()
      await driver.stopWebDriver()
    })
  })
}

function itAllClean (description, cb) {
  browsers.forEach((Browser) => {
    var driver = new Driver(new Browser())
    it(`[${driver._browser.name}] ${description}`, async function () {
      await cb.call(this, driver)
    })
  })
}

function sleep (ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

(async () => {
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
  console.log('DONE:', browsers)

  /* eslint-disable no-unused-expressions */
  /* globals describe,it,after,run */
  describe('start all tests', async function () {
    this.timeout(2003)

    // Close things up
    after(async function () {
      server.close()
    })

    describe('basic non-element calls', async function () {
      itAllClean('status (no session)', async function (driver) {
        await driver.startWebDriver()
        var status = await driver.status()
        expect(status).to.be.a('object')
        expect(true).to.be.true
        await driver.stopWebDriver()
      })

      itAll('status', async function (driver) {
        var status = await driver.status()
        expect(status).to.be.a('object')
        expect(true).to.be.true
      })

      itAll('timeouts', async function () {
        expect(true).to.be.true
      })
      itAll('navigateTo/getCurrentUrl', async function () {
        expect(true).to.be.true
      })
      itAll('back/forward/refresh', async function () {
        expect(true).to.be.true
      })
      itAll('getTitle', async function () {
        expect(true).to.be.true
      })
      itAll('getWindowHandles/switchToWindow', async function () {
        expect(true).to.be.true
      })
      itAll('switchToFrame/switchToParentFrame', async function () {
        expect(true).to.be.true
      })
      itAll('getWindowRect/setWindowRect', async function () {
        expect(true).to.be.true
      })
      itAll('maximizeWindow/minimizeWindow/fullScreenWindow', async function () {
        expect(true).to.be.true
      })
      itAll('getPageSource', async function () {
        expect(true).to.be.true
      })
      itAll('executeScript/executeAsyncScript', async function () {
        expect(true).to.be.true
      })
      itAll('getAllCookies/getNamedCookie/addCookie/deleteCookie/deleteAllCookies', async function () {
        expect(true).to.be.true
      })
      itAll('dismissAlert/acceptAlert/getAlertText/sendAlertText', async function () {
        expect(true).to.be.true
      })
      itAll('takeScreenshot', async function () {
        expect(true).to.be.true
      })
      itAll('getActiveElement', async function () {
        expect(true).to.be.true
      })
    })

    describe('actions', async function () {
      itAll('mouse actions', async function () {
        expect(true).to.be.true
      })
      itAll('keyboard actions', async function () {
        expect(true).to.be.true
      })
      itAll('mouse and keyboard actions', async function () {
        expect(true).to.be.true
      })
      itAll('dragging', async function () {
        expect(true).to.be.true
      })
    })

    describe('waitFor', async function () {
      itAll('wait for an element', async function () {
        expect(true).to.be.true
      })
      itAll('wait for specific window title', async function () {
        expect(true).to.be.true
      })
    })

    describe('elements', async function () {
      itAll('driver\'s findElement', async function () {
        expect(true).to.be.true
      })

      itAll('driver\'s findElementS', async function () {
        expect(true).to.be.true
      })

      itAll('element\'s isSelected', async function () {
        expect(true).to.be.true
      })
      itAll('element\'s getAttribute', async function () {
        expect(true).to.be.true
      })

      itAll('element\'s getProperty', async function () {
        expect(true).to.be.true
      })
      itAll('element\'s getCssValue', async function () {
        expect(true).to.be.true
      })
      itAll('element\'s getText', async function () {
        expect(true).to.be.true
      })
      itAll('element\'s getTagName', async function () {
        expect(true).to.be.true
      })
      itAll('element\'s getRect', async function () {
        expect(true).to.be.true
      })
      itAll('element\'s isEnabled', async function () {
        expect(true).to.be.true
      })
      itAll('element\'s click', async function () {
        expect(true).to.be.true
      })
      itAll('element\'s clear', async function () {
        expect(true).to.be.true
      })
      itAll('element\'s sendKeys', async function () {
        expect(true).to.be.true
      })
      itAll('element\'s takeScreenshot', async function () {
        expect(true).to.be.true
      })
      itAll('element\'s findElement', async function () {
        expect(true).to.be.true
      })
      itAll('element\'s findElements', async function () {
        expect(true).to.be.true
      })
    })
  })
  run()
})()
