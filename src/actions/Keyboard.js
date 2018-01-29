const InputDevice = require('./InputDevice')

//  KEYBOARD: "pause", "keyUp", "keyDown"
class Keyboard extends InputDevice {
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
