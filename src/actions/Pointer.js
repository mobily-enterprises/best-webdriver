const InputDevice = require('./InputDevice')
const Element = require('../Element')

//  POINTER: "pause", "pointerUp", "pointerDown", "pointerMove", or "pointerCancel
class Pointer extends InputDevice {
  constructor (id, pointerType) {
    super(id)
    this.pointerType = pointerType
    this.type = 'pointer'
  }

  static get Type () {
    return {
      MOUSE: 'mouse',
      PEN: 'pen',
      TOUCH: 'touch'
    }
  }

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
