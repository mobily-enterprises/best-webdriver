async wait (fn, timeout = 0) {
  consolelog('Waiting...')
  var res
  var i = 0
  var errors = []

  // Set the expiration for this test
  if (!timeout) timeout = this._defaultPollTimeout
  var endTime = new Date(Date.now() + timeout)

  // It will continue until `break` is called -- which will happen once
  // time has expired
  while (true) {
    consolelog('Attempt ', i++)
    try {
      consolelog('Running checking function:', fn.toString())
      res = await fn()
      consolelog('Result:', res)
      if (res) return true
    } catch (e) {
      consolelog('ERROR. Adding the error to the list of errors')
      errors.push(e)
    }
    if (new Date() > endTime) break
    consolelog('Sleeping...')
    await this.sleep(this._pollInterval)
  }
  var error = new Error("Condition wasn't satisfied")
  error.errors = errors
  throw error
}
old
