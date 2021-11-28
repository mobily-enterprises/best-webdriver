const Driver = require('./Driver')
/**
 * Browser-specific class, which knows how to run() the executable by overriding
 * the {@link Driver}'s {@link Driver#run} method.
 *
 * This class also  adds a compatibility layer to the w3c Driver to work around Chrome's
 * lack of full w3c support.
 *
 * It inherits from {@link Driver}, but tries to make the unsupported webdriver calls actually work
 */
class ChromeDriver extends Driver {
  constructor (...args) {
    super(...args)

    const config = args[0]
    if (config) config.addFirstMatch({ browserName: 'chrome'})
    
    // Set the default executable
    this.setExecutable(process.platform === 'win32' ? 'chromedriver.exe' : 'chromedriver')

    // Set the browser's name
    this.name = 'chrome'
  }
  /**
   * w3c: Fixes Chrome's setTimeouts implementation, which will require three different
   * calls rather than the one call
   * NOTE: The code has been commented out
   */
  async setTimeouts (p) {
    await this._execute('post', '/timeouts', p)
    
    // if (p.pageLoad) await this._execute('post', '/timeouts', { type: 'pageLoad', ms: p.pageLoad })
    // if (p.implicit) await this._execute('post', '/timeouts', { type: 'implicit', ms: p.implicit })
    // if (p.script) await this._execute('post', '/timeouts', { type: 'script', ms: p.script })
  }

  /**
   * w3c: Fixes Chrome's status object, which otherwise won't include
   * the `ready` and `message` properties, as required
   */
  async status () {
    var res = await super.status()
    res.ready = true
    res.message = ''
    return res
  }
}

exports = module.exports = ChromeDriver
