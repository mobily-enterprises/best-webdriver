;(async () => {
  try {
    const { drivers, browsers, Actions } = require('best-webdriver')

    // Create a new generic browser object, specifying the alwaysMatch parameter
    var remote = new browsers.Browser()

    remote.setAlwaysMatchKey('browserName', 'chrome')
          .setAlwaysMatchKey('platformName', 'linux')

    // Creating the driver
    var driver = new drivers.Driver(remote, {
      host: '10.10.10.45',
      port: 4444
    })

  } catch (e) {
    console.log('ERROR:', e)
  }
})()
