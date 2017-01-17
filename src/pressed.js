import keycode from 'keycode'

let list = {}
let isListening = false

const LEFT_COMMAND_STRING = 'left command'
const LEFT_COMMAND = 91
const RIGHT_COMMAND = 93
const HIGHEST_MOUSE_CODE = 4

const mousecode = (code) => {
  if (typeof (code) === 'string') {
    if (code.toLowerCase().search(/mouse /) === 0) {
      // return the mouse button code
      code = code.charAt(6)
      if ((code >= 0) && (code <= HIGHEST_MOUSE_CODE)) {
        return code
      }
    }
  }
  if (typeof (code) === 'number') {
    if ((code >= 0) && (code <= HIGHEST_MOUSE_CODE
)) {
      return 'mouse ' + code
    }
  }
  return null
}

const mouseAndKeyCode = (key) => {
  const code = mousecode(key)
  if (code !== null) {
    return code
  }
  return keycode(key)
}

const pressed = (key) => {
  checkForListener()
  const checkList = (key) => list[key] !== undefined

  if (typeof (key) === 'string') {
    let code = mouseAndKeyCode(key)
    if (isNaN(code)) {
      throw new Error(key + ' is not a supported key name.')
    }

    // Special case for modifier key strings:
    // String representations of command should return true when either the
    // Left or Right Command key is pressed (unless the side is specified).
    if (code === 91) {
      if (key !== LEFT_COMMAND_STRING) {
        return checkList(LEFT_COMMAND) || checkList(RIGHT_COMMAND)
      }
    }
    key = code
  }

  if (isNaN(key)) {
    throw new Error('`key` must be either an integer key code or a string.')
  }

  return checkList(key)
}

pressed.key = (key) => {
  if (mousecode(key)) {
    throw new Error('pressed.key() only accepts key strings or ints. For mouse clicks, use pressed.mosueButton()')
  }
  return pressed(key)
}

pressed.mouseButton = (code) => {
  if (typeof (code) !== 'number') {
    throw new Error('pressed.mouseButton() only accepts integer arguments.')
  }
  code = mousecode(code)
  if (code === null) {
    throw new Error('pressed.mouseButton() only works with mouseCodes 0-4')
  }
  return pressed(code)
}

pressed.every = (...keys) => {
  checkForListener()

  return keys.reduce((defined, key) => defined && pressed(key), true)
}

pressed.some = (...keys) => {
  checkForListener()

  return keys.reduce((defined, key) => defined || pressed(key), false)
}

pressed.listAllKeyCodes = () => Object.keys(list).map(key => { return parseInt(key) })
pressed.listAllKeys = () => pressed.listAllKeyCodes().map(keycode)

pressed.start = (eventEmitter) => {
  if (!isListening) {
    if (!eventEmitter && undefined !== window) {
      eventEmitter = window
    }
    if (!eventEmitter.addEventListener || !eventEmitter.removeEventListener) {
      throw new Error('Could not find a valid `eventEmitter` object (usually window). This code will not work outside of a browser environment (i.e. in node) unless you provide a valid object with addEventListener and removeEventListener that dispatches `keydown` and `keyup` events.')
    }
    eventEmitter.addEventListener('keydown', onKeyDown)
    eventEmitter.addEventListener('keyup', onKeyUp)
    eventEmitter.addEventListener('blur', onBlur)
    eventEmitter.addEventListener('mousedown', onMouseDown)
    eventEmitter.addEventListener('mouseup', onMouseUp)
    pressed.reset()
    isListening = true
  }
}

pressed.reset = () => {
  list = {}
  pressed.list = list
}
pressed.add = (...keys) => {
  keys.map((key) => {
    if (typeof (key) === 'string') {
      key = keycode(key)
    }
    list[key] = true
  })
}
pressed.remove = (...keys) => {
  keys.map((key) => {
    if (typeof (key) === 'string') {
      key = keycode(key)
    }
    delete list[key]
  })
}

const onKeyDown = ({keyCode}) => {
  list[keyCode] = true
}
const onKeyUp = ({keyCode}) => {
  delete list[keyCode]
}
const onMouseDown = ({button}) => {
  onKeyDown({keyCode:button})
}
const onMouseUp = ({button}) => {
  onKeyUp({keyCode:button})
}

const onBlur = (event) => {
  pressed.reset()
}

pressed.stop = (eventEmitter) => {
  if (isListening) {
    if (!eventEmitter && undefined !== window) {
      eventEmitter = window
    }
    if (eventEmitter.removeEventListener) {
      eventEmitter.removeEventListener('keydown', onKeyDown)
      eventEmitter.removeEventListener('keyup', onKeyUp)
      eventEmitter.removeEventListener('blur', onBlur)
      pressed.reset()
      isListening = false
    }
  }
}

pressed.isListening = () => isListening

const checkForListener = () => {
  if (!isListening) {
    throw new Error('Key listener is not running. You must run pressed.start() to initialize the tracker.')
  }
}

module.exports = pressed
