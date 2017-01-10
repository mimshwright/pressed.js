# keyIsDown.js

Tracks which keys are currently pressed down.

## Usage

```
// Check for a key code.
if (keyIsDown(65)) {
  console.log('"A" key is currently pressed.')
}

// Check multiple keys at once
if (keyIsDown.all(76, 16)) {
  console.log('Both "Shift" and "L" are currently pressed.')
}
if (keyIsDown.any(65, 69, 73, 79, 85)) {
  console.log('At least one vowel key is currently pressed.')
}

// List all keys currently pressed.
console.log(keyIsDown.listAllKeys()) // ['76', '16']

```

## Overriding `window`
Normally, this module will not work outside of a browser environment[^1]. However, if for some reason you have some reason to force it to work, or if you just want to listen to events somewhere besides the `window` object, you can pass a custom object to the `start()` function with `addEventListener` and `removeEventListener` defined.

```
const myCustomEventEmitter = {
  addEventListener: (eventType, listenerFunction) => {
    // Code to add listener.
  },
  removeEventListener: (eventType, listenerFunction) => {
    // Code to remove listener.
  }
}

keyIsDown.start(myCustomEmitter)
```

[^1]: Node users may want to check out [keypress](https://www.npmjs.com/package/keypress).

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
