# The best Webdriver API to date
(According to its author. Pinch of salt required.)
## Be productive in less than 20 minutes.

Be sure to check out the [API documentation](https://mercmobily.github.io/best-webdriver/index.html)

### Intro

* Slim code: **817 lines of code** and **7 active classes**, compared to the selenium-webdriver's **5654 lines of code** and **92 classes**
* 100% [W3C's webdriver](https://w3c.github.io/webdriver/webdriver-spec.html#compatibility) compliant. The code only ever makes pure webdriver calls
* [Well documented API](https://mercmobily.github.io/best-webdriver/index.html) which comes with a simple quickstart guide
* The API is async/await friendly. Each call returns a promise. Developing is a breeze
* Easy to debug. There is a 1:1 mapping between calls and the webdriver protocol, without trickery
* Simple system to define sequences of actions

#### Get your system ready

First of all, install `best-webdriver` using NPM:

    npm install --save best-webdriver

Also, make sure you install at least one webdriver on your computer:

* [Chrome](http://chromedriver.storage.googleapis.com/index.html)
* [IE](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/)
* [Firefox](https://github.com/mozilla/geckodriver/releases/)
* [Safari](https://developer.apple.com/library/content/releasenotes/General/WhatsNewInSafari/Articles/Safari_10_0.html#//apple_ref/doc/uid/TP40014305-CH11-DontLinkElementID_28)

NOTE: at this stage, this library will only work with Chrome and Firefox. Safari and IE support is coming soon.

Once you are done, you are pretty much ready to go.

### Create a session on a locally spawn webdriver

To open up a driver, simply run:

    ;(async () => {
      try {
        const { Driver, browser, Actions } = require('best-webdriver')

        // Create a new driver object, using the Chrome browser
        var driver = new Driver(new browser.Chrome())

        // Create a new session. This will also run `chromewebdriver` for you
        await driver.newSession()

        // ...add more code here
        // This is where code from this guide will live
      } catch (e) {
        console.log('ERROR:', e)
      }
    })()

If everything goes well, you will see a Chrome window appear. Note that that `(async () => {` is there to make sure that you can use `await`.

_Please note that in this guide it will always be assumed that the code is placed in `// ...add more code here`, and that the async function, require and session creation won't be repeated._

### Session options

Most of the time, especially when you are just starting with webdrivers, you tend to use APIs such as this one for one specific browser's webdriver. Most APIs (including this one) will spawn a Chrome webdriver process, for example, when you create a new session using Chrome as the browser:

    var driver = new Driver(new browser.Chrome())

At this point, no process is spawned yet. However, when you run:

    await driver.newSession()

The driver, by default, will use the browser's `run()` method (in this case Chrome) to spawn a `chromedriver` process, and will then connect to it and create a new browsing session.

When creating a session, the driver accepts configuration options provided by the browser. For example if you type:

    var chrome = new browser.Chrome()
    var params = chrome.getSessionParameters()
    console.log('Session parameters:', require('util').inspect(params, { depth: 10 } ))

You will see:

    {
      capabilities: {
        alwaysMatch: {
          chromeOptions: { w3c: true },
          browserName: 'chrome'
        },
       firstMatch: []
      }
    }

This is the configuration object created by default by the Chrome browser. Note that `chromeOptions` under `alwaysMatch`: they are Chrome-specific options. In this case, `w3c:true` is specified in order to use Chrome with this API (since this API implements webdriver in its pure form, you need Chrome to use the W3c protocol as much as possible).

The {@link Browser}'s constructor call accepts four parameters: `alwaysMatch`, `firstMatch`, `root`, `specific` which will define the corresponding values in the session parameter (keep in mind that `root` keys wil be copied onto the object's root).  
So, you could run:

    var chrome = new browser.Chrome(
      // alwaysMatch
      {
        pageLoadStrategy: 'eager'  
      },

      // firstMatch
      {
        platformName: 'linux'
      },

      // Object's root
      {
        login: 'merc',
        password: 'youwish'
      },

      {
        detach: true  
      }
    )
    var params = chrome.getSessionParameters()
    console.log('Session parameters:', require('util').inspect(params, { depth: 10 } ))

You will see:

    {
      login: 'merc',
      pass: 'youwish',
      capabilities: {
        alwaysMatch: {
          chromeOptions: { w3c: true, detach: true },
          pageLoadStrategy: 'eager'
        },
        firstMatch: [
          {
            platformName: 'linux'
          }
        ]
      }
    }

Notice that:

* the `pageLoadStrategy` property was added under `alwaysMatch`
* the object `{platformName: 'linux'}` was placed as an element of the `firstMatch` array
* the root options `{login: 'merc', password: 'youwish'}` ended up in the object's top level keys
* `{ detach: true }` ended up under `chromeOptions`
* The default `{ w3c: true }` option is there

You can set up options after creating the browser object. For example, you can set browser-specific options by passing parameters to `specific`, or setting browser-specific options by calling {@link Browser#setSpecificKey}:

    // Straight session parameters out of the box
    var chrome = new browser.Chrome()

    // Adding chrome-specific settings to the session parameter
    chrome.setSpecificKey('detach', true)

    // Show the session parameters
    var params = chrome.getSessionParameters()
    console.log('Session parameters:', require('util').inspect(params, { depth: 10 } ))

Will result in:

    {
      capabilities: {
        alwaysMatch: {
          chromeOptions: { w3c: true, detach: true },
          browserName: 'chrome'
        },
       firstMatch: []
      }
    }

Remember that in {@link Browser#setSpecificKey}, the key can actually be a path; if path is has a . (e.g. `something.other`), the property `sessionParameters.something.other` will be set.

You might decide to use this API _without_ spawning a process for the chromedriver.
This is especially handy if you are using for example an online service, or a webdriver already running on a different machine.

Here is how you do it:

    // Create a new Chrome browser object
    var chrome = new browser.Chrome()

    // Create the driver, using that browser's
    // configuration WITHOUT spawning a chromedriver process
    var driver = new Driver(chrome, {
      spawn: false,
      host: '10.10.10.45',
      port: 4444
    })

Lastly (and more commonly), you might want to connect to a generic webdriver proxy, which will accept your session requirement and will provide you with a suitable browser. In this case, you will use the generic browser called {@link Remote}, which is a "blank" browser without the ability to spawn a specific webdriver, and without and specific options.

Here is how you would run it:

    // Create a new generic browser object, specifying the alwaysMatch parameter
    var remote = new browser.Remote({
      browserName: 'chrome',
      platformName: 'linux'
    })

    // Creating the driver
    var driver = new Driver(remote, {
      host: '10.10.10.45',
      port: 4444
    })

You could also do:

    // Create a new generic browser object, specifying the alwaysMatch parameter
    var remote = new browser.Remote()
    browser.setAlwaysMatchKey('browserName', 'chrome')
    browser.setAlwaysMatchKey('platformName', 'linux')

    // Creating the driver
    var driver = new Driver(chrome, {
      host: '10.10.10.45',
      port: 4444
    })


### Running amok with driver calls

All calls that do not require elements

### Returning elements

Explain how elements are returned

### Polling

waitfor

### Run Actions

new Actions()... mouse, keyboard, etc. Copy&paste from API.

### Pitfalls

Not every browser implements everything. Check the status. Nag.

### Go test!

That's all you need -- time to get testing!


**TODO. Documentation will be finished in the first week of February 2018**
