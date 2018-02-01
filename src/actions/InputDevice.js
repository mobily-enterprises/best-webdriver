
/**
 * The base class for input devices. Each device is associated a unique ID
 * like `mouse`, `oldMouse`, or `keyboard`
 * Note: input device objects are only ever used in {@link Actions}.
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
