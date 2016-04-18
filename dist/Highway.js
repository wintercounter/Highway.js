(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Highway = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

exports.default = Highway;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXEhpZ2h3YXkuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNJQSxJQUFNLFlBQVksSUFBWjs7Ozs7O0FBTU4sSUFBTSxpQkFBaUI7QUFDdEIsTUFBSztBQUNKLFlBQVUsRUFBVjtFQUREO0NBREs7Ozs7OztBQVVOLElBQU0sYUFBYSxXQUFiOzs7Ozs7SUFLZTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCcEIsVUFsQm9CLE9Ba0JwQixHQUF5QjtNQUFiLDZEQUFPLG9CQUFNOzt3QkFsQkwsU0FrQks7O0FBQ3hCLE9BQUssSUFBTCxHQUFZLElBQVosQ0FEd0I7QUFFeEIsT0FBSyxLQUFMLEdBRndCO0FBR3hCLE9BQUssS0FBTCxHQUh3QjtFQUF6Qjs7Ozs7Ozs7Ozs7Y0FsQm9COztzQkErQmhCLE1BQTJDO09BQXJDLDZEQUFPLHlCQUE4QjtPQUFuQiw4REFBUSx5QkFBVzs7QUFDOUMsUUFBSyxJQUFMLENBQVUsV0FBVixDQUNDLEVBQUMsVUFBRCxFQUFPLFVBQVAsRUFBYSxZQUFiLEVBREQsRUFFQyxLQUFLLElBQUwsS0FBYyxLQUFLLE1BQUwsR0FBYyxLQUFLLFFBQUwsQ0FBYyxNQUFkLEdBQXVCLFNBQW5ELENBRkQsQ0FEOEM7QUFLOUMsVUFBTyxJQUFQLENBTDhDOzs7Ozs7Ozs7Ozs7O3NCQWUzQyxNQUFNLFNBQXNCO09BQWIsNERBQU0scUJBQU87OztBQUUvQixXQUFRLEdBQVIsR0FBYyxHQUFkOzs7QUFGK0IsT0FLM0IsT0FBTyxLQUFLLE1BQUwsQ0FMb0I7QUFNL0IsUUFBSyxLQUFMLENBQVcsU0FBWCxFQUFzQixPQUF0QixDQUE4QixVQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFhO0FBQzFDLFFBQUksQ0FBQyxLQUFLLGNBQUwsQ0FBb0IsQ0FBcEIsQ0FBRCxFQUF5QjtBQUM1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RUFBZ0I7QUFDMUMsU0FBRyxJQUFILENBQVEsSUFBUixFQUFjLEdBQUcsSUFBSCxDQUFkLENBRDBDO0FBRTFDLFNBQUcsR0FBSCxJQUFVLElBQUksTUFBSixDQUFXLENBQVgsRUFBYyxDQUFkLENBQVYsQ0FGMEM7TUFBaEIsQ0FEM0IsQ0FINEM7S0FBN0MsTUFTSztBQUNKLFlBQU8sSUFBUCxDQURJO0tBVEw7SUFEcUMsQ0FBdEMsQ0FMWTs7OztRQTdJTyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIERlbGltaXRlciB0byBzcGxpdCBldmVudCByb3V0ZXNcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmNvbnN0IERFTElNSVRFUiA9ICctPidcblxuLyoqXG4gKiBEZWZhdWx0IGJ1Y2tldCBwcm90b3R5cGVcbiAqIEB0eXBlIHt7Kjoge2hhbmRsZXJzOiBBcnJheX19fVxuICovXG5jb25zdCBERUZBVUxUX0JVQ0tFVCA9IHtcblx0JyonOiB7XG5cdFx0aGFuZGxlcnM6IFtdXG5cdH1cbn1cblxuLyoqXG4gKiAnZXhlJyBtZXRob2QgZXZlbnQgbmFtZVxuICogQHR5cGUge1N0cmluZ31cbiAqL1xuY29uc3QgRVZfRVhFQ1VURSA9ICdIV0VYRUNVVEUnXG5cbi8qKlxuICogTWFpbiBIaWdod2F5IEpTIGNsYXNzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhpZ2h3YXkge1xuXG5cdC8qKlxuXHQgKiBIb3N0IG9iamVjdFxuXHQgKiBAc3RhdGljXG5cdCAqL1xuXHRIb3N0XG5cblx0LyoqXG5cdCAqIEJ1Y2tldCB0byBzdG9yZSBoYW5kbGVyc1xuXHQgKiBAdHlwZSB7eyo6IHtoYW5kbGVyczogQXJyYXl9fX1cblx0ICovXG5cdEJ1Y2tldFxuXG5cdC8qKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICogQHBhcmFtIEhvc3Qge1dpbmRvdyB8fCBXb3JrZXJ9XG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihIb3N0ID0gc2VsZikge1xuXHRcdHRoaXMuSG9zdCA9IEhvc3Rcblx0XHR0aGlzLnJlc2V0KClcblx0XHR0aGlzLl9iaW5kKClcblx0fVxuXG5cdC8qKlxuXHQgKiBQdWJsaXNoIGFuIGV2ZW50XG5cdCAqIEBwYXJhbSBuYW1lICB7U3RyaW5nfSBUaGUgZXZlbnQncyBuYW1lXG5cdCAqIEBwYXJhbSBkYXRhICBbTWl4ZWRdICBDdXN0b20gZXZlbnQgZGF0YVxuXHQgKiBAcGFyYW0gc3RhdGUgW1N0cmluZ10gT3B0aW9uYWwgc3RhdGUgaWRlbnRpZmllclxuXHQgKiBAcmV0dXJucyB7SGlnaHdheX1cblx0ICovXG5cdHB1YihuYW1lLCBkYXRhID0gdW5kZWZpbmVkLCBzdGF0ZSA9IHVuZGVmaW5lZCkge1xuXHRcdHRoaXMuSG9zdC5wb3N0TWVzc2FnZShcblx0XHRcdHtuYW1lLCBkYXRhLCBzdGF0ZX0sXG5cdFx0XHR0aGlzLkhvc3QgPT09IHNlbGYud2luZG93ID8gc2VsZi5sb2NhdGlvbi5vcmlnaW4gOiB1bmRlZmluZWRcblx0XHQpXG5cdFx0cmV0dXJuIHRoaXNcblx0fVxuXG5cdC8qKlxuXHQgKiBTdWJzY3JpYmUgdG8gYW4gZXZlbnRcblx0ICogQHBhcmFtIG5hbWUgICAge1N0cmluZ30gICBUaGUgZXZlbnQncyBuYW1lXG5cdCAqIEBwYXJhbSBoYW5kbGVyIHtGdW5jdGlvbn0gQ2FsbGJhY2sgZnVuY3Rpb25cblx0ICogQHBhcmFtIG9uZSAgICAge0Jvb2xlYW59ICBSdW4gb25jZSwgdGhlbiBvZmY/XG5cdCAqIEByZXR1cm5zIHtIaWdod2F5fVxuXHQgKi9cblx0c3ViKG5hbWUsIGhhbmRsZXIsIG9uZSA9IGZhbHNlKSB7XG5cdFx0Ly8gQXBwbHkgb25lIHByb3Bcblx0XHRoYW5kbGVyLm9uZSA9IG9uZVxuXG5cdFx0Ly8gQXBwbHkgc2VnbWVudHMgYW5kIHByb3RvdHlwZVxuXHRcdGxldCB0ZW1wID0gdGhpcy5CdWNrZXRcblx0XHRuYW1lLnNwbGl0KERFTElNSVRFUikuZm9yRWFjaCgoaywgaSwgYSkgPT4ge1xuXHRcdFx0aWYgKCF0ZW1wLmhhc093blByb3BlcnR5KGspKSB7XG5cdFx0XHRcdHRlbXBba10gPSB7XG5cdFx0XHRcdFx0aGFuZGxlcnM6IFtdXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRlbXAgPSB0ZW1wW2tdO1xuXHRcdFx0KytpID09PSBhLmxlbmd0aCAmJiB0ZW1wLmhhbmRsZXJzLnB1c2goaGFuZGxlcilcblx0XHR9KVxuXG5cdFx0Ly8gTWFrZSBpdCBjaGFpbmFibGVcblx0XHRyZXR1cm4gdGhpc1xuXHR9XG5cblx0LyoqXG5cdCAqIFNob3J0aGFuZCB0byBzdWJzY3JpYmUgb25jZVxuXHQgKiBAcGFyYW0gICAuLi5hID0gdGhpcy5zdWIgYXJnc1xuXHQgKiBAcmV0dXJucyB7SGlnaHdheX1cblx0ICovXG5cdG9uZSguLi5hKXtcblx0XHR0aGlzLnN1YiguLi5hLCB0cnVlKVxuXHRcdHJldHVybiB0aGlzXG5cdH1cblxuXHQvKipcblx0ICogVW5zdWJzY3JpYmUgZnJvbSBhbiBldmVudFxuXHQgKiBAcGFyYW0gICBuYW1lICAgICAge1N0cmluZ30gTmFtZSBvZiB0aGUgZXZlbnRcblx0ICogQHBhcmFtICAgaGFuZGxlciAgIHtGdW5jdGlvbnx1bmRlZmluZWR8Qm9vbGVhbn0gSGFuZGxlciB0byByZW1vdmUgfCBSZW1vdmUgYWxsIGZvciB0aGlzIGV2ZW50IG5hbWUgfCB0cnVlOiBEZWVwIHJlbW92ZVxuXHQgKiBAcmV0dXJucyB7SGlnaHdheX1cblx0ICovXG5cdG9mZihuYW1lLCBoYW5kbGVyID0gdW5kZWZpbmVkKSB7XG5cdFx0bGV0IHRlbXAgPSB0aGlzLkJ1Y2tldFxuXG5cdFx0bmFtZS5zcGxpdChERUxJTUlURVIpLmZvckVhY2goKGssIGksIGEpID0+IHtcblx0XHRcdGlmICh0ZW1wLmhhc093blByb3BlcnR5KGspKSB7XG5cdFx0XHRcdGlmIChoYW5kbGVyID09PSB0cnVlICYmIGsgPT09IGFbYS5sZW5ndGgtMV0pIHtcblx0XHRcdFx0XHRkZWxldGUgdGVtcFtrXVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHRlbXAgPSB0ZW1wW2tdO1xuXHRcdFx0XHRcdHRlbXAuaGFuZGxlcnMgPSB0ZW1wLmhhbmRsZXJzLmZpbHRlcigoZm4pID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiAhKGZuID09PSBoYW5kbGVyIHx8IGhhbmRsZXIgPT09IHVuZGVmaW5lZClcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHRyZXR1cm4gdGhpc1xuXHR9XG5cblx0LyoqXG5cdCAqIEV4ZWN1dGUgYSBmdW5jdGlvbiBvbiB0aGUgb3RoZXIgc2lkZS5cblx0ICogQHBhcmFtIGZuIHtGdW5jdGlvbn0gVGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUuXG5cdCAqL1xuXHRleGUoZm4pe1xuXHRcdHRoaXMucHViKEVWX0VYRUNVVEUsIGZuLnRvU3RyaW5nKCkubWF0Y2goL2Z1bmN0aW9uW157XStcXHsoW1xcc1xcU10qKX0kLylbMV0pXG5cdH1cblxuXHQvKipcblx0ICogRGVzdHJveSB0aGUgZnVsbCBIaWdod2F5IGluc3RhbmNlXG5cdCAqL1xuXHRkZXN0cm95KCkge1xuXHRcdHRoaXMuSG9zdC5yZW1vdmVFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgOjp0aGlzLl9oYW5kbGVyKVxuXHRcdGRlbGV0ZSB0aGlzLkJ1Y2tldFxuXHR9XG5cblx0LyoqXG5cdCAqIFJlc2V0cyBCdWNrZXQgdG8gZGVmYXVsdFxuXHQgKi9cblx0cmVzZXQoKXtcblx0XHRERUZBVUxUX0JVQ0tFVFsnKiddLmhhbmRsZXJzID0gW11cblx0XHR0aGlzLkJ1Y2tldCA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfQlVDS0VUKVxuXHR9XG5cblx0LyoqXG5cdCAqIEFkZCBtZXNzYWdlIGxpc3RlbmVyIHRvIHRoZSBob3N0XG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfYmluZCgpIHtcblx0XHR0aGlzLkhvc3QuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIDo6dGhpcy5faGFuZGxlcilcblx0XHR0aGlzLnN1YihFVl9FWEVDVVRFLCBmdW5jdGlvbihldil7XG5cdFx0XHQobmV3IEZ1bmN0aW9uKGV2LmRhdGEpKS5jYWxsKHNlbGYpXG5cdFx0fSlcblx0fVxuXG5cdC8qKlxuXHQgKiBvbk1lc3NhZ2UgY2FsbGJhY2sgaGFuZGxlclxuXHQgKiBAcGFyYW0gZXYge1dvcmtlckV2ZW50fVxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2hhbmRsZXIoZXYpIHtcblx0XHRsZXQgcGFyc2VkID0gdGhpcy5CdWNrZXRcblx0XHRsZXQgbm9wZSA9IGZhbHNlXG5cblx0XHRwYXJzZWRbJyonXS5oYW5kbGVycy5mb3JFYWNoKChmbikgPT4gZm4uY2FsbChudWxsLCBldi5kYXRhKSlcblx0XHRldi5kYXRhLm5hbWUuc3BsaXQoREVMSU1JVEVSKS5mb3JFYWNoKChzZWdtZW50KSA9PiB7XG5cdFx0XHRpZiAoIW5vcGUgJiYgcGFyc2VkLmhhc093blByb3BlcnR5KHNlZ21lbnQpKSB7XG5cdFx0XHRcdHBhcnNlZCA9IHBhcnNlZFtzZWdtZW50XVxuXG5cdFx0XHRcdHBhcnNlZC5oYW5kbGVycy5sZW5ndGhcblx0XHRcdFx0JiYgcGFyc2VkLmhhbmRsZXJzLmZvckVhY2goKGZuLCBpLCBhcnIpID0+IHtcblx0XHRcdFx0XHRmbi5jYWxsKG51bGwsIGV2LmRhdGEpXG5cdFx0XHRcdFx0Zm4ub25lICYmIGFyci5zcGxpY2UoaSwgMSlcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRub3BlID0gdHJ1ZVxuXHRcdFx0fVxuXHRcdH0pXG5cdH1cbn0iXX0=
