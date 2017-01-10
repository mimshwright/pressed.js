import keyIsDown from '../src/keyIsDown.js'
keyIsDown.start()

let pressedKeyList = document.getElementById('pressedKeyList')
let all = document.getElementById('all')
let any = document.getElementById('any')
let leftCommand = document.getElementById('leftCommand')
let anyCommand = document.getElementById('anyCommand')

function onFrame () {
  // console.log(keyIsDown.list);
  const waitingString = '❌'
  const checkString = '✅ '

  var downKeys = keyIsDown.listAllKeys()
  pressedKeyList.innerHTML = downKeys.length ? checkString + downKeys : waitingString
  window.requestAnimationFrame(onFrame)

  all.innerHTML = keyIsDown.all('L', 'shift') ? checkString + 'Combo!' : waitingString

  any.innerHTML = keyIsDown.any('a', 'e', 'i', 'o', 'u') ? checkString + 'Vowel detected.' : waitingString

  leftCommand.innerHTML = keyIsDown('command') ? checkString + 'Command pressed!' : waitingString
  anyCommand.innerHTML = keyIsDown.any('left command', 'right command') ? checkString + 'Command pressed!' : waitingString
}
window.requestAnimationFrame(onFrame)
