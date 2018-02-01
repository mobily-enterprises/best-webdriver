# The best Webdriver API to date
(According to its author. Pinch of salt required.)
## Be productive in less than 20 minutes.

Be sure to check out the [API documentation](https://mercmobily.github.io/best-webdriver/index.html)

Yes, the [best webdriver](https://github.com/mercmobily/best-webdriver) is hosted on github

Yes, it's also [available on NPM](https://www.npmjs.com/package/best-webdriver)

### Intro

* Slim code: **817 lines of code** and **7 active classes**, compared to the selenium-webdriver's **5654 lines of code** and **92 classes**
* 100% [W3C's webdriver](https://w3c.github.io/webdriver/webdriver-spec.html#compatibility) compliant. The code only ever makes pure webdriver calls
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

### Understanding session options

Understanding how sessions are created is crucial. This section explains the session object itself (and helper methods), creating a session without spawning a webdriver process, and creating a session with the generic Remote browser.

#### The basic session object

Most of the time, especially when you are just starting with webdrivers, you tend to use APIs such as this one for one specific browser's webdriver. Most APIs (including this one) will spawn a Chrome webdriver process, for example, when you create a new session using Chrome as the browser:

    var driver = new Driver(new browser.Chrome())

At this point, no process is spawned yet. However, when you run:

    await driver.newSession()

The driver, by default, will use the browser's `run()` method to spawn a `chromedriver` process, and will then connect to it and create a new browsing session.

When creating a session, the driver will use configuration options provided by the browser. For example if you type:

    var chrome = new browser.Chrome()
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

    var chrome = new browser.Chrome()
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

#### The generic "Remote" browser

Lastly (and more commonly), you might want to connect to a generic webdriver proxy, which will accept your session requirement and will provide you with a suitable browser. In this case, you will use the generic browser called {@link Remote}, which is a "blank" browser without the ability to spawn a specific webdriver, and without and specific options.

Here is how you would run it:

    // Create a new generic browser object, specifying the alwaysMatch parameter
    var remote = new browser.Remote()

    remote.setAlwaysMatchKey('browserName', 'chrome')
          .setAlwaysMatchKey('platformName', 'linux')

    // Creating the driver
    var driver = new Driver(remote, {
      host: '10.10.10.45',
      port: 4444
    })

Note that since you used the generic {@link Remote} browser, the session configuration did _not_ include the browser-specific `{ w3c: true }` value.

### Running amok with driver calls

If you have the following chunk of code:

    // Create a new driver object, using the Chrome browser
    var driver = new Driver(new browser.Chrome())

    // Create a new session. This will also run `chromewebdriver` for you
    await driver.newSession()

You can then run commands using the webdriver.
There are three types of call:

* Calls that will deal with parameters and values on the currently opened page
* Calls that will return objects {@link Driver#findElement} and {@link Driver#findElement}
* Call to run user {@link Actions}

Finally, all calls can be "polled", which implies re-running the command at intervals until it succeeds, or until it fails (after it reaches a timeout).

### Non-element driver calls

TODO: Show how some basic non-element commands work

### Returning elements

TODO: Explain how elements are returned, what to do with them

### Run Actions

TODO: explain new Actions()... mouse, keyboard, etc. with some copy&paste from API.

### Polling

TODO: explain waitfor

### Limitations

The main limitation of this API is that _it will only ever speak in w3c webdriver protocol_. For example, as of today Chrome doesn't yet implement {@link Actions}. While other APIs try to "emulate" actions (with crippling limitatins) by calling non-standard endpoints, this SPI will simply submit the actions to the chrome webdriver and surely receive an error in response.

Another limitation is that it's an API that is very close to the metal: you are supposed to understand how the session configuration works, for example; so, while you do have helper methods such as `setAlwaysMatchKey()`, `addFirstMatch()` etc., you are still expected to _understand_ what these calls do. Also, browser-specific parameters are added via `setSpecificKey()`; however, there are no helpers methods to get these parameters right. For example, if you want to add plugins to Chrome using the `extensions` option, you will need to create an array of packed extensions loaded from the disk and converted to base64. This _may_ change in the future, as this API matures; however, it won't add more classes and any enhancement will always be close enough to the API to be easy to understand.

### Go test!

That's all you need -- time to get testing!
