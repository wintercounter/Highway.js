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
  * @constructor
  * @param Proxy
  */


	/**
  * Proxy object
  * @static
  */
	function Highway() {
		var Proxy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self;

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


	/**
  * Bucket to store handlers
  * @type {{*: {handlers: Array}}}
  */


	_createClass(Highway, [{
		key: 'pub',
		value: function pub(name) {
			var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
			var state = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

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
			var one = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

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
			var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

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
			this.Proxy.removeEventListener(this.handler);
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
			this.Proxy.addEventListener(this.handler);
			this.sub(EV_EXECUTE, function (ev) {
				new Function(ev.data).call(self);
			});
		}

		/**
   * Returns an already binded handler,
   * so this handler can be used to remove event listener.
   * @returns {*}
   */

	}, {
		key: '_handler',


		/**
   * onMessage callback handler
   * @param ev {WorkerEvent}
   * @private
   */
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
	}, {
		key: 'handler',
		get: function get() {
			this.__handler = this.__handler || this._handler.bind(this);
			return this.__handler;
		}
	}]);

	return Highway;
}();

exports.default = Highway;