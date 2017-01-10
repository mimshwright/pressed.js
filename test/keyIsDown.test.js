import test from 'tape-catch'
import keyIsDown from '../src/keyIsDown'

let vowels = [65, 69, 73, 79, 85]
let emitter = { addEventListener: () => {}, removeEventListener: () => {} }

test('Module:keyIsDown', (module) => {
  test('keyIsDown.isListening(), keyIsDown.start() and keyIsDown.stop()', (assert) => {
    assert.ok(keyIsDown.isListening instanceof Function, 'keyIsDown.isListening() is a function')
    assert.equals(keyIsDown.isListening(), false, 'keyIsDown.isListening() is false by default')

    assert.ok(keyIsDown.start instanceof Function, 'start() is a function')
    assert.throws(() => keyIsDown.start(), 'Should throw if not run in an environment with a window object.')
    assert.doesNotThrow(() => keyIsDown.start(emitter), 'Shouldn\'t throw if a valid window object is provided.')
    assert.equals(keyIsDown.isListening(), true, 'isListening() will return true if running.')

    assert.ok(keyIsDown.stop instanceof Function, 'stop() is a function')
    // assert.doesNotThrow(() => keyIsDown.stop(), 'Unlike start(), will not throw if not run in an environment with a window object.')
    assert.equals(keyIsDown.isListening(), true, 'However, isListening() won\'t be set to false.')
    assert.doesNotThrow(() => keyIsDown.stop(emitter), 'Shouldn\'t throw if a valid window object is provided.')
    assert.equals(keyIsDown.isListening(), false, 'isListening() will be set to false.')

    assert.end()
  })

  test('keyIsDown()', (assert) => {
    assert.ok(keyIsDown instanceof Function, 'keyIsDown() is a function')
    assert.throws(() => keyIsDown(), 'keyIsDown() throws an error if start() hasn\'t been called')

    keyIsDown.start(emitter)
    assert.equal(keyIsDown(65), false, 'By default, nothing down.')
    keyIsDown.list[65] = true // A
    assert.equal(keyIsDown(65), true, 'When key is down, it returns true')
    assert.equal(keyIsDown('a'), true, 'Use strings or keycodes!')
    keyIsDown.resetList()
    assert.equal(keyIsDown(65), false, 'Keys removed properly.')

    keyIsDown.list[49] = true // 1
    assert.equal(keyIsDown(49), true, 'Keycode for number works.')
    assert.equal(keyIsDown(1), false, 'Beware! Digits 0-9 are treated as keycodes.')
    assert.equal(keyIsDown('1'), true, 'Wrapping digits 0-9 in quotes solves the issue.')
    keyIsDown.resetList()

    keyIsDown.list[91] = true // cmd or windows
    assert.equal(keyIsDown(91), true, 'Keycode for modifier key works.')
    assert.equal(keyIsDown(93), false, 'Keycode for right modifier key doesn\'t work.')
    assert.equal(keyIsDown('cmd'), true, 'String representation of modifier keys works.')
    assert.equal(keyIsDown('⌘'), true, 'Symbol representation of modifier keys works.')
    keyIsDown.resetList()

    keyIsDown.list[93] = true // right cmd or windows
    assert.equal(keyIsDown('⌘'), false, 'String representation of modifier keys default to left key.')
    assert.equal(keyIsDown('left command'), false, 'Left command doesn\'t register right command key.')
    assert.equal(keyIsDown('right command'), true, 'Right command does register right command key.')

    assert.throws(() => keyIsDown({}), 'keyIsDown() throws an error if parameter isn\'t a string or number.')
    assert.throws(() => keyIsDown('BOGUS KEY'), 'Bogus key name throws.')
    assert.doesNotThrow(() => keyIsDown(99999), 'Bogus key code doesn\'t throw because it\'s hard to tell what\'s bogus!')

    keyIsDown.stop(emitter)

    assert.end()
  })

  test('keyIsDown.resetList()', (assert) => {
    assert.ok(keyIsDown.resetList instanceof Function, 'keyIsDown.resetList() is a function.')

    keyIsDown.start(emitter)
    // hack list
    keyIsDown.list = {'65': true}
    keyIsDown.resetList()
    assert.equal(keyIsDown(65), false, 'keyIsDown.resetList() clears the list.')
    keyIsDown.stop(emitter)

    assert.end()
  })

  test('keyIsDown.all()', (assert) => {
    assert.ok(keyIsDown.all instanceof Function, 'keyIsDown.all() is a function')
    assert.throws(() => keyIsDown.all(), 'Throws an error if start() hasn\'t been called')

    keyIsDown.start(emitter)
    // hack list
    vowels.map(key => { keyIsDown.list[key] = true })
    assert.ok(keyIsDown.all(...vowels), 'keyIsDown.all() is true when all values are down')
    delete keyIsDown.list[65]
    assert.notOk(keyIsDown.all(...vowels), 'keyIsDown.all() is false if any values are not down')

    keyIsDown.resetList()
    keyIsDown.list[91] = true // cmd or windows
    keyIsDown.list[16] = true // shift
    assert.ok(keyIsDown.all('shift', 'cmd'), 'keyIsDown.all() works with modifier keys')

    keyIsDown.stop(emitter)

    assert.end()
  })

  test('keyIsDown.listAllKeys()', (assert) => {
    assert.ok(keyIsDown.listAllKeys instanceof Function, 'keyIsDown.listAllKeys() is a function')

    keyIsDown.start(emitter)
    // hack list
    vowels.map(key => { keyIsDown.list[key] = true })
    assert.deepEquals(keyIsDown.listAllKeys(), vowels, 'listAllKeys() returns an array of all keys down')
    delete keyIsDown.list[65]
    assert.deepEquals(keyIsDown.listAllKeys(), vowels.slice(1), 'listAllKeys() returns an array of all keys down')
    keyIsDown.resetList()
    assert.deepEquals(keyIsDown.listAllKeys(), [], 'listAllKeys() returns an array of all keys down')
    keyIsDown.stop(emitter)

    assert.end()
  })

  test('keyIsDown.any()', (assert) => {
    assert.ok(keyIsDown.any instanceof Function, 'keyIsDown.any() is a function')
    assert.throws(() => keyIsDown.any(), 'Throws an error if start() hasn\'t been called')

    keyIsDown.start(emitter)
    // hack list
    keyIsDown.list[65] = true
    assert.ok(keyIsDown.any(...vowels), 'keyIsDown.any() is true when all values are down')
    assert.notOk(keyIsDown.any('f'), 'keyIsDown.any() is false if none of the values are down. Works with strings')

    keyIsDown.resetList()
    keyIsDown.list[91] = true // cmd or windows
    keyIsDown.list[16] = true // shift
    assert.ok(keyIsDown.any('shift'), 'keyIsDown.any() works with modifier keys')
    keyIsDown.stop(emitter)

    assert.end()
  })

  test('keyIsDown.list', (assert) => {
    assert.ok(keyIsDown.list instanceof Object, 'keyIsDown.list is an Object')
    assert.end()
  })

  module.end()
})
