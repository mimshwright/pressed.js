let list = {}
let isListening = false

const keyIsDown = (key) => {
  checkForListener()

  return list[key] !== undefined
}

keyIsDown.all = (...keys) => {
  checkForListener()

  return keys.reduce((defined, key) => defined && list[key] !== undefined, true)
}

keyIsDown.any = (...keys) => {
  checkForListener()

  return keys.reduce((defined, key) => defined || list[key] !== undefined, false)
}

keyIsDown.listAllKeys = () => Object.keys(list)

keyIsDown.start = (eventEmitter) => {
  if (!isListening) {
    if (!eventEmitter && undefined !== window) {
      eventEmitter = window
    }
    if (!eventEmitter.addEventListener || !eventEmitter.removeEventListener) {
      throw new Error('Could not find a valid `eventEmitter` object (usually window). This code will not work outside of a browser environment (i.e. in node) unless you provide a valid object with addEventListener and removeEventListener that dispatches `keydown` and `keyup` events.')
    }
    eventEmitter.addEventListener('keydown', onKeyDown, false)
    eventEmitter.addEventListener('keyup', onKeyUp, false)
    eventEmitter.addEventListener('blur', onBlur, false)
    keyIsDown.resetList()
    isListening = true
  }
}

keyIsDown.resetList = () => {
  list = {}
  keyIsDown.list = list
}

const onKeyDown = (event) => {
  list[event.keyCode] = true
}
const onKeyUp = (event) => {
  delete list[event.keyCode]
}
const onBlur = (event) => {
  keyIsDown.resetList()
}

keyIsDown.stop = (eventEmitter) => {
  if (isListening) {
    if (!eventEmitter && undefined !== window) {
      eventEmitter = window
    }
    if (eventEmitter.removeEventListener) {
      eventEmitter.removeEventListener('keydown', onKeyDown)
      eventEmitter.removeEventListener('keyup', onKeyUp)
      eventEmitter.removeEventListener('blur', onBlur)
      keyIsDown.resetList()
      isListening = false
    }
  }
}

keyIsDown.isListening = () => isListening

const checkForListener = () => {
  if (!isListening) {
    throw new Error('Key listener is not running. You must run keyIsDown.start() to initialize the tracker.')
  }
}

export default keyIsDown
