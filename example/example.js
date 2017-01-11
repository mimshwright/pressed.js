/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _pressed = __webpack_require__(1);
	
	var _pressed2 = _interopRequireDefault(_pressed);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_pressed2.default.start();
	
	var pressedKeyList = document.getElementById('pressedKeyList');
	var pressedKeyCodeList = document.getElementById('pressedKeyCodeList');
	var every = document.getElementById('every');
	var some = document.getElementById('some');
	var leftCommand = document.getElementById('leftCommand');
	var anyCommand = document.getElementById('anyCommand');
	
	function onFrame() {
	  // console.log(pressed.list);
	  var waitingString = '❌';
	  var detectedString = '✅ ';
	
	  var downKeys = _pressed2.default.listAllKeys();
	  var downKeyCodes = _pressed2.default.listAllKeyCodes();
	
	  pressedKeyList.innerHTML = downKeys.length ? detectedString + downKeys.join(', ') : waitingString;
	  pressedKeyCodeList.innerHTML = downKeyCodes.length ? detectedString + downKeyCodes.join(', ') : waitingString;
	
	  every.innerHTML = _pressed2.default.every('L', 'shift') ? detectedString + 'Combo!' : waitingString;
	
	  some.innerHTML = _pressed2.default.some('a', 'e', 'i', 'o', 'u') ? detectedString + 'Vowel detected.' : waitingString;
	
	  leftCommand.innerHTML = (0, _pressed2.default)('left command') ? detectedString + 'Left Meta Key pressed!' : waitingString;
	  anyCommand.innerHTML = _pressed2.default.some('command') ? detectedString + 'Meta Key pressed!' : waitingString;
	
	  window.requestAnimationFrame(onFrame);
	}
	window.requestAnimationFrame(onFrame);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _keycode = __webpack_require__(2);
	
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
	
	pressed.listAllKeyCodes = function () {
	  return Object.keys(list).map(function (key) {
	    return parseInt(key);
	  });
	};
	pressed.listAllKeys = function () {
	  return pressed.listAllKeyCodes().map(_keycode2.default);
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

/***/ },
/* 2 */
/***/ function(module, exports) {

	// Source: http://jsfiddle.net/vWx8V/
	// http://stackoverflow.com/questions/5603195/full-list-of-javascript-keycodes
	
	/**
	 * Conenience method returns corresponding value for given keyName or keyCode.
	 *
	 * @param {Mixed} keyCode {Number} or keyName {String}
	 * @return {Mixed}
	 * @api public
	 */
	
	exports = module.exports = function(searchInput) {
	  // Keyboard Events
	  if (searchInput && 'object' === typeof searchInput) {
	    var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode
	    if (hasKeyCode) searchInput = hasKeyCode
	  }
	
	  // Numbers
	  if ('number' === typeof searchInput) return names[searchInput]
	
	  // Everything else (cast to string)
	  var search = String(searchInput)
	
	  // check codes
	  var foundNamedKey = codes[search.toLowerCase()]
	  if (foundNamedKey) return foundNamedKey
	
	  // check aliases
	  var foundNamedKey = aliases[search.toLowerCase()]
	  if (foundNamedKey) return foundNamedKey
	
	  // weird character?
	  if (search.length === 1) return search.charCodeAt(0)
	
	  return undefined
	}
	
	/**
	 * Get by name
	 *
	 *   exports.code['enter'] // => 13
	 */
	
	var codes = exports.code = exports.codes = {
	  'backspace': 8,
	  'tab': 9,
	  'enter': 13,
	  'shift': 16,
	  'ctrl': 17,
	  'alt': 18,
	  'pause/break': 19,
	  'caps lock': 20,
	  'esc': 27,
	  'space': 32,
	  'page up': 33,
	  'page down': 34,
	  'end': 35,
	  'home': 36,
	  'left': 37,
	  'up': 38,
	  'right': 39,
	  'down': 40,
	  'insert': 45,
	  'delete': 46,
	  'command': 91,
	  'left command': 91,
	  'right command': 93,
	  'numpad *': 106,
	  'numpad +': 107,
	  'numpad -': 109,
	  'numpad .': 110,
	  'numpad /': 111,
	  'num lock': 144,
	  'scroll lock': 145,
	  'my computer': 182,
	  'my calculator': 183,
	  ';': 186,
	  '=': 187,
	  ',': 188,
	  '-': 189,
	  '.': 190,
	  '/': 191,
	  '`': 192,
	  '[': 219,
	  '\\': 220,
	  ']': 221,
	  "'": 222
	}
	
	// Helper aliases
	
	var aliases = exports.aliases = {
	  'windows': 91,
	  '⇧': 16,
	  '⌥': 18,
	  '⌃': 17,
	  '⌘': 91,
	  'ctl': 17,
	  'control': 17,
	  'option': 18,
	  'pause': 19,
	  'break': 19,
	  'caps': 20,
	  'return': 13,
	  'escape': 27,
	  'spc': 32,
	  'pgup': 33,
	  'pgdn': 34,
	  'ins': 45,
	  'del': 46,
	  'cmd': 91
	}
	
	
	/*!
	 * Programatically add the following
	 */
	
	// lower case chars
	for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32
	
	// numbers
	for (var i = 48; i < 58; i++) codes[i - 48] = i
	
	// function keys
	for (i = 1; i < 13; i++) codes['f'+i] = i + 111
	
	// numpad keys
	for (i = 0; i < 10; i++) codes['numpad '+i] = i + 96
	
	/**
	 * Get by code
	 *
	 *   exports.name[13] // => 'Enter'
	 */
	
	var names = exports.names = exports.title = {} // title for backward compat
	
	// Create reverse mapping
	for (i in codes) names[codes[i]] = i
	
	// Add aliases
	for (var alias in aliases) {
	  codes[alias] = aliases[alias]
	}


/***/ }
/******/ ]);
//# sourceMappingURL=example.js.map