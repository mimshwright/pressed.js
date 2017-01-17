import pressed from '../src/pressed.js'
pressed.start()

let pressedKeyList = document.getElementById('pressedKeyList')
let pressedKeyCodeList = document.getElementById('pressedKeyCodeList')
let every = document.getElementById('every')
let some = document.getElementById('some')
let leftCommand = document.getElementById('leftCommand')
let anyCommand = document.getElementById('anyCommand')
let mouse0 = document.getElementById('mouse0')
let mouse2 = document.getElementById('mouse2')
let anyMouse = document.getElementById('anyMouse')

function onFrame () {
  // console.log(pressed.list);
  const waitingString = '❌'
  const detectedString = '✅ '

  const downKeys = pressed.listAllKeys()
  const downKeyCodes = pressed.listAllKeyCodes()

  pressedKeyList.innerHTML = downKeys.length ? detectedString + downKeys.join(', ') : waitingString
  pressedKeyCodeList.innerHTML = downKeyCodes.length ? detectedString + downKeyCodes.join(', ') : waitingString

  every.innerHTML = pressed.every('L', 'shift') ? detectedString + 'Combo!' : waitingString

  some.innerHTML = pressed.some('a', 'e', 'i', 'o', 'u') ? detectedString + 'Vowel detected.' : waitingString

  leftCommand.innerHTML = pressed('left command') ? detectedString + 'Left Meta Key pressed!' : waitingString
  anyCommand.innerHTML = pressed.some('command') ? detectedString + 'Meta Key pressed!' : waitingString

  mouse0.innerHTML = pressed('mouse 0') ? detectedString + 'Left mouse button pressed!' : waitingString
  mouse2.innerHTML = pressed.some('mouse 2') ? detectedString + 'Right mouse button pressed' : waitingString
  anyMouse.innerHTML = pressed.some('mouse 0', 'mouse 1', 'mouse 2', 'mouse 3', 'mouse 4') ? detectedString + 'Some mouse button pressed!' : waitingString

  window.requestAnimationFrame(onFrame)
}
window.requestAnimationFrame(onFrame)

window.oncontextmenu = () => false
