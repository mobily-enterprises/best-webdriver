const { Driver, browser, Actions } = require('./index')

;(async () => {
  try {
  /*
    // var actions = new Actions(new Pointer('mouse'), new Keyboard('keyboard'))
    var actions = new Actions(new Keyboard('keyboard'))

    console.log('BEFORE:', actions, '\n\nAND:', actions.actions, '\n\n')
    actions.tick.keyboardUp('r')
    actions.tick.keyboardDown('r').tick.keyboardDown('R')
    actions.tick.keyboardDown('p').compile()
    actions.tick.keyboardUp('p')
    actions.compile()
*/

/*
    var driver = new Driver(new Firefox(), { port: 1000, spawn: false })
    await driver.connect() <--- also runs 'driver.newSession()'

    connect will:
      - Look for a free port. Make 'port' a default settable option
      - Run the browser on that port
      - Make the connection on that port
      - Create a session with driver.newSession()
*/
    //
    // var firefox = new Firefox()
    // var chrome = new Chrome()
    // var driver = new Driver('127.0.0.1', 4444) // 4444 or 9515
    // var driver = new Driver(firefox) // 4444 or 9515

    // await driver.newSession(firefox)

    // console.log('SESSION: ', await driver.newSession({}))

    // await driver.navigateTo({ url: 'http://www.google.com' })

    // var el = await driver.findElements({ using: Driver.Using.CSS, value: '[name=q]' })
    // console.log('ELEMENTS:', el)

    // console.log('TRY:', await el[0].sendKeys({ text: 'thisworksonfirefox', value: ['c', 'h', 'r', 'o', 'm', 'e'] }))
    // console.log('TRY:', await el[0].sendKeys({ text: 'thisworksonfirefoxandchrome' + Element.KEY.ENTER }))

    var driverChrome = new Driver(new browser.Chrome(), { spawn: true })
    console.log('DriverChrome:', driverChrome)

    var driver = new Driver(new browser.Firefox(), { spawn: true })
    await driver.newSession()

    console.log('Loading Google:', await driver.waitFor(6000, 100).navigateTo('https://www.google.com'))

    await driver.sleep(2000)
    await driver.navigateTo('https://gigsnet.com')

    var el = await driver.findElementCss('body')
    console.log('BODY ELEMENT:', el)

    console.log('GIGSNET', await el.waitFor(10000, 150).findElementsCss('paper-card.my-book-city', (r) => r.length))

    await driver.sleep(3000)

    await driver.navigateTo('http://usejsdoc.org')
    var article = await driver.findElementCss('article')
    console.log('Article:', article)

    console.log('TIMEOUTS:', await driver.getTimeouts())
    // console.log('SETTIMEOUTS:', await driver.setTimeouts({ implicit: 0, pageLoad: 300000, script: 30000 }))
    console.log('TIMEOUTS AGAIN:', await driver.getTimeouts())

    var dts = await article.findElementsCss('dt')
    var dt0Text = await dts[0].getText()
    console.log('TEXT', dt0Text)

    var actions = new Actions(new Actions.Pointer('mouse'), new Actions.Keyboard('keyboard'))
    // var actions = new Actions()
    console.log('BEFORE:', actions, '\n\nAND:', actions.actions, '\n\n')
    actions.tick.mouseDown().keyboardDown('R')
    actions.tick.mouseMove({ origin: dts[3], x: 10, y: 20, duration: 1000 })
    actions.tick.mouseDown().keyboardUp('r')
    actions.tick.mouseUp().tick.keyboardDown('p')
    actions.tick.keyboardUp('p')
    actions.compile()

    await driver.performActions(actions)

    /*
    console.log('Maximize:')
    await driver.maximizeWindow()
    console.log('(done)')
    await driver.sleep(2000)

    console.log('Minimize:')
    await driver.minimizeWindow()
    console.log('(done)')
    await driver.sleep(2000)

    console.log('Maximize again:')
    await driver.maximizeWindow()
    console.log('(done)')
    await driver.sleep(2000)

    console.log('Full screen:')
    await driver.fullScreenWindow()
    console.log('(done)')
    await driver.sleep(2000)
    */

    console.log('Selected:', await dts[0].isSelected())
    console.log('Enabled:', await dts[0].isEnabled())

    var h2 = await driver.findElementCss('h2#block-tags')
    console.log('SEE ATTR:', await h2.getAttribute('id'))
    // console.log('SEE PROP:', await h2.getProperty('id'))
    console.log('SEE CSS VAL:', await h2.getCssValue('height'))
    console.log('SEE TAG NAME VAL:', await h2.getTagName())
    // console.log('SEE RECT:', await h2.getRect())

    console.log('SEE CLICK:', await h2.click())
    // console.log('SEE CLEAR:', await h2.clear())
    // console.log('SEE SCREENSHOT:', await h2.takeScreenshot())

    await driver.waitFor(6000).navigateTo('http://www.google.com')
    console.log('PAGE SOURCE:', await driver.getPageSource())
    // var q = await driver.findElementCss('[name=q]')
    // await q.sendKeys('stocazzo' + Element.KEY.ENTER)
    // console.log('WTF', q, q.id, q.ELEMENT)

    // console.log('EXECUTE 0 PRETEND:')
    // await driver.sleep(5000)

    /*
    console.log('EXECUTE 0:', await driver.executeScript('prompt('pippo');return 'Hello ' + arguments[0];', ['tony']))
    await driver.sleep(2000)
    console.log('Alert text:', await driver.getAlertText())
    await driver.sendAlertText('aaaaa')
    // await driver.dismissAlert()
    await driver.sleep(2000)
    */

    var el2 = await driver.getActiveElement()
    console.log('Active Element:', el2)
    var elsc = await el2.takeScreenshot(true)
    console.log('Active Element screenshot:', elsc)

    var sc = await driver.takeScreenshot()
    console.log('Screenshot:', sc)

    var fs = require('fs')
    fs.writeFileSync('/tmp/elsc.png', elsc)
    fs.writeFileSync('/tmp/sc.png', sc)

    console.log('EXECUTE 1:', await driver.executeAsyncScript("var name = arguments[0];var cb = arguments[1];cb('Hello ' + name);", ['tony']))

    console.log('Cookies', await driver.getAllCookies())
    console.log('Cookie named', await driver.getNamedCookie('NID'))

    console.log('Deleting cookie named', await driver.deleteCookie('NID'))
    console.log('ALL Cookies again', await driver.getAllCookies())
    console.log('Deleting ALL cookies', await driver.deleteAllCookies())
    console.log('ALL Cookies again 2', await driver.getAllCookies())

    console.log('Set cookie', await driver.addCookie({
      name: 'test',
      value: 'a test',
      path: '/',
      domain: 'google.com.au',
      expiry: 1732569047,
      secure: true,
      httpOnly: true
    }))

    console.log('Cookie named test', await driver.getNamedCookie('test'))

    // console.log('EXECUTE 1:', await driver.executeAsyncScript("var a = arguments; var name = a[0]; var cb = a[1]; alert('Hello ' + name); setTimeout( () => { cb('ahah!') }, 2000);", ['tony']))
    // console.log('EXECUTE:', await driver.executeScript("alert('Stocazzo! '+ arguments[0])", ['a', 'b', 'c']))
    console.log('Window handleS:', await driver.getWindowHandles())

    // console.log('Switch to frame:', await driver.switchToFrame(q))
    console.log('Switch to parent frame:', await driver.switchToParentFrame())

    console.log('STATUS:', await driver.status())

    console.log('TITLE:', await driver.getTitle())

    console.log('RECT:', await driver.getWindowRect())
    console.log('SET RECT:', await driver.setWindowRect({x: 10, y: 10, width: 800, height: 800}))

    console.log('CURRNET URL:', await driver.getCurrentUrl())
    console.log('BACK:')
    await driver.back()
    console.log('CURRNET URL:', await driver.getCurrentUrl())
    console.log('BACK:')
    await driver.forward()
    console.log('CURRNET URL:', await driver.getCurrentUrl())
    console.log('Refreshing...')
    await driver.refresh()
    console.log('Window handle:', await driver.getWindowHandle())
    var wn = await driver.getWindowHandle()
    console.log('Switch to window:')
    await driver.switchToWindow(wn)

    console.log('Maximize:')
    await driver.maximizeWindow()
    await driver.sleep(1000)

    console.log('Minimize:')
    await driver.minimizeWindow()
    await driver.sleep(1000)

    console.log('Maximize again:')
    await driver.maximizeWindow()
    await driver.sleep(1000)

    console.log('Full screen:')
    await driver.fullScreenWindow()
    await driver.sleep(1000)

    // await driver.closeWindow()

    await driver.sleep(5000)

    // console.log('TIMEOUTS:', await driver.getTimeouts())

    // console.log('And:', await driver.getCurrentUrl())

    // console.log('EXECUTE:', await driver.closeWindow())
    await driver.deleteSession()
  } catch (e) {
    console.log('ERROR:', e)
  }
})()
