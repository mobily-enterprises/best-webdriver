const InputDevice = require('./InputDevice')

/**
 * Class for Keyboard objects.
 *
 * Note: input device objects are only ever used in {@link Actions}
 * @extends InputDevice
 * @example
 * var keyboard = new Keyboard('keyboard')
 * var actions = new Actions(keyboard)
 */
class Keyboard extends InputDevice {
  /**
   * Each device is associated a unique ID
   * like `keyboard1`, `keyboard2`.
   * @param {string} id The unique ID of the device
   *
  */
  constructor (id) {
    super(id)
    this.type = 'key'
  }

  _tickMethods () {
    return {

      /** Unpress the specified key on the keyboard
       *
       * This method will be added to the action's `tick` property. **prefixed** with the Keyboard's ID.
       *
       * @param {string} key The key to unpress. You can use special keys defined in {@link Actions#Keys}
       *
       * @example
       *     var actions = new Actions( new Pointer('bigKeyboard'))
       *
       *     actions.tick.bigKeyboardDown('a').
       *             tick.bigKeyboardUp('a')
       *
       *     actions.tick.bigKeyboardDown(Actions.Keys.ENTER)
       *            .tick.bigKeyboardUp(Actions.Keys.ENTER)
       *
       * @memberof Keyboard#
      */
      Up: (value) => {
        return {
          type: 'keyUp',
          value: value.normalize()
        }
      },

      /** Press the specified key on the keyboard
       *
       * This method will be added to the action's `tick` property. **prefixed** with the Keyboard's ID.
       *
       * @param {string} key The key to press. You can use special keys defined in {@link Actions#Keys}
       *
       * @example
       *     var actions = new Actions( new Pointer('bigKeyboard'))
       *
       *     actions.tick.bigKeyboardDown('a').
       *             tick.bigKeyboardUp('a')
       *
       *     actions.tick.bigKeyboardDown(Actions.Keys.ENTER)
       *            .tick.bigKeyboardUp(Actions.Keys.ENTER)
       *
       * @memberof Keyboard#
      */
      Down: (value) => {
        return {
          type: 'keyDown',
          value: value.normalize()
        }
      },

      /**
       * Pause the keyboard for the specified length of time
       *
       * This method will be added to the action's `tick` property. **prefixed** with the Keyboard's ID.
       *
       * @param {number} duration=0 Duration of the pause
       *
       * @example
       *    var bigMouse = new Pointer('bigMouse')
       *    var bigKeyboard = new Pointer('bigKeyboard')
       *
       *    var actions = new Actions(bigMouse, bigKeyboard)
       *    actions.tick.bigKeyboardPause().bigMouseMove({ x: 100, y: 200, duration: 4000 })
       *    actions.performActions(actions)
       *
       * @memberof Keyboard#
      */
      Pause: (duration) => {
        return { type: 'pause', duration }
      }

    }
  }
}
exports = module.exports = Keyboard
