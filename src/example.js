import pressed from '../src/pressed.js'
pressed.start()

let pressedKeyList = document.getElementById('pressedKeyList')
let pressedKeyCodeList = document.getElementById('pressedKeyCodeList')
let every = document.getElementById('every')
let some = document.getElementById('some')
let leftCommand = document.getElementById('leftCommand')
let anyCommand = document.getElementById('anyCommand')

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

  window.requestAnimationFrame(onFrame)
}
window.requestAnimationFrame(onFrame)
