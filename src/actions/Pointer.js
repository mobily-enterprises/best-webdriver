const InputDevice = require('./InputDevice')
const Element = require('../Element')

/**
 * Class for Pointer objects.
 *
 * Note: input device objects are only ever used in {@link Actions}
 * @extends InputDevice
 * @example
 * var mouse = new Pointer('mouse', Pointer.Type.MOUSE)
 * var touch1 = new Pointer('touch1', Pointer.Type.TOUCH)
 * var touch2 = new Pointer('touch2', Pointer.Type.TOUCH)
 * var actions = new Actions(mouse, touch1, touch2)
 */
class Pointer extends InputDevice {
  /**
   * Each device is associated a unique ID
   * like `mouse`, `touch`, `pen`.
   * @param {string} id The unique ID of the device
   * @param {string} pointerType It can be `Pointer.Type.MOUSE`, `Pointer.Type.PEN`
   *                             or `Pointer.Type.TOUCH`
   *
  */
  constructor (id, pointerType) {
    super(id)
    this.pointerType = pointerType || Pointer.Type.MOUSE
    this.type = 'pointer'
  }

  /**
   * The types of pointer types, used to create the right type of pointer.
   * E.g. `Pointer.Type.MOUSE`, `Pointer.Type.PEN` or `Pointer.Type.TOUCH`,
   *
   * It actually returns:
   *
   *      {
   *        MOUSE: 'mouse',
   *        PEN: 'pen',
   *        TOUCH: 'touch'
   *      }
  */
  static get Type () {
    return {
      MOUSE: 'mouse',
      PEN: 'pen',
      TOUCH: 'touch'
    }
  }

  /**
   * The types of origins, used in `Move()` commands. See {@link Actions} on how to use
   * this constant.
   * E.g. `Pointer.Origin.VIEWPORT` or `Pointer.Origin.POINTER`
   *
   * It actually returns:
   *
   *     {
   *       VIEWPORT: 'viewport',
   *       POINTER: 'pointer'
   *     }
  */
  static get Origin () {
    return {
      VIEWPORT: 'viewport',
      POINTER: 'pointer'
    }
  }

  _tickMethods () {
    return {
      Move: (args) => {
        // Work out origin, defaulting to VIEWPORT.
        // If it's an element, it will be seriaslised to please W3c AND Chrome
        // In any case, it MUST be an element, VIEWPORT or POINTER
        var origin
        if (!args.origin) {
          origin = Pointer.Origin.VIEWPORT
        } else {
          console.log('ORIGIN:', args.origin, args.origin instanceof Element)

          if (args.origin instanceof Element) {
            origin = {
              'element-6066-11e4-a52e-4f735466cecf': args.origin.id,
              ELEMENT: args.origin.id
            }
          } else {
            origin = args.origin
            if (origin !== Pointer.Origin.VIEWPORT &&
                origin !== Pointer.Origin.POINTER) {
              throw new Error('When using move(), origin must be an element, Pointer.Origin.VIEWPORT or Pointer.Origin.POINTER')
            } else {
            }
          }
        }

        return {
          type: 'pointerMove',
          duration: args.duration || 0,
          origin,
          x: args.x,
          y: args.y
        }
      },
      Down: (button = 0) => {
        return {
          type: 'pointerDown',
          button
        }
      },
      Up: (button = 0) => {
        return {
          type: 'pointerUp',
          button
        }
      },
      Cancel: () => {
        return {
          type: 'pointerCancel'
        }
      }
    }
  }
}

exports = module.exports = Pointer
