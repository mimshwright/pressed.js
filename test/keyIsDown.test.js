import test from 'tape-catch'
import keyIsDown from '../src/keyIsDown'

test('keyIsDown', (module) => {
  test('keyIsDown()', (assert) => {
    assert.ok(keyIsDown instanceof Function, "keyIsDown() is a function")
    assert.end()
  })

  test('keyIsDown.all()', (assert) => {
    assert.ok(keyIsDown.all instanceof Function, "keyIsDown.all() is a function")
    assert.end()
  })

  test('keyIsDown.any()', (assert) => {
    assert.ok(keyIsDown.any instanceof Function, "keyIsDown.any() is a function")
    assert.end()
  })

  test('keyIsDown.list', (assert) => {
    assert.ok(keyIsDown.list instanceof Array, "keyIsDown.list is an Array")
    assert.end()
  })

  module.end()
})
