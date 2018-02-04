# The best Webdriver API to date
(According to its author. Pinch of salt required.)
## Be productive in less than 20 minutes.

Reading this short document is enough to cover _every_ aspect of the API.

Be sure to check out the [API documentation](https://mercmobily.github.io/best-webdriver/index.html)

Yes, the [best webdriver](https://github.com/mercmobily/best-webdriver) is hosted on github

Yes, it's also [available on NPM](https://www.npmjs.com/package/best-webdriver)

### Intro

* Slim code: **817 lines of code** and **7 active classes**, compared to the selenium-webdriver's **5654 lines of code** and **92 classes**
* 100% [W3C's webdriver](https://w3c.github.io/webdriver/webdriver-spec.html#compatibility) compliant. The code only ever makes pure webdriver calls
* (Having said that) Compatibility layer for specific browsers, in order to fix mistakes and gaps in drivers' implementations
* [Well documented API](https://mercmobily.github.io/best-webdriver/index.html) which comes with a simple quickstart guide
* The API is async/await friendly. Each call returns a promise. Development is a breeze
* Easy to debug. There is a 1:1 mapping between calls and the webdriver protocol, without trickery
* Simple system to define sequences of webdriver UI actions

#### Get your system ready

First of all, install `best-webdriver` using NPM:

    npm install --save best-webdriver

Also, make sure you install at least one webdriver on your computer:

* [Chrome](http://chromedriver.storage.googleapis.com/index.html)
* [IE](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/)
* [Firefox](https://github.com/mozilla/geckodriver/releases/)
* [Safari](https://developer.apple.com/library/content/releasenotes/General/WhatsNewInSafari/Articles/Safari_10_0.html#//apple_ref/doc/uid/TP40014305-CH11-DontLinkElementID_28)

Once you are done, you are pretty much ready to go.

### Create a session on a locally spawn webdriver

To open up a driver, simply run:

    ;(async () => {
      try {
        const { drivers, browsers, Actions } = require('best-webdriver')

        // Create a new driver object, using the Chrome browser
        var driver = new drivers.ChromeDriver(new browsers.Chrome())

        // Create a new session. This will also run `chromewebdriver` for you
        await driver.newSession()

        // ...add more code here
        // This is where code from this guide will live
      } catch (e) {
        console.log('ERROR:', e)
      }
    })()

If everything goes well, you will see a Chrome window appear. Note that that `(async () => {` is there to make sure that you can use `await`.

The role of the Chrome-specific Driver here is:

* To provide a way to execute Chrome's webdriver command
* To provide a software layer around Chrome's own limitations or mistakes in implementing the W3c protocol

_Please note that in this guide it will always be assumed that the code is placed in `// ...add more code here`, and that the async function, require and session creation won't be repeated._

### Understanding session options

Understanding how sessions are created is crucial. This section explains the session object itself (and helper methods), creating a session without spawning a webdriver process, and creating a session with the generic {@link Browser} browser.

#### The basic session object

Most of the time, especially when you are just starting with webdrivers, you tend to use APIs such as this one for one specific browser's webdriver. Most APIs (including this one) will spawn a Chrome webdriver process, for example, when you create a new session using Chrome as the browser:

    var driver = new drivers.ChromeDriver(new browsers.Chrome())

At this point, no process is spawned yet. However, when you run:

    await driver.newSession()

The driver, by default, will use the browser's driver's`run()` method to spawn a `chromedriver` process, and will then connect to it and create a new browsing session.

You can use any one of the chromedrivers available: {@link ChromeDriver}, {@link FirefoxDriver}, {@link SafariDriver}, {@link EdgeDriver}.

When creating a session, the driver will use configuration options provided by the browser. For example if you type:

    var chrome = new browsers.Chrome()
    var params = chrome.getSessionParameters()
    console.log('Session parameters:', require('util').inspect(params, { depth: 10 } ))

This is display the configuration object created by default by the Chrome browser. You will see:

    {
      capabilities: {
        alwaysMatch: {
          chromeOptions: { w3c: true },
          browserName: 'chrome'
        },
       firstMatch: []
      }
    }

It's important that you understand the configuration option:

* It must have a `capabilities` key
* Under `capabilities`, it must have the keys `alwaysMatch` (object) and `firstMatch` (an array)
* It may have more keys in the object's root namespace
* `chromeOptions` (under `alwaysMatch`) represents Chrome-specific options. In this case, `w3c:true` is specified in order to use Chrome with this API (since this API implements webdriver in its pure form, you need Chrome to use the W3c protocol as much as possible).

#### Setting session parameters

You can also set the session options using the setting methods:

    var chrome = new browsers.Chrome()
    chrome.setAlwaysMatchKey('pageLoadStrategy', 'eager')
          .addFirstMatch({ platformName: 'linux' })
          .setRootKey('login', 'merc')
          .setRootKey('password', 'youwish')
          .setSpecificKey('detach', true)

    var params = chrome.getSessionParameters()
    console.log('Session parameters:', require('util').inspect(params, { depth: 10 } ))

You will see:

    {
      // set by setRootKey()
      login: 'merc',
      pass: 'youwish',

      capabilities: {
        alwaysMatch: {

          // Set by the Chrome constructor
          chromeOptions: { w3c: true, detach: true },
          browserName: 'chrome'

          // Set my setAlwaysMatchKey()
          pageLoadStrategy: 'eager'
        },
        firstMatch: [

          // Added by addFirstmatch()
          { platformName: 'linux' }
        ]
      }
    }

Remember that in {@link Browser#setAlwaysMatchKey}, {@link Browser#setRootKey} and {@link Browser#setSpecificKey}, the key can actually be a path: if it has a `.` (e.g. `chrome.setAlwaysMatchKey('timeouts.implicit`), the property `capabilities.alwaysMatch.timeouts.implicit` will be set.

#### Running the API without spawning a webdriver

You might decide to use this API _without_ spawning a process for the chromedriver.
This is especially handy if you are using for example an online service, or a webdriver already running on a different machine.

Here is how you do it notice the `spawn: false` property:

    // Create a new Chrome browser object
    var chrome = new browsers.Chrome()

    // Create the driver, using that browser's
    // configuration WITHOUT spawning a chromedriver process
    var driver = new drivers.ChromeDriver(chrome, {
      spawn: false,
      hostname: '10.10.10.45',
      port: 4444
    })

Note that since you are using the {@link ChromeDriver} driver, the remote end will be assumed to be a Chrome webdriver: it will fix any mistakes and partial implementations of the W3C protocol.

#### The generic "Browser" browser

Lastly (and more commonly), you might want to connect to a generic webdriver proxy, which will accept your session requirement and will provide you with a suitable browser. In this case, you will use the generic browser called {@link Browser}, which is a "blank" browser without any pre-pared browser-specific options.

Here is how you would run it:

    // Create a new generic browser object, specifying the alwaysMatch parameter
    var remote = new browsers.Browser()

    remote.setAlwaysMatchKey('browserName', 'chrome')
          .setAlwaysMatchKey('platformName', 'linux')

    // Creating the driver
    var driver = new drivers.Driver(remote, {
      hostname: '10.10.10.45',
      port: 4444
    })

Note that since you used the generic {@link Browser} browser, the session configuration did _not_ include the browser-specific `{ w3c: true }` value.

Also note that you used the generic {@link Driver}, which means that no browser-specific workarounds for W3C compliance will be applied. If you did want that to happen, you would simply run:

    var driver = new drivers.ChromeDriver(remote, {

### Running amok with driver calls

If you have the following chunk of code:

    // Create a new driver object, using the Chrome browser
    var driver = new drivers.ChromeDriver(new browsers.Chrome())

    // Create a new session. This will also run `chromewebdriver` for you
    await driver.newSession()

You can then run commands using the webdriver.
There are three types of call:

* Calls that will deal with parameters and values on the currently opened page
* Calls that will return objects {@link Driver#findElement} and {@link Driver#findElement}
* Call to run user {@link Actions}

Finally, all calls can be "polled", which implies re-running the command at intervals until it succeeds, or until it fails (after it reaches a timeout).

### Non-element driver calls

Once you've created a driver object, you can use it to actually make webdriver calls.

For example:

    var driver = new drivers.ChromeDriver(new browsers.Chrome())
    await driver.newSession()
    await driver.navigateTo('https://www.google.com')
    var screenshotData = await driver.takeScreenshot()
    var src = await driver.getPageSource()
    var title = await driver.getTitle()
    await driver.refresh()

All of these commands are self-explanatory, and fully documented in the {@link Driver} documentation (basically, all of the listed calls under the {@link Driver} object)

Remember that there is a 1:1 mapping between driver calls and Webdriver calls.

### Returning elements

Some of the driver calls will return an {@link Element} object. For example:

    await driver.navigateTo('https://www.google.com')    
    var el = await driver.findElementsCss('[name=q]')

The returned element will be an instance of {@link Element}, created with the data returned by the `findElementCss()` call.
An element object is simply an object with a reference to the `Driver` that created it, and a unique ID returned by the webdriver call.

{@link Element} objects have several element-related methods. For example, you can get the tag name for a found element:

    await driver.navigateTo('https://www.google.com')    
    var el = await driver.findElementsCss('[name=q]')
    var tagName = await el.getTagName()

More importantly, {@link Element} objects _also_ offer methods that will return elements. In this case, the search will be limited to elements children of the element being searched.
For example:

    await driver.navigateTo('https://www.example.com')    
    // Get the OL tag
    var ol = await driver.findElementsTagName('ol')

    // Get the LI tags within OL
    var lis = await ol.findElementsTagName('li')

### Run Actions

Actions are a rather complex part of the webdriver specs. Actions are important so that you can get the browser to perform a list of timed, complex UI actions.

Actions are always performed by either a keyboard device, or a pointer device (which could be a `MOUSE`, `TOUCH` or `PEN`)

Once the action object is created, you can add "ticks" to it using the
property `tick` (which is actually a getter). The way you use `tick` depends on the devices you created.

If you call the constructor like this:

    var actions = new Actions()

It's the same as writing:

    var actions = new Actions(
      new Keyboard('keyboard'),
      new Pointer('mouse', Pointer.Type.MOUSE)
    )

This will make two devices, `mouse` and `keyboard`, available.

Such a scenario will allow you to call:

    actions.tick.keyboardDown('r').mouseDown()
    actions.tick.keyboardUp('r').mouseUp()

Here, `keyboardUp` was available as a combination of the keyboard ID `keyboard`
and the keyboard action `Up`.

In short:

  * Keyboard devices will have the methods `Up`, `Down`
  * Pointer devices will have the methors `Move`, `Up`, `Down`, `Cancel`
  * Both of them have the method `pause`

If you create an actions object like this:

     var actions = new Actions(new Keyboard('cucumber'))

You are then able to run:

    actions.tick.cucumberDown('r')
    actions.tick.cucumberUp('r')

However running:

    actions.tick.cucumberMove('r')

Will result in an error, since `cucumber` is a keyboard device, and it doesn't
implement `move` (only pointers do)

If you have two devices set (like the default `keyboard` and `mouse`, which
is the most common use-case), you can set one action per tick:

    var actions = new Actions() // By default, mouse and keyboard
    // Only a keyboard action in this tick. Mouse will pause
    actions.tick.keyboardDown('r')
    // Only a mouse action in this tick. Keyboard will pause
    actions.tick.mouseDown()
    // Both a mouse and a keyboard action this tick
    actions.tick.keyboardUp('r').mouseUp()

You can only add one action per device in each tick. This will give an error,
because the `mouse` device is trying to define two different actions in the same
tick:

    actions.tick.mouseDown().mouseUp()

You are able to chain tick calls if you want to:

    actions
    .tick.keyboardDown('r').mouseDown()
    .tick.keyboardUp('r').mouseUp()

Once you have decided your actions, you can submit them:

     await driver.performActions(actions)

You can set multiple touch devices, and use them for multi-touch:

    var actions = new Actions(
      new Pointer('finger1', Pointer.Type.TOUCH),
      new Pointer('finger2', Pointer.Type.TOUCH)
    )
    // Define actions: Moving two fingers vertically at the same time
    actions
    .tick.finger1Move({ x: 40, y: 40 }).finger2Move({ x: 40, y: 60 }
    .tick.finger2Move({ x: 40, y: 440 }).finger2Move({ x: 40, y: 460 }

    // Actually perform the actions
    driver.performActions(actions)

You can also move a pointer over a specific element, specifying how long it will take (in milliseconds):

    await driver.navigateTo('https://www.google.com')    
    var el = await driver.findElementsCss('[name=q]')
    var actions = new Actions(new Pointer('mouse', Pointer.Type.MOUSE))

    // Moving over `el`, taking 1 second
    actions.tick.mouseMove({ origin: el, duration: 1000 })

Keyboard devices can perform:

* {@link Keyboard#Up}
* {@link Keyboard#Down}
* {@link Keyboard#Pause}

Mouse devices can perform:

* {@link Pointer#Up}
* {@link Pointer#Down}
* {@link Pointer#Move}
* {@link Pointer#Cancel}
* {@link Pointer#Pause}

The {@link Actions} class documentation explains exactly how actions work.

### Polling

When writing tests for web sites and applications, timing can become an issue. For example while you know that your page will be load after this:

    await driver.navigateTo('https://www.google.com')

What you don't know is this: have _all_ of the AJAX finished fetching data? Has _all_ of the DOM been updated after the event?

The answer is "you don't know". So, the ability to poll is very important.

This API has the simplest, most streamlined approach possible i nterms of polling: there is only one call, `waitFor()`, which is available in {@link Element#waitFor} and {@Driver#waitFor} objects.

The way it works is really simple: `waitFor()` actually acts as a proxy to the real object calls, wit hthe twist that it will retry them until they work out. Each call will also accept one extra parameter (compared to their signature), which is a function that will also return a truly value for the call to be successful.

So, while you would normally do:

    var el = driver.findElementCss('#main')

If you wanted to wait, you would run the following call, which will run `findElementsCss()` every 300ms, until it's finally worked or until the default timeout of 10000ms (10 seconds) has expired:

    var el = await driver.waitFor().findElementCss('#main')

You can set different poll interval and timeout:

    driver.setPollTimeout(15000)
    driver.setPollInterval(200)

Or, you can set them on a per-call basis:

    driver.waitFor(15000, 300).findElementCss('#main')

Finally, you can add one extra parameter to the call: it will be

    driver.waitFor().findElementsCss('li', (r) => r.length))

In this case, the callback `(r) => r.length` will only return truly when `r` (the result from the call) is a non-empty array.

Behind the scenes, `waitFor()` returns a proxy object which will in turn run the call and check that it didn't return an error; it also checks that the result passes the required checker function, if one was passed.

The result of this is that one simple chained method, {@link Driver#waitFor}/{@link Element#waitFor}, turns every call for {@link Driver} and {@link Element} into a polling function able to check the result.

### Limitations

The main limitation of this API is that _it will only ever speak in w3c webdriver protocol_. For example, as of today Chrome doesn't yet implement {@link Actions}. While other APIs try to "emulate" actions (with crippling limitatins) by calling non-standard endpoints, this SPI will simply submit the actions to the chrome webdriver and surely receive an error in response.

Another limitation is that it's an API that is very close to the metal: you are supposed to understand how the session configuration works, for example; so, while you do have helper methods such as `setAlwaysMatchKey()`, `addFirstMatch()` etc., you are still expected to _understand_ what these calls do. Also, browser-specific parameters are added via `setSpecificKey()`; however, there are no helpers methods to get these parameters right. For example, if you want to add plugins to Chrome using the `extensions` option, you will need to create an array of packed extensions loaded from the disk and converted to base64. This _may_ change in the future, as this API matures; however, it won't add more classes and any enhancement will always be close enough to the API to be easy to understand.

### Go test!

That's all you need -- time to get testing!
