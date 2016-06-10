/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(4);


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Delimiter to split event routes
	 * @type {string}
	 */
	var DELIMITER = '->';

	/**
	 * Default bucket prototype
	 * @type {{*: {handlers: Array}}}
	 */
	var DEFAULT_BUCKET = {
		'*': {
			handlers: []
		}
	};

	/**
	 * 'exe' method event name
	 * @type {String}
	 */
	var EV_EXECUTE = 'HWEXECUTE';

	/**
	 * Main Highway JS class
	 */

	var Highway = function () {

		/**
	  * Proxy object
	  * @static
	  */


		/**
	  * Bucket to store handlers
	  * @type {{*: {handlers: Array}}}
	  */


		/**
	  * @constructor
	  * @param Proxy
	  */

		function Highway() {
			var Proxy = arguments.length <= 0 || arguments[0] === undefined ? self : arguments[0];

			_classCallCheck(this, Highway);

			this.Proxy = Proxy;
			this.reset();
			this._bind();
		}

		/**
	  * Publish an event
	  * @param name  {String} The event's name
	  * @param data  [Mixed]  Custom event data
	  * @param state [String] Optional state identifier
	  * @returns {Highway}
	  */


		_createClass(Highway, [{
			key: 'pub',
			value: function pub(name) {
				var data = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
				var state = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

				this.Proxy.postMessage({ name: name, data: data, state: state });
				return this;
			}

			/**
	   * Subscribe to an event
	   * @param name    {String}   The event's name
	   * @param handler {Function} Callback function
	   * @param one     {Boolean}  Run once, then off?
	   * @returns {Highway}
	   */

		}, {
			key: 'sub',
			value: function sub(name, handler) {
				var one = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

				// Apply one prop
				handler.one = one;

				// Apply segments and prototype
				var temp = this.Bucket;
				name.split(DELIMITER).forEach(function (k, i, a) {
					if (!temp.hasOwnProperty(k)) {
						temp[k] = {
							handlers: []
						};
					}
					temp = temp[k];
					++i === a.length && temp.handlers.push(handler);
				});

				// Make it chainable
				return this;
			}

			/**
	   * Shorthand to subscribe once
	   * @param   ...a = this.sub args
	   * @returns {Highway}
	   */

		}, {
			key: 'one',
			value: function one() {
				for (var _len = arguments.length, a = Array(_len), _key = 0; _key < _len; _key++) {
					a[_key] = arguments[_key];
				}

				this.sub.apply(this, a.concat([true]));
				return this;
			}

			/**
	   * Unsubscribe from an event
	   * @param   name      {String} Name of the event
	   * @param   handler   {Function|undefined|Boolean} Handler to remove | Remove all for this event name | true: Deep remove
	   * @returns {Highway}
	   */

		}, {
			key: 'off',
			value: function off(name) {
				var handler = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

				var temp = this.Bucket;

				name.split(DELIMITER).forEach(function (k, i, a) {
					if (temp.hasOwnProperty(k)) {
						if (handler === true && k === a[a.length - 1]) {
							delete temp[k];
						} else {
							temp = temp[k];
							temp.handlers = temp.handlers.filter(function (fn) {
								return !(fn === handler || handler === undefined);
							});
						}
					}
				});
				return this;
			}

			/**
	   * Execute a function on the other side.
	   * @param fn {Function} The function to execute.
	   */

		}, {
			key: 'exe',
			value: function exe(fn) {
				this.pub(EV_EXECUTE, fn.toString().match(/function[^{]+\{([\s\S]*)}$/)[1]);
			}

			/**
	   * Destroy the full Highway instance
	   */

		}, {
			key: 'destroy',
			value: function destroy() {
				this.Proxy.removeEventListener(this._handler.bind(this));
				delete this.Bucket;
			}

			/**
	   * Resets Bucket to default
	   */

		}, {
			key: 'reset',
			value: function reset() {
				DEFAULT_BUCKET['*'].handlers = [];
				this.Bucket = _extends({}, DEFAULT_BUCKET);
			}

			/**
	   * Add message listener to the host
	   * @private
	   */

		}, {
			key: '_bind',
			value: function _bind() {
				this.Proxy.addEventListener(this._handler.bind(this));
				this.sub(EV_EXECUTE, function (ev) {
					new Function(ev.data).call(self);
				});
			}

			/**
	   * onMessage callback handler
	   * @param ev {WorkerEvent}
	   * @private
	   */

		}, {
			key: '_handler',
			value: function _handler(ev) {
				var parsed = this.Bucket;
				var nope = false;

				parsed['*'].handlers.forEach(function (fn) {
					return fn.call(null, ev.data);
				});
				ev.data.name.split(DELIMITER).forEach(function (segment) {
					if (!nope && parsed.hasOwnProperty(segment)) {
						parsed = parsed[segment];

						parsed.handlers.length && parsed.handlers.forEach(function (fn, i, arr) {
							fn.call(null, ev.data);
							fn.one && arr.splice(i, 1);
						});
					} else {
						nope = true;
					}
				});
			}
		}]);

		return Highway;
	}();

	exports.default = Highway;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var WebWorkerProxy = function () {
		function WebWorkerProxy(Host) {
			_classCallCheck(this, WebWorkerProxy);

			this.Host = undefined;

			this.Host = Host;
		}

		_createClass(WebWorkerProxy, [{
			key: 'postMessage',
			value: function postMessage(message) {
				this.Host.postMessage(message, this.Host.document ? self.location.origin : undefined);
			}
		}, {
			key: 'addEventListener',
			value: function addEventListener(handler) {
				this.Host.addEventListener('message', handler);
			}
		}, {
			key: 'removeEventListener',
			value: function removeEventListener(handler) {
				this.Host.removeEventListener('message', handler);
			}
		}]);

		return WebWorkerProxy;
	}();

	exports.default = WebWorkerProxy;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Highway = __webpack_require__(2);

	var _Highway2 = _interopRequireDefault(_Highway);

	var _WebWorker = __webpack_require__(3);

	var _WebWorker2 = _interopRequireDefault(_WebWorker);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	self.HW = self.HW || new _Highway2.default(new _WebWorker2.default(self));

	self.InitWorker = function () {
		self.HW.off('*');
		self.HW.sub('*', function (ev) {
			ev.name[0] !== 'W' && self.HW.pub('W->' + ev.name);
		});
	};

	self.importScripts && self.InitWorker();

/***/ }
/******/ ]);