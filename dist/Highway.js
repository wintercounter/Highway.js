(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

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
  * Host object
  * @static
  */


	/**
  * Bucket to store handlers
  * @type {{*: {handlers: Array}}}
  */


	/**
  * @constructor
  * @param Host {Window || Worker}
  */

	function Highway() {
		var Host = arguments.length <= 0 || arguments[0] === undefined ? self : arguments[0];

		_classCallCheck(this, Highway);

		this.Host = Host;
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

			this.Host.postMessage({ name: name, data: data, state: state }, this.Host === self.window ? self.location.origin : undefined);
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
			this.Host.removeEventListener('message', this._handler.bind(this));
			delete this.Bucket;
		}

		/**
   * Resets Bucket to default
   */

	}, {
		key: 'reset',
		value: function reset() {
			DEFAULT_BUCKET['*'].handlers = [];
			this.Bucket = Object.assign({}, DEFAULT_BUCKET);
		}

		/**
   * Add message listener to the host
   * @private
   */

	}, {
		key: '_bind',
		value: function _bind() {
			this.Host.addEventListener('message', this._handler.bind(this));
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

// Make Highway globally available


exports.default = Highway;
self.Highway = Highway;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXEhpZ2h3YXkuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNJQSxJQUFNLFlBQVksSUFBWjs7Ozs7O0FBTU4sSUFBTSxpQkFBaUI7QUFDdEIsTUFBSztBQUNKLFlBQVUsRUFBVjtFQUREO0NBREs7Ozs7OztBQVVOLElBQU0sYUFBYSxXQUFiOzs7Ozs7SUFLZTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCcEIsVUFsQm9CLE9Ba0JwQixHQUF5QjtNQUFiLDZEQUFPLG9CQUFNOzt3QkFsQkwsU0FrQks7O0FBQ3hCLE9BQUssSUFBTCxHQUFjLElBQWQsQ0FEd0I7QUFFeEIsT0FBSyxLQUFMLEdBRndCO0FBR3hCLE9BQUssS0FBTCxHQUh3QjtFQUF6Qjs7Ozs7Ozs7Ozs7Y0FsQm9COztzQkErQmhCLE1BQTJDO09BQXJDLDZEQUFPLHlCQUE4QjtPQUFuQiw4REFBUSx5QkFBVzs7QUFDOUMsUUFBSyxJQUFMLENBQVUsV0FBVixDQUNDLEVBQUMsVUFBRCxFQUFPLFVBQVAsRUFBYSxZQUFiLEVBREQsRUFFQyxLQUFLLElBQUwsS0FBYyxLQUFLLE1BQUwsR0FBYyxLQUFLLFFBQUwsQ0FBYyxNQUFkLEdBQXVCLFNBQW5ELENBRkQsQ0FEOEM7QUFLOUMsVUFBTyxJQUFQLENBTDhDOzs7Ozs7Ozs7Ozs7O3NCQWUzQyxNQUFNLFNBQXNCO09BQWIsNERBQU0scUJBQU87OztBQUUvQixXQUFRLEdBQVIsR0FBYyxHQUFkOzs7QUFGK0IsT0FLM0IsT0FBTyxLQUFLLE1BQUwsQ0FMb0I7QUFNL0IsUUFBSyxLQUFMLENBQVcsU0FBWCxFQUFzQixPQUF0QixDQUE4QixVQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFhO0FBQzFDLFFBQUksQ0FBQyxLQUFLLGNBQUwsQ0FBb0IsQ0FBcEIsQ0FBRCxFQUF5QjtBQUM1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RUFBZ0I7QUFDMUMsU0FBRyxJQUFILENBQVEsSUFBUixFQUFjLEdBQUcsSUFBSCxDQUFkLENBRDBDO0FBRTFDLFNBQUcsR0FBSCxJQUFVLElBQUksTUFBSixDQUFXLENBQVgsRUFBYyxDQUFkLENBQVYsQ0FGMEM7TUFBaEIsQ0FEM0IsQ0FINEM7S0FBN0MsTUFTSztBQUNKLFlBQU8sSUFBUCxDQURJO0tBVEw7SUFEcUMsQ0FBdEMsQ0FMWTs7OztRQTdJTzs7Ozs7OztBQW9LckIsS0FBSyxPQUFMLEdBQWUsT0FBZiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIERlbGltaXRlciB0byBzcGxpdCBldmVudCByb3V0ZXNcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmNvbnN0IERFTElNSVRFUiA9ICctPidcblxuLyoqXG4gKiBEZWZhdWx0IGJ1Y2tldCBwcm90b3R5cGVcbiAqIEB0eXBlIHt7Kjoge2hhbmRsZXJzOiBBcnJheX19fVxuICovXG5jb25zdCBERUZBVUxUX0JVQ0tFVCA9IHtcblx0JyonOiB7XG5cdFx0aGFuZGxlcnM6IFtdXG5cdH1cbn1cblxuLyoqXG4gKiAnZXhlJyBtZXRob2QgZXZlbnQgbmFtZVxuICogQHR5cGUge1N0cmluZ31cbiAqL1xuY29uc3QgRVZfRVhFQ1VURSA9ICdIV0VYRUNVVEUnXG5cbi8qKlxuICogTWFpbiBIaWdod2F5IEpTIGNsYXNzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhpZ2h3YXkge1xuXG5cdC8qKlxuXHQgKiBIb3N0IG9iamVjdFxuXHQgKiBAc3RhdGljXG5cdCAqL1xuXHRIb3N0XG5cblx0LyoqXG5cdCAqIEJ1Y2tldCB0byBzdG9yZSBoYW5kbGVyc1xuXHQgKiBAdHlwZSB7eyo6IHtoYW5kbGVyczogQXJyYXl9fX1cblx0ICovXG5cdEJ1Y2tldFxuXG5cdC8qKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICogQHBhcmFtIEhvc3Qge1dpbmRvdyB8fCBXb3JrZXJ9XG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihIb3N0ID0gc2VsZikge1xuXHRcdHRoaXMuSG9zdCAgID0gSG9zdFxuXHRcdHRoaXMucmVzZXQoKVxuXHRcdHRoaXMuX2JpbmQoKVxuXHR9XG5cblx0LyoqXG5cdCAqIFB1Ymxpc2ggYW4gZXZlbnRcblx0ICogQHBhcmFtIG5hbWUgIHtTdHJpbmd9IFRoZSBldmVudCdzIG5hbWVcblx0ICogQHBhcmFtIGRhdGEgIFtNaXhlZF0gIEN1c3RvbSBldmVudCBkYXRhXG5cdCAqIEBwYXJhbSBzdGF0ZSBbU3RyaW5nXSBPcHRpb25hbCBzdGF0ZSBpZGVudGlmaWVyXG5cdCAqIEByZXR1cm5zIHtIaWdod2F5fVxuXHQgKi9cblx0cHViKG5hbWUsIGRhdGEgPSB1bmRlZmluZWQsIHN0YXRlID0gdW5kZWZpbmVkKSB7XG5cdFx0dGhpcy5Ib3N0LnBvc3RNZXNzYWdlKFxuXHRcdFx0e25hbWUsIGRhdGEsIHN0YXRlfSxcblx0XHRcdHRoaXMuSG9zdCA9PT0gc2VsZi53aW5kb3cgPyBzZWxmLmxvY2F0aW9uLm9yaWdpbiA6IHVuZGVmaW5lZFxuXHRcdClcblx0XHRyZXR1cm4gdGhpc1xuXHR9XG5cblx0LyoqXG5cdCAqIFN1YnNjcmliZSB0byBhbiBldmVudFxuXHQgKiBAcGFyYW0gbmFtZSAgICB7U3RyaW5nfSAgIFRoZSBldmVudCdzIG5hbWVcblx0ICogQHBhcmFtIGhhbmRsZXIge0Z1bmN0aW9ufSBDYWxsYmFjayBmdW5jdGlvblxuXHQgKiBAcGFyYW0gb25lICAgICB7Qm9vbGVhbn0gIFJ1biBvbmNlLCB0aGVuIG9mZj9cblx0ICogQHJldHVybnMge0hpZ2h3YXl9XG5cdCAqL1xuXHRzdWIobmFtZSwgaGFuZGxlciwgb25lID0gZmFsc2UpIHtcblx0XHQvLyBBcHBseSBvbmUgcHJvcFxuXHRcdGhhbmRsZXIub25lID0gb25lXG5cblx0XHQvLyBBcHBseSBzZWdtZW50cyBhbmQgcHJvdG90eXBlXG5cdFx0bGV0IHRlbXAgPSB0aGlzLkJ1Y2tldFxuXHRcdG5hbWUuc3BsaXQoREVMSU1JVEVSKS5mb3JFYWNoKChrLCBpLCBhKSA9PiB7XG5cdFx0XHRpZiAoIXRlbXAuaGFzT3duUHJvcGVydHkoaykpIHtcblx0XHRcdFx0dGVtcFtrXSA9IHtcblx0XHRcdFx0XHRoYW5kbGVyczogW11cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGVtcCA9IHRlbXBba107XG5cdFx0XHQrK2kgPT09IGEubGVuZ3RoICYmIHRlbXAuaGFuZGxlcnMucHVzaChoYW5kbGVyKVxuXHRcdH0pXG5cblx0XHQvLyBNYWtlIGl0IGNoYWluYWJsZVxuXHRcdHJldHVybiB0aGlzXG5cdH1cblxuXHQvKipcblx0ICogU2hvcnRoYW5kIHRvIHN1YnNjcmliZSBvbmNlXG5cdCAqIEBwYXJhbSAgIC4uLmEgPSB0aGlzLnN1YiBhcmdzXG5cdCAqIEByZXR1cm5zIHtIaWdod2F5fVxuXHQgKi9cblx0b25lKC4uLmEpe1xuXHRcdHRoaXMuc3ViKC4uLmEsIHRydWUpXG5cdFx0cmV0dXJuIHRoaXNcblx0fVxuXG5cdC8qKlxuXHQgKiBVbnN1YnNjcmliZSBmcm9tIGFuIGV2ZW50XG5cdCAqIEBwYXJhbSAgIG5hbWUgICAgICB7U3RyaW5nfSBOYW1lIG9mIHRoZSBldmVudFxuXHQgKiBAcGFyYW0gICBoYW5kbGVyICAge0Z1bmN0aW9ufHVuZGVmaW5lZHxCb29sZWFufSBIYW5kbGVyIHRvIHJlbW92ZSB8IFJlbW92ZSBhbGwgZm9yIHRoaXMgZXZlbnQgbmFtZSB8IHRydWU6IERlZXAgcmVtb3ZlXG5cdCAqIEByZXR1cm5zIHtIaWdod2F5fVxuXHQgKi9cblx0b2ZmKG5hbWUsIGhhbmRsZXIgPSB1bmRlZmluZWQpIHtcblx0XHRsZXQgdGVtcCA9IHRoaXMuQnVja2V0XG5cblx0XHRuYW1lLnNwbGl0KERFTElNSVRFUikuZm9yRWFjaCgoaywgaSwgYSkgPT4ge1xuXHRcdFx0aWYgKHRlbXAuaGFzT3duUHJvcGVydHkoaykpIHtcblx0XHRcdFx0aWYgKGhhbmRsZXIgPT09IHRydWUgJiYgayA9PT0gYVthLmxlbmd0aC0xXSkge1xuXHRcdFx0XHRcdGRlbGV0ZSB0ZW1wW2tdXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dGVtcCA9IHRlbXBba107XG5cdFx0XHRcdFx0dGVtcC5oYW5kbGVycyA9IHRlbXAuaGFuZGxlcnMuZmlsdGVyKChmbikgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuICEoZm4gPT09IGhhbmRsZXIgfHwgaGFuZGxlciA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdHJldHVybiB0aGlzXG5cdH1cblxuXHQvKipcblx0ICogRXhlY3V0ZSBhIGZ1bmN0aW9uIG9uIHRoZSBvdGhlciBzaWRlLlxuXHQgKiBAcGFyYW0gZm4ge0Z1bmN0aW9ufSBUaGUgZnVuY3Rpb24gdG8gZXhlY3V0ZS5cblx0ICovXG5cdGV4ZShmbil7XG5cdFx0dGhpcy5wdWIoRVZfRVhFQ1VURSwgZm4udG9TdHJpbmcoKS5tYXRjaCgvZnVuY3Rpb25bXntdK1xceyhbXFxzXFxTXSopfSQvKVsxXSlcblx0fVxuXG5cdC8qKlxuXHQgKiBEZXN0cm95IHRoZSBmdWxsIEhpZ2h3YXkgaW5zdGFuY2Vcblx0ICovXG5cdGRlc3Ryb3koKSB7XG5cdFx0dGhpcy5Ib3N0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCA6OnRoaXMuX2hhbmRsZXIpXG5cdFx0ZGVsZXRlIHRoaXMuQnVja2V0XG5cdH1cblxuXHQvKipcblx0ICogUmVzZXRzIEJ1Y2tldCB0byBkZWZhdWx0XG5cdCAqL1xuXHRyZXNldCgpe1xuXHRcdERFRkFVTFRfQlVDS0VUWycqJ10uaGFuZGxlcnMgPSBbXVxuXHRcdHRoaXMuQnVja2V0ID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9CVUNLRVQpXG5cdH1cblxuXHQvKipcblx0ICogQWRkIG1lc3NhZ2UgbGlzdGVuZXIgdG8gdGhlIGhvc3Rcblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9iaW5kKCkge1xuXHRcdHRoaXMuSG9zdC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgOjp0aGlzLl9oYW5kbGVyKVxuXHRcdHRoaXMuc3ViKEVWX0VYRUNVVEUsIGZ1bmN0aW9uKGV2KXtcblx0XHRcdChuZXcgRnVuY3Rpb24oZXYuZGF0YSkpLmNhbGwoc2VsZilcblx0XHR9KVxuXHR9XG5cblx0LyoqXG5cdCAqIG9uTWVzc2FnZSBjYWxsYmFjayBoYW5kbGVyXG5cdCAqIEBwYXJhbSBldiB7V29ya2VyRXZlbnR9XG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfaGFuZGxlcihldikge1xuXHRcdGxldCBwYXJzZWQgPSB0aGlzLkJ1Y2tldFxuXHRcdGxldCBub3BlID0gZmFsc2VcblxuXHRcdHBhcnNlZFsnKiddLmhhbmRsZXJzLmZvckVhY2goKGZuKSA9PiBmbi5jYWxsKG51bGwsIGV2LmRhdGEpKVxuXHRcdGV2LmRhdGEubmFtZS5zcGxpdChERUxJTUlURVIpLmZvckVhY2goKHNlZ21lbnQpID0+IHtcblx0XHRcdGlmICghbm9wZSAmJiBwYXJzZWQuaGFzT3duUHJvcGVydHkoc2VnbWVudCkpIHtcblx0XHRcdFx0cGFyc2VkID0gcGFyc2VkW3NlZ21lbnRdXG5cblx0XHRcdFx0cGFyc2VkLmhhbmRsZXJzLmxlbmd0aFxuXHRcdFx0XHQmJiBwYXJzZWQuaGFuZGxlcnMuZm9yRWFjaCgoZm4sIGksIGFycikgPT4ge1xuXHRcdFx0XHRcdGZuLmNhbGwobnVsbCwgZXYuZGF0YSlcblx0XHRcdFx0XHRmbi5vbmUgJiYgYXJyLnNwbGljZShpLCAxKVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdG5vcGUgPSB0cnVlXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxufVxuXG4vLyBNYWtlIEhpZ2h3YXkgZ2xvYmFsbHkgYXZhaWxhYmxlXG5zZWxmLkhpZ2h3YXkgPSBIaWdod2F5Il19
