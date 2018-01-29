const Pointer = require('./Pointer')
const Keyboard = require('./Keyboard')
const KEY = require('../KEY')

console.log('CAZ:', Pointer, Keyboard)

class Actions {
  constructor (...devices) {
    var self = this
    this.actions = []

    this._compiled = false
    this.compiledActions = []
    // Assign `devices`. If not there, assign a default 'mouse' and 'keyboard'
    if (Object.keys(devices).length) {
      this.devices = devices
    } else {
      this.devices = [
        new Pointer('mouse', Pointer.Type.MOUSE),
        new Keyboard('keyboard')
      ]
    }

    // Make up a _tickSetters object, which are the setters available
    // after `driver.tick`, so that you can do `driver.tick.mouseDown()`
    // The keys `tick` and `compile` are always available, as it's handy to
    // get them as "chained" methods (so that you can do
    // `actions.tick.mouseDown().tick.mouseUp()`
    // The other keys will depend on the devices passed to the
    // `Actions` constructor.
    // With `Actions(new Pointer('fancyMouse'))` will establish
    // `tick.fancyMouseUp()`, `tick.fancyMouseDown()` etc.
    // By default, `new Actions()` will create two devices, called
    // `mouse` and `keyboard`
    //
    this._tickSetters = {
      get tick () {
        // Return self
        return self.tick
      },
      compile: self.compile.bind(self)
    }
    this.devices.forEach((device) => {
      var deviceTickMethods = device._tickMethods()
      Object.keys(deviceTickMethods).forEach((k) => {
        this._tickSetters[device.id + k] = function (...args) {
          if (!self._currentAction[device.id].virgin) {
            throw new Error(`Action for device ${device.id} already defined (${device.id + k}) for this tick`)
          }
          var res = deviceTickMethods[k].apply(device, args)
          self._currentAction[device.id] = res
          return self._tickSetters
        }
        this._tickSetters['pause'] = function (duration = 0) {
          self._currentAction[device.id] = { type: 'pause', duration }
          return self._tickSetters
        }
      })
    })
  }

  /** Constant returning special KEY characters (enter, etc.)
   *  Constant are from the global variable {@link KEY}
   *
   * @example
   * var actions = new Actions()
   * actions.tick.keyboardDown(Actions.KEY.ENTER).keyboardUp(Actions.KEY.ENTER)
   */
  static get KEY () { return KEY }

  static get Keyboard () {
    return Keyboard
  }

  static get Pointer () {
    return Pointer
  }

  compile () {
    if (this._compiled) return
    this.compiledActions = []

    this.devices.forEach((device) => {
      var deviceActions = { actions: [] }
      deviceActions.type = device.type
      deviceActions.id = device.id
      if (device.type === 'pointer') {
        deviceActions.parameters = { pointerType: device.pointerType }
      }

      this.actions.forEach((action) => {
        deviceActions.actions.push(action[ device.id ])
      })
      this.compiledActions.push(deviceActions)
    })

    // console.log('COMPILED ACTIONS:', require('util').inspect(this.compiledActions, {depth: 10}))
  }

  _setAction (deviceId, action) {
    this._currentAction[ deviceId ] = action
  }

  get tick () {
    // The tick you add a tick, this is no longer compiled
    this._compiled = false

    // Make up the action object. It will be an object where
    // each key is a device ID.
    // By default, ALL actions are set as 'pause'
    var action = {}
    this.devices.forEach((device) => {
      action[ device.id ] = { type: 'pause', duration: 0, virgin: true }
    })
    this.actions.push(action)

    // Set _currentAction, which is what the tickSetters will
    // change
    this._currentAction = action

    // Return the _tickSetters, so that actions.tick.mouse() works
    return this._tickSetters
  }
}

exports = module.exports = Actions
