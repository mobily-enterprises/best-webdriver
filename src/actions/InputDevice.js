
/**
 * The base class for input devices. Each device is associated a unique ID
*/
class InputDevice {
  /**
   * @param {string} id The unique ID of the device
  */
  constructor (id) {
    this.id = id
  }
}

exports = module.exports = InputDevice
