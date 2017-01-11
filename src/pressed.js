import keycode from 'keycode'

let list = {}
let isListening = false

const LEFT_COMMAND_STRING = 'left command'
const LEFT_COMMAND = 91
const RIGHT_COMMAND = 93

const pressed = (key) => {
  checkForListener()
  const checkList = (key) => list[key] !== undefined

  if (typeof (key) === 'string') {
    let code = keycode(key)
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

pressed.key = (key) => pressed(key)

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

const onKeyDown = (event) => {
  list[event.keyCode] = true
}
const onKeyUp = (event) => {
  delete list[event.keyCode]
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
