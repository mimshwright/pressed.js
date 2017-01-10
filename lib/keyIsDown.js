(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.keyIsDown = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var list = {};
  var isListening = false;

  var keyIsDown = function keyIsDown(key) {
    checkForListener();

    return list[key] !== undefined;
  };

  keyIsDown.all = function () {
    for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
      keys[_key] = arguments[_key];
    }

    checkForListener();

    return keys.reduce(function (defined, key) {
      return defined && list[key] !== undefined;
    }, true);
  };

  keyIsDown.any = function () {
    for (var _len2 = arguments.length, keys = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      keys[_key2] = arguments[_key2];
    }

    checkForListener();

    return keys.reduce(function (defined, key) {
      return defined || list[key] !== undefined;
    }, false);
  };

  keyIsDown.start = function (eventEmitter) {
    if (!isListening) {
      if (!eventEmitter && undefined !== window) {
        eventEmitter = window;
      }
      if (!eventEmitter.addEventListener || !eventEmitter.removeEventListener) {
        throw new Error('Could not find a valid `eventEmitter` object (usually window). This code will not work outside of a browser environment (i.e. in node) unless you provide a valid object with addEventListener and removeEventListener that dispatches `keydown` and `keyup` events.');
      }
      eventEmitter.addEventListener('keydown', onKeyDown, false);
      eventEmitter.addEventListener('keyup', onKeyUp, false);
      eventEmitter.addEventListener('blur', onBlur, false);
      keyIsDown.resetList();
      isListening = true;
    }
  };

  keyIsDown.resetList = function () {
    list = {};
    keyIsDown.list = list;
  };

  var onKeyDown = function onKeyDown(event) {
    list[event.keyCode] = true;
  };
  var onKeyUp = function onKeyUp(event) {
    delete list[event.keyCode];
  };
  var onBlur = function onBlur(event) {
    keyIsDown.resetList();
  };

  keyIsDown.stop = function (eventEmitter) {
    if (isListening) {
      if (!eventEmitter && undefined !== window) {
        eventEmitter = window;
      }
      if (eventEmitter.removeEventListener) {
        eventEmitter.removeEventListener('keydown', onKeyDown);
        eventEmitter.removeEventListener('keyup', onKeyUp);
        eventEmitter.removeEventListener('blur', onBlur);
        keyIsDown.resetList();
        isListening = false;
      }
    }
  };

  keyIsDown.isListening = function () {
    return isListening;
  };

  var checkForListener = function checkForListener() {
    if (!isListening) {
      throw new Error('Key listener is not running. You must run keyIsDown.start() to initialize the tracker.');
    }
  };

  exports.default = keyIsDown;
});