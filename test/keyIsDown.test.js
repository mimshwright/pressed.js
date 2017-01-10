import test from 'tape-catch'
import keyIsDown from '../src/keyIsDown'

let vowels = [65, 69, 73, 79, 85]
let emitter = { addEventListener: () => {}, removeEventListener: () => {} }

test('Module:keyIsDown', (module) => {
  test('keyIsDown.isListening() and keyIsDown.start() and keyIsDown.stop()', (assert) => {
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
    keyIsDown.list[65] = true
    assert.equal(keyIsDown(65), true, 'When key is down, it returns true')
    delete keyIsDown.list[65]
    assert.equal(keyIsDown(65), false, 'Keys removed properly.')
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
    vowels.map(key => keyIsDown.list[key] = true)
    assert.ok(keyIsDown.all(...vowels), 'keyIsDown.all() is true when all values are down')
    delete keyIsDown.list[65]
    assert.notOk(keyIsDown.all(...vowels), 'keyIsDown.all() is false if any values are not down')
    keyIsDown.stop(emitter)

    assert.end()
  })

  test('keyIsDown.any()', (assert) => {
    assert.ok(keyIsDown.any instanceof Function, 'keyIsDown.any() is a function')
    assert.throws(() => keyIsDown.any(), 'Throws an error if start() hasn\'t been called')

    keyIsDown.start(emitter)
    keyIsDown.stop(emitter)

    assert.end()
  })

  test('keyIsDown.list', (assert) => {
    assert.ok(keyIsDown.list instanceof Object, 'keyIsDown.list is an Object')
    assert.end()
  })

  module.end()
})
