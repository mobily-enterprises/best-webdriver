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
Please note that in this guide it will always be assumed that the code is placed in `// ...add more code here`, and that the async function, require and session creation won't be repeated.

### Sessions without spawning a process

* What the new session object looks like
TODO. Documentation will be finished in the first week of February 2018

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
