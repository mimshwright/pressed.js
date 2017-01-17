# pressed.js

[![npm version](https://badge.fury.io/js/pressed.svg)](https://badge.fury.io/js/pressed)
[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

Tracks which keys on the keyboard are currently being pressed. This is very useful in game development when you may want to respond to multiple key presses in your update loop.

## Example

It works best to see a [live example](https://rawgit.com/mimshwright/pressed.js/master/example/index.html).

## Usage

```
import pressed from "pressed"
// Initialize the system
pressed.start()

// Later...

// Check for a key code.
if (pressed(65)) {
  console.log('"A" key is currently pressed.')
}
// Works with strings too.
if (pressed("A")) {
  console.log('"A" key is currently pressed.')
}
// Even works with unicode symbols for modifier keys!
if (pressed("⌘")) {
  console.log('"Command" key (or windows key) is currently pressed.')
}

// Mouse buttons (0-4) are tracked too.
if (pressed.mouseButton(0)) { // pressed("mouse 0") also works
  console.log('Left mouse button is currently pressed.')
}

```

String to keycode mappings use the [keycode module](https://npmjs.com/package/keycode). Here's a list of [all the supported strings to keycode mappings](https://gist.github.com/mimshwright/7b23464d7f63065400af319d04e7df6d).

```

// Check multiple keys at once
if (pressed.every("shift", "L")) {
  console.log('Both "Shift" and "L" are currently pressed.')
}
if (pressed.some("a", "e", "i", "o", "u")) {
  console.log('At least one vowel key is currently pressed.')
}

// List all keys currently pressed.
console.log(pressed.listAllKeys()) // E.g. ['L', 'shift']
console.log(pressed.listAllKeyCodes()) // E.g. [76, 16]

// When you're all done using it...
pressed.stop()

```

## Overriding `window`
Normally, this module will not work outside of a browser environment¹. However, if for some reason you want to force it to work, or if you just want to listen to events somewhere besides the `window` object, you can pass a custom object to the `start()` function with `addEventListener` and `removeEventListener` defined.

```
const myCustomEventEmitter = {
  addEventListener: (eventType, listenerFunction) => {
    // Code to add listener.
  },
  removeEventListener: (eventType, listenerFunction) => {
    // Code to remove listener.
  }
}

pressed.start(myCustomEmitter)

// Later...
pressed.stop(myCustomEmitter)
```

¹: Node users may want to check out [keypress](https://www.npmjs.com/package/keypress).

### Weirdness
- Caps Lock (key code 20) will appear pressed as long as it's on. If you call pressed.start() when the caps lock key is on, it won't appear pressed until after you turn it off and on again.
