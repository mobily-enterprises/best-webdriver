const Pointer = require('./Pointer')
const Keyboard = require('./Keyboard')
const KEY = require('../KEY')

/**
 * The class responsible of creating action objects, which are a list
 * of UI actions to be carried out.
 *
 * Once the action object is created, you can add "ticks" to it using the
 * property `tick` (which is actually a getter). The way you use `tick` depends on the devices you created.
 *
 * If you call the constructor lile this:
 *
 *     var actions = new Actions()
 *
 * It's the same as typing:
 *
 *     var actions = new Actions(
 *       new Actions.Keyboard('keyboard'),
 *       new Actions.Pointer('mouse', Pointer.Type.MOUSE)
 *     )
 *
 * This will make two devices, `mouse` and `keyboard`, available.
 *
 * Such a scenario will allow you to call:
 *
 *     actions.tick.keyboardDown('r').mouseDown()
 *     actions.tick.keyboardUp('r').mouseUp()
 *
 * Here, `keyboardUp` was available as a combination of the keyboard ID `keyboard`
 * and the keyboard action `Up`.
 *
 * In short:
 *
 *   * * Keyboard devices will have the methods `Up`, `Down`
 *   * * Pointer devices will have the methors `Move`, `Up`, `Down`, `Cancel`
 *   * * Both of them have the method `pause`
 *
 * If you create an actions object like this:
 *
 *      var actions = new Actions(new Actions.Keyboard('cucumber'))
 *
 * You are then able to run:
 *
 *      actions.tick.cucumberDown('r')
 *      actions.tick.cucumberUp('r')
 *
 * However running:
 *
 *      actions.tick.cucumberMove('r')
 *
 * Will result in an error, since `cucumber` is a keyboard device, and it doesn't
 * implement `move` (only pointers do)
 *
 * If you have two devices set (like the default `keyboard` and `mouse`, which
 * is the most common use-case), you can set one action per tick:
 *
 *      var actions = new Actions() // By default, mouse and keyboard
 *      // Only a keyboard action in this tick. Mouse will pause
 *      actions.tick.keyboardDown('r')
 *      // Only a mouse action in this tick. Keyboard will pause
 *      actions.tick.mouseDown()
 *      // Both a mouse and a keyboard action this tick
 *      actions.tick.keyboardUp('r').mouseUp()
 *
 * You can only add one action per device in each tick. This will give an error,
 * because the `mouse` device is trying to define two different actions in the same
 * tick:
 *
 *      actions.tick.mouseDown().mouseUp()
 *
 * You are able to chain tick calls if you want to:
 *
 *      actions
 *      .tick.keyboardDown('r').mouseDown()
 *      .tick.keyboardUp('r').mouseUp()
 *
 * Once you have decided your actions, you can submit them:
 *
 *     await driver.performActions(actions)
 *
 * @param {...InputDevice} inputDevice Input devices that will be used to carry out
 *                         actions. By default, two devices are created:
 *                         `keyboard` and `mouse`
 * @example
 * // Creating an actions object. This...
 * var actions = new Actions()
 * // Is the same as:
 * var Pointer = Actions.Pointer
 * var Keyboard = Actions.Keyboard
 * var actions = new Actions( new Actions.Keyboard('keyboard'), new Actions.Pointer('mouse', Pointer.Type.MOUSE))
 *
 * // You can also be creative with names
 * var actions = new Actions.Pointer('da_mouse', Pointer.Type.MOUSE)
 *
 *
 */
class Actions {
  /**
   * The constructor
   */
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
    // With `Actions(new Actions.Pointer('fancyMouse'))` will establish
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
        // this._tickSetters['pause'] = function (duration = 0) {
        //   self._currentAction[device.id] = { type: 'pause', duration }
        //   return self._tickSetters
        // }
      })
    })
  }

  /** Constant returning special KEY characters (enter, etc.)
   *  Constant are from the global variable {@link KEY}
   *
   * @example
   * var actions = new Actions()
   * actions.tick.keyboardDown(Actions.Key.ENTER).keyboardUp(Actions.Key.ENTER)
   */
  static get Key () { return KEY }

  /**
   * The {@link Keyboard} class constructor
   */
  static get Keyboard () {
    return Keyboard
  }

  /**
   * The {@link Keyboard} class constructor
   */
  static get Pointer () {
    return Pointer
  }

  /**
   * Compiles the stored actions into a `compiledActions` object, which is
   * an object compatible with the w3c webdriver protocol for actions
   *
   * There is no need to call this method directly, since the driver always tries
   * to `compile()` actions before sending them over.
   */
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

  /**
   * As a getter, it will return an object with the right methods depending on
   * what devices were passed when constructing the object.
   * For example running:
   *
   *      var actions = new Actions(new Actions.Keyboard('cucumber'))
   *
   * Will ensure that `tick` will return an object with the properties
   * `cucumberUp`, `cucumberDown` and `pause`
   * More conventionally, creating the action object like this:
   *
   *      var actions = new Actions()
   *
   * Will default to two devices, `mouse` and `keyboard`. So, the object returned
   * by the `tick` getter will return an object with the methods `keyboardUp()`, `keyboardDown()`,
   * `keyboardPause()`, `mouseUp()`, `mouseDown()`, `mouseCancel()`, `mousePause()`
   */
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
