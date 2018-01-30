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
      Up: (value) => {
        return {
          type: 'keyUp',
          value
        }
      },

      Down: (value) => {
        return {
          type: 'keyDown',
          value
        }
      }
    }
  }
}
exports = module.exports = Keyboard
