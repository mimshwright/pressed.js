# keyIsDown.js

Tracks which keys are currently pressed down.

## Usage

```
// Use a string to check if a key is currently pressed.
if (keyIsDown('a')) {
  console.log('"A" key is currently pressed.')
}

// Check modifier keys by string
if (keyIsDown('cmd')) {
  console.log('"Command" key is currently pressed.')
}

// Check multiple keys at once
if (keyIsDown.all('cmd', 'a')) {
  console.log('Both "Command" and "A" are currently pressed.')
}
if (keyIsDown.any('cmd', 'a')) {
  console.log('At least one of the keys "Command" or "A" is currently pressed.')
}

// Use a int to check for a key code.
if (keyIsDown(65)) {
  console.log('"A" key is currently pressed.')
}

// List all keys currently pressed.
console.log(keyIsDown.list) // ["a", "cmd"]

```

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
