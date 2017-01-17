import test from 'tape-catch'
import pressed from '../src/pressed.js'

let vowels = [65, 69, 73, 79, 85]
let emitter = { addEventListener: () => {}, removeEventListener: () => {} }

test('Module:pressed', (module) => {
  test('pressed.isListening(), pressed.start() and pressed.stop()', (assert) => {
    assert.ok(pressed.isListening instanceof Function, 'pressed.isListening() is a function')
    assert.equal(pressed.isListening(), false, 'pressed.isListening() is false by default')

    assert.ok(pressed.start instanceof Function, 'start() is a function')
    assert.throws(() => pressed.start(), 'Should throw if not run in an environment with a window object.')
    assert.doesNotThrow(() => pressed.start(emitter), 'Shouldn\'t throw if a valid window object is provided.')
    assert.equal(pressed.isListening(), true, 'isListening() will return true if running.')

    assert.ok(pressed.stop instanceof Function, 'stop() is a function')
    // assert.doesNotThrow(() => pressed.stop(), 'Unlike start(), will not throw if not run in an environment with a window object.')
    assert.equal(pressed.isListening(), true, 'However, isListening() won\'t be set to false.')
    assert.doesNotThrow(() => pressed.stop(emitter), 'Shouldn\'t throw if a valid window object is provided.')
    assert.equal(pressed.isListening(), false, 'isListening() will be set to false.')

    assert.end()
  })

  test('pressed()', (assert) => {
    assert.ok(pressed instanceof Function, 'pressed() is a function')
    assert.throws(() => pressed(), 'pressed() throws an error if start() hasn\'t been called')

    pressed.start(emitter)
    assert.equal(pressed(65), false, 'By default, nothing down.')
    pressed.list[65] = true // A
    assert.equal(pressed(65), true, 'When key is down, it returns true')
    assert.equal(pressed('a'), true, 'Use strings or keycodes!')
    pressed.reset()
    assert.equal(pressed(65), false, 'Keys removed properly.')

    pressed.list[49] = true // 1
    assert.equal(pressed(49), true, 'Keycode for number works.')
    assert.equal(pressed(1), false, 'Beware! Digits 0-9 are treated as keycodes.')
    assert.equal(pressed('1'), true, 'Wrapping digits 0-9 in quotes solves the issue.')
    pressed.reset()

    pressed.list[91] = true // cmd or windows
    assert.equal(pressed(91), true, 'Keycode for modifier key works.')
    assert.equal(pressed(93), false, 'Keycode for right modifier key doesn\'t work.')
    assert.equal(pressed('cmd'), true, 'String representation of modifier keys works.')
    assert.equal(pressed('⌘'), true, 'Symbol representation of modifier keys works.')
    assert.equal(pressed('right command'), false, 'Right command does not register left command key.')
    pressed.reset()

    pressed.list[93] = true // right cmd or windows
    assert.equal(pressed('⌘'), true, 'String representation of modifier keys work for both left and right keys.')
    assert.equal(pressed('cmd'), true, 'String representation of modifier keys work for both left and right keys.')
    assert.equal(pressed('left command'), false, 'Except left command which doesn\'t register right command key.')
    assert.equal(pressed('right command'), true, 'Right command does register right command key.')

    assert.throws(() => pressed({}), 'pressed() throws an error if parameter isn\'t a string or number.')
    assert.throws(() => pressed('BOGUS KEY'), 'Bogus key name throws.')
    assert.doesNotThrow(() => pressed(99999), 'Bogus key code doesn\'t throw because it\'s hard to tell what\'s bogus!')

    pressed.stop(emitter)

    assert.end()
  })

  test('pressed.key()', (assert) => {
    assert.ok(pressed.key instanceof Function, 'pressed.key() is a more explicit alias for pressed()')
    pressed.start(emitter)
    pressed.list[65] = true // A
    assert.equal(pressed.key(65), true, 'When key is down, it returns true')
    assert.equal(pressed.key('A'), true, 'Works with strings')
    pressed.stop(emitter)
    assert.end()
  })

  test('Mouse Buttons', (assert) => {
    assert.ok(pressed.mouseButton instanceof Function, 'pressed.mouseButton() is a more explicit alias for pressed()')
    pressed.start(emitter)
    pressed.add(0) // Mouse butotn 0
    assert.equal(pressed.list[0], true, 'Add adds mouse buttons to list correctly')
    assert.throws(() => { pressed.key(0) }, 'Key() should not work with mouse buttons')
    assert.equal(pressed(0), true, 'Pressed should work with mouse buttons')
    assert.equal(pressed('mouse 0'), true, '"Mouse 0" is the string for mouse 0')
    assert.equal(pressed.mouseButton(0), true, 'mouseButton() function works correctly')
    assert.throws(() => { pressed.mouseButton('mouse 0') }, 'mouseButton() just works with ints')
    pressed.add(2)
    assert.equal(pressed.some(0, 1, 2, 3), true, 'some() works as expected with mouse buttns')
    assert.equal(pressed.every('mouse 0', 'mouse 2'), true, 'every() works as expected with mouse buttns')
    pressed.remove(0)
    assert.equal(pressed(0), false, 'Remove works properly for mouse buttons')
    assert.equal(pressed.every('mouse 0', 'mouse 2'), false, 'every() works as expected with mouse buttns')
    pressed.remove(2)
    pressed.add(5) // Bogus mouse button
    assert.throws(() => { pressed('mouse 5') }, 'Mouse buttons 0-4 are the only ones supported (pressed()).')
    assert.throws(() => { pressed.mouseButton(5) }, 'Mouse buttons 0-4 are the only ones supported (mouseButton()).')
    pressed.add(65) // 'A'
    assert.throws(() => { pressed.mouseButton(65) }, 'mouseButton() just works with mouse buttons, not keys')
    pressed.stop(emitter)
    pressed.reset()
    assert.end()
  })

  test('pressed.reset()', (assert) => {
    assert.ok(pressed.reset instanceof Function, 'pressed.reset() is a function.')

    pressed.start(emitter)
    // hack list
    pressed.list[65] = true
    assert.equal(pressed(65), true, 'List is not empty.')
    pressed.reset()
    assert.equal(pressed(65), false, 'pressed.reset() clears the list.')
    pressed.stop(emitter)

    assert.end()
  })

  test('pressed.every()', (assert) => {
    assert.ok(pressed.every instanceof Function, 'pressed.every() is a function')
    assert.throws(() => pressed.every(), 'Throws an error if start() hasn\'t been called')

    pressed.start(emitter)
    // hack list
    vowels.map(key => { pressed.list[key] = true })
    assert.ok(pressed.every(...vowels), 'pressed.every() is true when all values are down')
    delete pressed.list[65]
    assert.notOk(pressed.every(...vowels), 'pressed.every() is false if any values are not down')

    pressed.reset()
    pressed.list[91] = true // cmd or windows
    pressed.list[16] = true // shift
    assert.ok(pressed.every('shift', 'cmd'), 'pressed.every() works with modifier keys')

    pressed.stop(emitter)

    assert.end()
  })

  test('pressed.listAllKeyCodes()', (assert) => {
    assert.ok(pressed.listAllKeyCodes instanceof Function, 'pressed.listAllKeyCodes() is a function')

    pressed.start(emitter)
    // hack list
    vowels.map(key => { pressed.list[key] = true })
    assert.deepEqual(pressed.listAllKeyCodes(), vowels, 'listAllKeyCodes() returns an array of all key codes down')
    delete pressed.list[65]
    assert.deepEqual(pressed.listAllKeyCodes(), vowels.slice(1), 'listAllKeyCodes() returns an array of all key codes down')
    pressed.reset()
    assert.deepEqual(pressed.listAllKeyCodes(), [], 'listAllKeyCodes() returns an array of all key codes down')
    pressed.stop(emitter)

    assert.end()
  })

  test('pressed.listAllKeys()', (assert) => {
    assert.ok(pressed.listAllKeys instanceof Function, 'pressed.listAllKeys() is a function')

    pressed.start(emitter)
    // hack list
    vowels.map(key => { pressed.list[key] = true })
    assert.deepEqual(pressed.listAllKeys(), ['a', 'e', 'i', 'o', 'u'], 'listAllKeys() returns an array of all key strings down')
    delete pressed.list[65]
    assert.deepEqual(pressed.listAllKeys(), ['e', 'i', 'o', 'u'], 'listAllKeys() returns an array of all key strings down')
    pressed.reset()
    assert.deepEqual(pressed.listAllKeys(), [], 'listAllKeys() returns an array of all key strings down')
    pressed.list[91] = true
    assert.deepEqual(pressed.listAllKeys(), ['left command'], 'listAllKeys() returns the official version of keys with multiple strings based on `keycode()` package.')

    pressed.stop(emitter)

    assert.end()
  })

  test('pressed.some()', (assert) => {
    assert.ok(pressed.some instanceof Function, 'pressed.some() is a function')
    assert.throws(() => pressed.some(), 'Throws an error if start() hasn\'t been called')

    pressed.start(emitter)
    // hack list
    pressed.list[65] = true
    assert.ok(pressed.some(...vowels), 'pressed.some() is true when any of the keys are down')
    assert.notOk(pressed.some('f'), 'pressed.some() is false if none of the values are down. Works with strings')

    pressed.reset()
    pressed.list[91] = true // cmd or windows
    pressed.list[16] = true // shift
    assert.ok(pressed.some('shift'), 'pressed.some() works with modifier keys')
    pressed.stop(emitter)

    assert.end()
  })

  test('pressed.list', (assert) => {
    assert.ok(pressed.list instanceof Object, 'pressed.list is an Object')
    assert.end()
  })

  test('pressed.add() and pressed.remove()', (assert) => {
    assert.ok(pressed.add instanceof Function, 'pressed.add() is a function for manually adding codes')
    assert.equal(pressed.listAllKeyCodes().length, 0, 'Ensure list is empty.')
    pressed.add(65)
    assert.equal(pressed.listAllKeyCodes()[0], 65, 'Added 65 manually')

    assert.ok(pressed.remove instanceof Function, 'pressed.remove() is a function for manually removing codes')
    pressed.remove('a')
    assert.equal(pressed.listAllKeyCodes().length, 0, 'Ensure list is empty. Strings work too.')

    pressed.add('A', 'B', 'C')
    assert.equal(pressed.listAllKeyCodes().length, 3, 'Add mulitple keys with one call.')
    pressed.remove(65, 66, 67)
    assert.equal(pressed.listAllKeyCodes().length, 0, 'Remove mulitple keys with one call')

    assert.end()
  })

  module.end()
})
