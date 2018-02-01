const { spawn } = require('child_process')
const consolelog = require('debug')('webdriver:utils')

function isObject (p) { return typeof p === 'object' && p !== null && !Array.isArray(p) }

function checkRes (res) {
  if (!isObject(res)) throw new Error('Unexpected non-object received from webdriver')
  if (typeof res.value === 'undefined') throw new Error('Missing `value` from object returned by webdriver')
  return res
}

/* Options: args[], stdio{}, env{}, */
function exec (command, commandOptions) {
  var options = commandOptions || {}

  return new Promise((resolve, reject) => {
    //
    // It's unclear whether the try/catch here is necessary,
    // but better safe than sorry
    try {
      var child = spawn(command, options.args || [], {
        env: options.env || process.env,
        stdio: options.stdio || 'ignore'
      })
    } catch (e) {
      reject(e)
    }

    child.on('error', (err) => {
      // The error event will be emitted immediately if ENOENT is
      // the cause of the problems
      if (err.code === 'ENOENT') {
        consolelog(`Could not run ${command}:`, 'aaa', err.code, 'ppp', err)
        reject(err)

      // This will only even happen if "The process could not be killed",
      // or "Sending a message to the child process failed."
      } else {
        consolelog('RETHROWING:', err)
        throw (err)
      }
    })

    // A new process was started: bingo!
    // This actually tells us to resolve this successfully
    if (child.pid) {
      //
      // Unref the child
      child.unref()

      // This process should not wait on the spawned child, however, we do
      // want to ensure the child is killed when this process exits.
      process.once('exit', killChild)

      child.once('exit', (code, signal) => {
        consolelog(`Process ${command} has exited! Code and signal:`, code, signal)
        child = null
        process.removeListener('exit', killChild)
      })

      return resolve({ killCommand })
    }

    function killCommand (signal) {
      process.removeListener('exit', killChild)
      if (child) {
        consolelog(`Sending ${signal} to ${command}`)
        child.kill(signal)
        child = null
      }
    }

    function killChild () {
      consolelog(`Process closed, killing ${command}`, killCommand)
      killCommand('SIGTERM')
    }
  })
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

exports = module.exports = { isObject, checkRes, exec, sleep }
