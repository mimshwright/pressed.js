# keyIsDown

Tracks which keys on the keyboard are currently being pressed. This is very useful in game development when you may want to respond to multiple key presses in your update loop.

## Usage

```
// Initialize the system
keyIsDown.start()

// Later...

// Check for a key code.
if (keyIsDown(65)) {
  console.log('"A" key is currently pressed.')
}
// Works with strings too.
if (keyIsDown("A")) {
  console.log('"A" key is currently pressed.')
}
// Even works with unicode symbols for modifier keys!
if (keyIsDown("⌘")) {
  console.log('"Command" key (or windows key) is currently pressed.')
}

```

String to keycode mappings use the [keycode module](https://npmjs.com/package/keycode). Here's a list of [all the supported strings to keycode mappings](https://gist.github.com/mimshwright/7b23464d7f63065400af319d04e7df6d).

```

// Check multiple keys at once
if (keyIsDown.all("shift", "L")) {
  console.log('Both "Shift" and "L" are currently pressed.')
}
if (keyIsDown.any("a", "e", "i", "o", "u")) {
  console.log('At least one vowel key is currently pressed.')
}

// List all keys currently pressed.
console.log(keyIsDown.listAllKeys()) // ['76', '16']

// When you're all done using it...
keyIsDown.stop()

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

keyIsDown.start(myCustomEmitter)

// Later...
keyIsDown.stop(myCustomEmitter)
```

¹: Node users may want to check out [keypress](https://www.npmjs.com/package/keypress).

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
