const InputDevice = require('./InputDevice')
const Element = require('../Element')

/**
 * Class for Pointer objects.
 * When a Pointer object is passed to the {@link Action} constructor:

 *     var actions = new Actions(new Pointer('bigMouse'))
 *
 * the action's `tick` will have the following methods (assuming that the Pointer's ID
 * is `mouse`):
 *
 *  * {@link Pointer#Up action.tick.bigMouseUp()}
 *  * {@link Pointer#Down action.tick.bigMouseDown()}
 *  * {@link Pointer#Move action.tick.bigMouseMove()}
 *  * {@link Pointer#Cancel action.tick.bigMouseCancel()}
 *
 * Note: input device objects are only ever used in {@link Actions}
 * @extends InputDevice
 * @example
 * var mouse = new Pointer('mouse', Pointer.Type.MOUSE)
 * var touch1 = new Pointer('touch1', Pointer.Type.TOUCH)
 * var touch2 = new Pointer('touch2', Pointer.Type.TOUCH)
 * var actions = new Actions(mouse, touch1, touch2)
 * actions.tick.mouseDown().touch1Down().touch2Down()
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
   * The button types on a pointer.
   *
   * It actually returns:
   *
   *    {
   *      LEFT: 0,
   *      MIDDLE: 1,
   *      RIGHT: 2
   *    }
  */
  static get Button () {
    return {
      LEFT: 0,
      MIDDLE: 1,
      RIGHT: 2
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

      /**
       * Move the pointer to a specified `origin` location, using `x` and `y` and offset, and taking `duration` milliseconds
       *
       * This method will be added to the action's `tick` property. **prefixed** with the Pointer's ID.
       *
       * @param {Object} params Instructions on where to move the pointer
       * @param {Element|string} params.origin=Pointer.Origin.VIEWPORT Where to move the pointer to. It can be an {@link Element} object,
       *                      or Pointer.Origin.VIEWPORT or Pointer.Origin.POINTER
       * @param {number} params.x The x offset, from params.origin.
       * @param {number} params.y The y offset, from params.origin.
       * @param {number} params.duration How long the operation will take, in milliseconds
       *
       * @example
       *
       *     // Defining a pointer device called "cucumber", and passing it
       *     // to the actions constructor
       *     var actions = new Actions( new Pointer('bigMouse'))
       *     // the `cucumberMove` method is now available in the tick property
       *     actions.tick.bigMouseMove({ x: 400, y: 400 })
       *
       * @memberof Pointer#
      */
      Move: (args) => {
        // Work out origin, defaulting to VIEWPORT.
        // If it's an element, it will be seriaslised as a webdriver object
        // w3c: for Chrome, we still have the ELEMENT key
        // In any case, it MUST be an element, VIEWPORT or POINTER
        var origin
        if (!args.origin) {
          origin = Pointer.Origin.VIEWPORT
        } else {
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
          x: args.x || 0,
          y: args.y || 0
        }
      },

      /**
       * Press a pointer button
       *
       * This method will be added to the action's `tick` property. **prefixed** with the Pointer's ID.
       *
       * @param {number} button=Pointer.Button.LEFT The button to press. It can be `Pointer.Button.LEFT` (0),
       *                        `Pointer.Button.MIDDLE` (1) or `Pointer.Button.RIGHT` (2)
       *
       * @example
       *     var actions = new Actions( new Pointer('bigMouse'))
       *     actions.tick.bigMouseDown()
       *     actions.tick.bigMouseDown(Pointer.Button.RIGHT)
       *
       * @memberof Pointer#
      */
      Down: (button = 0) => {
        return {
          type: 'pointerDown',
          button
        }
      },

      /** Release a pointer button
       *
       * This method will be added to the action's `tick` property. **prefixed** with the Pointer's ID.
       *
       * @param {number} button=Pointer.Button.LEFT The button to let go
       *
       * @example
       *     var actions = new Actions( new Pointer('bigMouse'))
       *     actions.tick.bigMouseUp()
       *     actions.tick.bigMouseUp(Pointer.Button.RIGHT)
       *
       * @memberof Pointer#
      */
      Up: (button = 0) => {
        return {
          type: 'pointerUp',
          button
        }
      },

      /**
       * Cancels the pointer
       *
       * This method will be added to the action's `tick` property. **prefixed** with the Pointer's ID.
       * @example
       *     var bigMouse = new Pointer('bigMouse')
       *
       *     // This will take 4 seconds. NOTE: there is no await before actions.performActions
       *     var actions = new Actions(bigMouse)
       *     actions.tick.bigMouseDown().tick.bigMouseUp().tick.bigMouseCancel()
       *
       * @memberof Pointer#
      */
      Cancel: () => {
        return {
          type: 'pointerCancel'
        }
      },

      /**
       * Pause the pointer for the specified length of time
       *
       * This method will be added to the action's `tick` property. **prefixed** with the Pointer's ID.
       * @param {number} duration=0 Duration of the pause
       *
       * @example
       *    var bigMouse = new Pointer('bigMouse')
       *    var bigKeyboard = new Pointer('bigKeyboard')
       *
       *    var actions = new Actions(bigMouse, bigKeyboard)
       *    actions.tick.bigKeyboardDown('a').bigMousePause()
       *    actions.performActions(actions)
       *
       * @memberof Pointer#
      */
      Pause: (duration) => {
        return { type: 'pause', duration }
      }

    }
  }
}

exports = module.exports = Pointer
