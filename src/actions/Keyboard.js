const InputDevice = require('./InputDevice')

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
