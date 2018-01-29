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

  var proc = spawn(command, options.args || [], {
    env: options.env || process.env,
    stdio: options.stdio || 'ignore'
  })

  proc.on('error', (err) => {
    consolelog(`Could not run ${command}:`, err)
    throw new Error(`Error running the webdriver '${command}'`)
  })

  // This process should not wait on the spawned child, however, we do
  // want to ensure the child is killed when this process exits.
  proc.unref()
  process.once('exit', onProcessExit)

  let result = new Promise(resolve => {
    proc.once('exit', (code, signal) => {
      consolelog(`Process ${command} has exited! Code and signal:`, code, signal)
      proc = null
      process.removeListener('exit', onProcessExit)
      resolve({ code, signal })
    })
  })
  return { result, killCommand }

  function onProcessExit () {
    consolelog(`Process closed, killing ${command}`, killCommand)
    killCommand('SIGTERM')
  }

  function killCommand (signal) {
    consolelog(`killCommand() called! sending ${signal} to ${command}`)
    process.removeListener('exit', onProcessExit)
    if (proc) {
      consolelog(`Sending ${signal} to ${command}`)
      proc.kill(signal)
      proc = null
    }
  }
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

exports = module.exports = { isObject, checkRes, exec, sleep }
