const { Driver, browser, Actions } = require('best-webdriver') // eslint-disable-line no-unused-vars
const chai = require('chai')
const express = require('express')
const http = require('http')
const path = require('path')

// chai.should()
const expect = chai.expect

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

function sleep (ms) { // eslint-disable-line no-unused-vars
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function getActiveBrowsers (allBrowsers) {
  //
  async function browserThere (Browser) {
    var browser = new Browser()
    var driver = new Driver(browser)
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

  var browsers = []
  for (var i = 0, l = allBrowsers.length; i < l; i++) {
    var Browser = allBrowsers[i]
    if (await browserThere(Browser)) {
      browsers.push(Browser)
    }
  }
  if (!browsers.length) {
    throw new Error('No webdrivers found')
  }
  return browsers
}

(async () => {
  var browsers = await getActiveBrowsers([ browser.Chrome, browser.Firefox, browser.Edge, browser.Safari ])
  var server = await startServer()
  var port = server.address().port
  console.log(`Started local server: http://127.0.0.1:${port}/`)

  browsers.forEach((Browser) => {
    var browser = new Browser()
    var browserName = browser.name

    /* eslint-disable no-unused-expressions */
    /* globals describe,it,before,after,run */
    describe(`[${browserName}] start all tests`, async function () {
      // Close things up
      after(async function () {
        server.close()
      })

      // ***********************************************
      // ************ BASIC NON-ELEMENT CALLS **********
      // ***********************************************

      describe(`[${browserName}] basic non-element calls`, async function () {
        var driver

        // Close things up
        before(async function () {
          driver = new Driver(new Browser())
          await driver.startWebDriver()
        })

        // Close things up
        after(async function () {
          await driver.deleteSession()
          await driver.stopWebDriver()
        })

        it('check the status', async function () {
          var status = await driver.status()
          expect(status).to.be.an('object')
          expect(status).to.have.property('ready')
        })

        it('opens a new session', async function () {
          this.timeout(5000)
          var session = await driver.newSession()
          expect(session).to.be.an('object')
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

      // ***********************************************
      // ************ ACTIONS                 **********
      // ***********************************************

      describe(`[${browserName}] actions`, async function () {
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

      // ***********************************************
      // ************ WAITFOR                 **********
      // ***********************************************

      describe(`[${browserName}] waitFor`, async function () {
        it('wait for an element', async function () {
          expect(true).to.be.true
        })
        it('wait for specific window title', async function () {
          expect(true).to.be.true
        })
      })

      // ***********************************************
      // ************ ELEMENTS                 **********
      // ***********************************************

      describe(`[${browserName}] elements`, async function () {
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
  })
  run()
})()
