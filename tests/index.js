const { drivers, browsers, Actions } = require('best-webdriver') // eslint-disable-line no-unused-vars
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
    var driver = new Browser.Driver(browser)
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
  var allBrowsers = await getActiveBrowsers([ browsers.Chrome, browsers.Firefox, browsers.Edge, browsers.Safari ])
  // var allBrowsers = await getActiveBrowsers([ browsers.Firefox ])

  allBrowsers.forEach((Browser) => {
    var browser = new Browser()
    var browserName = browser.name

    /* eslint-disable no-unused-expressions */
    /* globals describe,it,before,after,run */
    describe(`[${browserName}] start all tests`, async function () {
      var server
      var port
      var url
      var driver

      before(async function () {
        server = await startServer()
        port = server.address().port
        url = `http://127.0.0.1:${port}/`

        driver = new Browser.Driver(new Browser())
        await driver.startWebDriver()
      })

      // Close things up
      after(async function () {
        await server.close()

        await driver.deleteSession()
        await driver.stopWebDriver()
      })

      // ***********************************************
      // ************ BASIC NON-ELEMENT CALLS **********
      // ***********************************************

      describe(`[${browserName}] basic non-element calls`, async function () {
        it('checks the status', async function () {
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
          var timeouts = await driver.getTimeouts()
          expect(timeouts).to.have.all.keys('script', 'pageLoad', 'implicit')
          await driver.setTimeouts({ implicit: 30001, pageLoad: 30002, script: 30003 })
          var newTimeouts = await driver.getTimeouts()
          expect(newTimeouts).to.have.property('implicit', 30001)
          expect(newTimeouts).to.have.property('pageLoad', 30002)
          expect(newTimeouts).to.have.property('script', 30003)
        })
        it('navigateTo/getCurrentUrl', async function () {
          await driver.navigateTo(url)
          var currentUrl = await driver.getCurrentUrl()
          expect(currentUrl).to.equal(url)
        })
        it('back/forward/refresh', async function () {
          var currentUrl
          await driver.refresh(url)
          await driver.navigateTo(url + 'index.html')
          currentUrl = await driver.getCurrentUrl()
          expect(currentUrl).to.equal(url + 'index.html')
          await driver.back()
          currentUrl = await driver.getCurrentUrl()
          expect(currentUrl).to.equal(url)
          await driver.forward()
          currentUrl = await driver.getCurrentUrl()
          expect(currentUrl).to.equal(url + 'index.html')
        })
        it('getTitle', async function () {
          var title = await driver.getTitle()
          expect(title).to.equal('The best-webdriver testing page')
        })
        it('getWindowHandle/getWindowHandles/closeWindow/switchToWindow', async function () {
          this.timeout(10000)
          var win1 = await driver.getWindowHandle()
          await driver.executeScript('window.open()')
          var handles = await driver.getWindowHandles()
          var win2 = handles[0] === win1 ? handles[1] : handles[0]
          expect(handles).to.be.an('array')
          expect(handles).to.have.lengthOf(2)
          expect(handles).to.include(win1)
          expect(handles).to.include(win2)
          await driver.switchToWindow(win2)
          await driver.closeWindow()
          await driver.switchToWindow(win1)
          var handlesAfterwards = await driver.getWindowHandles()
          expect(handlesAfterwards).to.have.lengthOf(1)
        })
        it('switchToFrame/switchToParentFrame', async function () {
          var frame = await driver.findElementCss('#frame')
          await driver.switchToFrame(frame)
          var el = await driver.findElementTagName('h1')
          expect(el).to.be.an('object')
        })
        it('getWindowRect/setWindowRect', async function () {
          var rect = await driver.getWindowRect()
          console.log('RECT:', rect)
          expect(rect).to.be.an('object')
          expect(rect).to.have.all.keys('height', 'width', 'x', 'y')
          var newRect1 = await driver.setWindowRect({ x: 100, y: 100 })
          expect(newRect1).to.be.an('object')
          var newRect2 = await driver.setWindowRect({ width: 800, height: 600 })
          expect(newRect2).to.be.an('object')
          var newRect3 = await driver.setWindowRect({ x: 50, y: 50, width: 800, height: 600 })
          expect(newRect3).to.be.an('object')
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
          this.timeout(10000)
          // var actions = new Actions()
          // actions.tick.mouseMove({ x: 0, y: 0 })
          // actions.tick.mouseDown()
          // actions.tick.mouseMove({ x: 300, y: 200, duration: 4000 })
          // actions.tick.mouseUp()

          /*
          var actions = new Actions()
          actions.tick.mouseMove({x :0, y: 0})
          .tick.mouseDown()
          .tick.mouseMove({x:100, y: 300, duration: 500})
          .tick.keyboardDown('a')
          actions.tick.keyboardPause(10)
          actions.tick.keyboardUp('a')
          actions.compile()
          console.log('COMPILED ACTIONS:', require('util').inspect(actions.compiledActions, {depth: 10}))

          await driver.performActions(actions)
          */
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
})().catch((e) => { console.log('ERROR:', e, e.stack) })
