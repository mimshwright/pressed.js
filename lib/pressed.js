'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keycode = require('keycode');

var _keycode2 = _interopRequireDefault(_keycode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var list = {};
var isListening = false;

var LEFT_COMMAND_STRING = 'left command';
var LEFT_COMMAND = 91;
var RIGHT_COMMAND = 93;

var pressed = function pressed(key) {
  checkForListener();
  var checkList = function checkList(key) {
    return list[key] !== undefined;
  };

  if (typeof key === 'string') {
    var code = (0, _keycode2.default)(key);
    if (isNaN(code)) {
      throw new Error(key + ' is not a supported key name.');
    }

    // Special case for modifier key strings:
    // String representations of command should return true when either the
    // Left or Right Command key is pressed (unless the side is specified).
    if (code === 91) {
      if (key !== LEFT_COMMAND_STRING) {
        return checkList(LEFT_COMMAND) || checkList(RIGHT_COMMAND);
      }
    }
    key = code;
  }

  if (isNaN(key)) {
    throw new Error('`key` must be either an integer key code or a string.');
  }

  return checkList(key);
};

pressed.key = function (key) {
  return pressed(key);
};

pressed.every = function () {
  for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
    keys[_key] = arguments[_key];
  }

  checkForListener();

  return keys.reduce(function (defined, key) {
    return defined && pressed(key);
  }, true);
};

pressed.some = function () {
  for (var _len2 = arguments.length, keys = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    keys[_key2] = arguments[_key2];
  }

  checkForListener();

  return keys.reduce(function (defined, key) {
    return defined || pressed(key);
  }, false);
};

pressed.listAllKeys = function () {
  return Object.keys(list).map(function (key) {
    return parseInt(key);
  });
};

pressed.start = function (eventEmitter) {
  if (!isListening) {
    if (!eventEmitter && undefined !== window) {
      eventEmitter = window;
    }
    if (!eventEmitter.addEventListener || !eventEmitter.removeEventListener) {
      throw new Error('Could not find a valid `eventEmitter` object (usually window). This code will not work outside of a browser environment (i.e. in node) unless you provide a valid object with addEventListener and removeEventListener that dispatches `keydown` and `keyup` events.');
    }
    eventEmitter.addEventListener('keydown', onKeyDown);
    eventEmitter.addEventListener('keyup', onKeyUp);
    eventEmitter.addEventListener('blur', onBlur);
    pressed.reset();
    isListening = true;
  }
};

pressed.reset = function () {
  list = {};
  pressed.list = list;
};

var onKeyDown = function onKeyDown(event) {
  list[event.keyCode] = true;
};
var onKeyUp = function onKeyUp(event) {
  delete list[event.keyCode];
};
var onBlur = function onBlur(event) {
  pressed.reset();
};

pressed.stop = function (eventEmitter) {
  if (isListening) {
    if (!eventEmitter && undefined !== window) {
      eventEmitter = window;
    }
    if (eventEmitter.removeEventListener) {
      eventEmitter.removeEventListener('keydown', onKeyDown);
      eventEmitter.removeEventListener('keyup', onKeyUp);
      eventEmitter.removeEventListener('blur', onBlur);
      pressed.reset();
      isListening = false;
    }
  }
};

pressed.isListening = function () {
  return isListening;
};

var checkForListener = function checkForListener() {
  if (!isListening) {
    throw new Error('Key listener is not running. You must run pressed.start() to initialize the tracker.');
  }
};

exports.default = pressed;
