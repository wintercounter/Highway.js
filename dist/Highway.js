(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DELIMITER = '->';
var DEFAULT_BUCKET = {
	'*': {
		handlers: []
	}
};

var Highway = function () {

	/**
  * @constructor
  * @param Host {Window || Worker}
  */


	/**
  * Host object
  * @static
  */

	function Highway() {
		var Host = arguments.length <= 0 || arguments[0] === undefined ? self : arguments[0];

		_classCallCheck(this, Highway);

		Highway.Host = Host;
		Highway.Bucket = Object.assign({}, DEFAULT_BUCKET);
		this._bind();
	}

	/**
  * Publish an event
  * @param name  {String} The event's name
  * @param data  {Object} Custom event data
  * @param state [String] Optional state identifier
  * @returns {Highway}
  */


	/**
  * Bucket to store handlers
  * @type {{*: {handlers: Array}}}
  */


	_createClass(Highway, [{
		key: 'pub',
		value: function pub(name, data) {
			var state = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

			Highway.Host.postMessage({ name: name, data: data, state: state }, self === window ? location.origin : Highway.Host);
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
			var temp = Highway.Bucket;
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

			var temp = Highway.Bucket;

			name.split(DELIMITER).forEach(function (k, i, a) {
				if (temp.hasOwnProperty(k)) {
					if (handler === true && k === a[a.length - 1]) {
						delete temp[k];
					} else {
						temp = temp[k];
						temp.handlers && temp.handlers.forEach(function (hd, ind, arr) {
							(hd === handler || handler === undefined) && arr.splice(ind, 1);
						});
					}
				}
			});
			return this;
		}

		/**
   * Destroy the full Highway instance
   */

	}, {
		key: 'destroy',
		value: function destroy() {
			Highway.Host.removeEventListener('message', this._handler.bind(this));
		}

		/**
   * Add message listener to the host
   * @private
   */

	}, {
		key: '_bind',
		value: function _bind() {
			Highway.Host.addEventListener('message', this._handler.bind(this));
		}

		/**
   * onMessage callback handler
   * @param ev {WorkerEvent}
   * @private
   */

	}, {
		key: '_handler',
		value: function _handler(ev) {
			var parsed = Highway.Bucket;
			parsed['*'].handlers.forEach(function (fn) {
				return fn.call(null, ev.data);
			});
			ev.data.name.split(DELIMITER).forEach(function (segment) {
				if (parsed.hasOwnProperty(segment)) {
					parsed = parsed[segment];

					parsed.handlers.length && parsed.handlers.forEach(function (fn, i, arr) {
						fn.call(null, ev.data);
						fn.one && arr.splice(i, 1);
					});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXEhpZ2h3YXkuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztBQ0FBLElBQU0sWUFBWSxJQUFaO0FBQ04sSUFBTSxpQkFBaUI7QUFDdEIsTUFBSztBQUNKLFlBQVUsRUFBVjtFQUREO0NBREs7O0lBTWU7Ozs7Ozs7Ozs7Ozs7QUFrQnBCLFVBbEJvQixPQWtCcEIsR0FBeUI7TUFBYiw2REFBTyxvQkFBTTs7d0JBbEJMLFNBa0JLOztBQUN4QixVQUFRLElBQVIsR0FBaUIsSUFBakIsQ0FEd0I7QUFFeEIsVUFBUSxNQUFSLEdBQWlCLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBa0IsY0FBbEIsQ0FBakIsQ0FGd0I7QUFHeEIsT0FBSyxLQUFMLEdBSHdCO0VBQXpCOzs7Ozs7Ozs7Ozs7Ozs7OztjQWxCb0I7O3NCQStCaEIsTUFBTSxNQUF5QjtPQUFuQiw4REFBUSx5QkFBVzs7QUFDbEMsV0FBUSxJQUFSLENBQWEsV0FBYixDQUF5QixFQUFDLFVBQUQsRUFBTyxVQUFQLEVBQWEsWUFBYixFQUF6QixFQUE4QyxTQUFTLE1BQVQsR0FBa0IsU0FBUyxNQUFULEdBQWtCLFFBQVEsSUFBUixDQUFsRixDQURrQztBQUVsQyxVQUFPLElBQVAsQ0FGa0M7Ozs7Ozs7Ozs7Ozs7c0JBWS9CLE1BQU0sU0FBc0I7T0FBYiw0REFBTSxxQkFBTzs7O0FBRS9CLFdBQVEsR0FBUixHQUFjLEdBQWQ7OztBQUYrQixPQUszQixPQUFPLFFBQVEsTUFBUixDQUxvQjtBQU0vQixRQUFLLEtBQUwsQ0FBVyxTQUFYLEVBQXNCLE9BQXRCLENBQThCLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQWE7QUFDMUMsUUFBSSxDQUFDLEtBQUssY0FBTCxDQUFvQixDQUFwQixDQUFELEVBQXlCO0FBQzVCLFVBQUssQ0FBTCxJQUFVO0FBQ1QsZ0JBQVUsRUFBVjtNQURELENBRDRCO0tBQTdCO0FBS0EsV0FBTyxLQUFLLENBQUwsQ0FBUCxDQU4wQztBQU8xQyxNQUFFLENBQUYsS0FBUSxFQUFFLE1BQUYsSUFBWSxLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLE9BQW5CLENBQXBCLENBUDBDO0lBQWIsQ0FBOUI7OztBQU4rQixVQWlCeEIsSUFBUCxDQWpCK0I7Ozs7Ozs7Ozs7O3dCQXlCdkI7cUNBQUY7O0lBQUU7O0FBQ1IsUUFBSyxHQUFMLGFBQVksVUFBRyxNQUFmLEVBRFE7QUFFUixVQUFPLElBQVAsQ0FGUTs7Ozs7Ozs7Ozs7O3NCQVdMLE1BQTJCO09BQXJCLGdFQUFVLHlCQUFXOztBQUM5QixPQUFJLE9BQU8sUUFBUSxNQUFSLENBRG1COztBQUc5QixRQUFLLEtBQUwsQ0FBVyxTQUFYLEVBQXNCLE9BQXRCLENBQThCLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQWE7QUFDMUMsUUFBSSxLQUFLLGNBQUwsQ0FBb0IsQ0FBcEIsQ0FBSixFQUE0QjtBQUMzQixTQUFJLFlBQVksSUFBWixJQUFvQixNQUFNLEVBQUUsRUFBRSxNQUFGLEdBQVMsQ0FBVCxDQUFSLEVBQXFCO0FBQzVDLGFBQU8sS0FBSyxDQUFMLENBQVAsQ0FENEM7TUFBN0MsTUFHSztBQUNKLGFBQU8sS0FBSyxDQUFMLENBQVAsQ0FESTtBQUVKLFdBQUssUUFBTCxJQUFpQixLQUFLLFFBQUwsQ0FBYyxPQUFkLENBQXNCLFVBQUMsRUFBRCxFQUFLLEdBQUwsRUFBVSxHQUFWLEVBQWtCO0FBQ3hELFFBQUMsT0FBTyxPQUFQLElBQWtCLFlBQVksU0FBWixDQUFuQixJQUE2QyxJQUFJLE1BQUosQ0FBVyxHQUFYLEVBQWdCLENBQWhCLENBQTdDLENBRHdEO09BQWxCLENBQXZDLENBRkk7TUFITDtLQUREO0lBRDZCLENBQTlCLENBSDhCO0FBZ0I5QixVQUFPLElBQVAsQ0FoQjhCOzs7Ozs7Ozs7NEJBc0JyQjtBQUNULFdBQVEsSUFBUixDQUFhLG1CQUFiLENBQWlDLFNBQWpDLEVBQThDLEtBQUssUUFBTCxXQUE5QyxFQURTOzs7Ozs7Ozs7OzBCQVFGO0FBQ1AsV0FBUSxJQUFSLENBQWEsZ0JBQWIsQ0FBOEIsU0FBOUIsRUFBMEMsS0FBSyxRQUFMLFdBQTFDLEVBRE87Ozs7Ozs7Ozs7OzJCQVNDLElBQUk7QUFDWixPQUFJLFNBQVMsUUFBUSxNQUFSLENBREQ7QUFFWixVQUFPLEdBQVAsRUFBWSxRQUFaLENBQXFCLE9BQXJCLENBQTZCLFVBQUMsRUFBRDtXQUFRLEdBQUcsSUFBSCxDQUFRLElBQVIsRUFBYyxHQUFHLElBQUg7SUFBdEIsQ0FBN0IsQ0FGWTtBQUdaLE1BQUcsSUFBSCxDQUFRLElBQVIsQ0FBYSxLQUFiLENBQW1CLFNBQW5CLEVBQThCLE9BQTlCLENBQXNDLFVBQUMsT0FBRCxFQUFhO0FBQ2xELFFBQUksT0FBTyxjQUFQLENBQXNCLE9BQXRCLENBQUosRUFBb0M7QUFDbkMsY0FBUyxPQUFPLE9BQVAsQ0FBVCxDQURtQzs7QUFHbkMsWUFBTyxRQUFQLENBQWdCLE1BQWhCLElBQ0csT0FBTyxRQUFQLENBQWdCLE9BQWhCLENBQXdCLFVBQUMsRUFBRCxFQUFLLENBQUwsRUFBUSxHQUFSLEVBQWdCO0FBQzFDLFNBQUcsSUFBSCxDQUFRLElBQVIsRUFBYyxHQUFHLElBQUgsQ0FBZCxDQUQwQztBQUUxQyxTQUFHLEdBQUgsSUFBVSxJQUFJLE1BQUosQ0FBVyxDQUFYLEVBQWMsQ0FBZCxDQUFWLENBRjBDO01BQWhCLENBRDNCLENBSG1DO0tBQXBDO0lBRHFDLENBQXRDLENBSFk7Ozs7UUF0SE87Ozs7Ozs7QUF3SXJCLEtBQUssT0FBTCxHQUFlLE9BQWYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgREVMSU1JVEVSID0gJy0+J1xuY29uc3QgREVGQVVMVF9CVUNLRVQgPSB7XG5cdCcqJzoge1xuXHRcdGhhbmRsZXJzOiBbXVxuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIaWdod2F5IHtcblxuXHQvKipcblx0ICogSG9zdCBvYmplY3Rcblx0ICogQHN0YXRpY1xuXHQgKi9cblx0c3RhdGljIEhvc3RcblxuXHQvKipcblx0ICogQnVja2V0IHRvIHN0b3JlIGhhbmRsZXJzXG5cdCAqIEB0eXBlIHt7Kjoge2hhbmRsZXJzOiBBcnJheX19fVxuXHQgKi9cblx0c3RhdGljIEJ1Y2tldFxuXG5cdC8qKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICogQHBhcmFtIEhvc3Qge1dpbmRvdyB8fCBXb3JrZXJ9XG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihIb3N0ID0gc2VsZikge1xuXHRcdEhpZ2h3YXkuSG9zdCAgID0gSG9zdFxuXHRcdEhpZ2h3YXkuQnVja2V0ID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9CVUNLRVQpXG5cdFx0dGhpcy5fYmluZCgpXG5cdH1cblxuXHQvKipcblx0ICogUHVibGlzaCBhbiBldmVudFxuXHQgKiBAcGFyYW0gbmFtZSAge1N0cmluZ30gVGhlIGV2ZW50J3MgbmFtZVxuXHQgKiBAcGFyYW0gZGF0YSAge09iamVjdH0gQ3VzdG9tIGV2ZW50IGRhdGFcblx0ICogQHBhcmFtIHN0YXRlIFtTdHJpbmddIE9wdGlvbmFsIHN0YXRlIGlkZW50aWZpZXJcblx0ICogQHJldHVybnMge0hpZ2h3YXl9XG5cdCAqL1xuXHRwdWIobmFtZSwgZGF0YSwgc3RhdGUgPSB1bmRlZmluZWQpIHtcblx0XHRIaWdod2F5Lkhvc3QucG9zdE1lc3NhZ2Uoe25hbWUsIGRhdGEsIHN0YXRlfSwgc2VsZiA9PT0gd2luZG93ID8gbG9jYXRpb24ub3JpZ2luIDogSGlnaHdheS5Ib3N0KVxuXHRcdHJldHVybiB0aGlzXG5cdH1cblxuXHQvKipcblx0ICogU3Vic2NyaWJlIHRvIGFuIGV2ZW50XG5cdCAqIEBwYXJhbSBuYW1lICAgIHtTdHJpbmd9ICAgVGhlIGV2ZW50J3MgbmFtZVxuXHQgKiBAcGFyYW0gaGFuZGxlciB7RnVuY3Rpb259IENhbGxiYWNrIGZ1bmN0aW9uXG5cdCAqIEBwYXJhbSBvbmUgICAgIHtCb29sZWFufSAgUnVuIG9uY2UsIHRoZW4gb2ZmP1xuXHQgKiBAcmV0dXJucyB7SGlnaHdheX1cblx0ICovXG5cdHN1YihuYW1lLCBoYW5kbGVyLCBvbmUgPSBmYWxzZSkge1xuXHRcdC8vIEFwcGx5IG9uZSBwcm9wXG5cdFx0aGFuZGxlci5vbmUgPSBvbmVcblxuXHRcdC8vIEFwcGx5IHNlZ21lbnRzIGFuZCBwcm90b3R5cGVcblx0XHRsZXQgdGVtcCA9IEhpZ2h3YXkuQnVja2V0XG5cdFx0bmFtZS5zcGxpdChERUxJTUlURVIpLmZvckVhY2goKGssIGksIGEpID0+IHtcblx0XHRcdGlmICghdGVtcC5oYXNPd25Qcm9wZXJ0eShrKSkge1xuXHRcdFx0XHR0ZW1wW2tdID0ge1xuXHRcdFx0XHRcdGhhbmRsZXJzOiBbXVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0ZW1wID0gdGVtcFtrXTtcblx0XHRcdCsraSA9PT0gYS5sZW5ndGggJiYgdGVtcC5oYW5kbGVycy5wdXNoKGhhbmRsZXIpXG5cdFx0fSlcblxuXHRcdC8vIE1ha2UgaXQgY2hhaW5hYmxlXG5cdFx0cmV0dXJuIHRoaXNcblx0fVxuXG5cdC8qKlxuXHQgKiBTaG9ydGhhbmQgdG8gc3Vic2NyaWJlIG9uY2Vcblx0ICogQHBhcmFtICAgLi4uYSA9IHRoaXMuc3ViIGFyZ3Ncblx0ICogQHJldHVybnMge0hpZ2h3YXl9XG5cdCAqL1xuXHRvbmUoLi4uYSl7XG5cdFx0dGhpcy5zdWIoLi4uYSwgdHJ1ZSlcblx0XHRyZXR1cm4gdGhpc1xuXHR9XG5cblx0LyoqXG5cdCAqIFVuc3Vic2NyaWJlIGZyb20gYW4gZXZlbnRcblx0ICogQHBhcmFtICAgbmFtZSAgICAgIHtTdHJpbmd9IE5hbWUgb2YgdGhlIGV2ZW50XG5cdCAqIEBwYXJhbSAgIGhhbmRsZXIgICB7RnVuY3Rpb258dW5kZWZpbmVkfEJvb2xlYW59IEhhbmRsZXIgdG8gcmVtb3ZlIHwgUmVtb3ZlIGFsbCBmb3IgdGhpcyBldmVudCBuYW1lIHwgdHJ1ZTogRGVlcCByZW1vdmVcblx0ICogQHJldHVybnMge0hpZ2h3YXl9XG5cdCAqL1xuXHRvZmYobmFtZSwgaGFuZGxlciA9IHVuZGVmaW5lZCkge1xuXHRcdGxldCB0ZW1wID0gSGlnaHdheS5CdWNrZXRcblxuXHRcdG5hbWUuc3BsaXQoREVMSU1JVEVSKS5mb3JFYWNoKChrLCBpLCBhKSA9PiB7XG5cdFx0XHRpZiAodGVtcC5oYXNPd25Qcm9wZXJ0eShrKSkge1xuXHRcdFx0XHRpZiAoaGFuZGxlciA9PT0gdHJ1ZSAmJiBrID09PSBhW2EubGVuZ3RoLTFdKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIHRlbXBba11cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0ZW1wID0gdGVtcFtrXTtcblx0XHRcdFx0XHR0ZW1wLmhhbmRsZXJzICYmIHRlbXAuaGFuZGxlcnMuZm9yRWFjaCgoaGQsIGluZCwgYXJyKSA9PiB7XG5cdFx0XHRcdFx0XHQoaGQgPT09IGhhbmRsZXIgfHwgaGFuZGxlciA9PT0gdW5kZWZpbmVkKSAmJiBhcnIuc3BsaWNlKGluZCwgMSlcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHRyZXR1cm4gdGhpc1xuXHR9XG5cblx0LyoqXG5cdCAqIERlc3Ryb3kgdGhlIGZ1bGwgSGlnaHdheSBpbnN0YW5jZVxuXHQgKi9cblx0ZGVzdHJveSgpIHtcblx0XHRIaWdod2F5Lkhvc3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIDo6dGhpcy5faGFuZGxlcilcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGQgbWVzc2FnZSBsaXN0ZW5lciB0byB0aGUgaG9zdFxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2JpbmQoKSB7XG5cdFx0SGlnaHdheS5Ib3N0LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLDo6dGhpcy5faGFuZGxlcilcblx0fVxuXG5cdC8qKlxuXHQgKiBvbk1lc3NhZ2UgY2FsbGJhY2sgaGFuZGxlclxuXHQgKiBAcGFyYW0gZXYge1dvcmtlckV2ZW50fVxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2hhbmRsZXIoZXYpIHtcblx0XHRsZXQgcGFyc2VkID0gSGlnaHdheS5CdWNrZXRcblx0XHRwYXJzZWRbJyonXS5oYW5kbGVycy5mb3JFYWNoKChmbikgPT4gZm4uY2FsbChudWxsLCBldi5kYXRhKSlcblx0XHRldi5kYXRhLm5hbWUuc3BsaXQoREVMSU1JVEVSKS5mb3JFYWNoKChzZWdtZW50KSA9PiB7XG5cdFx0XHRpZiAocGFyc2VkLmhhc093blByb3BlcnR5KHNlZ21lbnQpKSB7XG5cdFx0XHRcdHBhcnNlZCA9IHBhcnNlZFtzZWdtZW50XVxuXG5cdFx0XHRcdHBhcnNlZC5oYW5kbGVycy5sZW5ndGhcblx0XHRcdFx0JiYgcGFyc2VkLmhhbmRsZXJzLmZvckVhY2goKGZuLCBpLCBhcnIpID0+IHtcblx0XHRcdFx0XHRmbi5jYWxsKG51bGwsIGV2LmRhdGEpXG5cdFx0XHRcdFx0Zm4ub25lICYmIGFyci5zcGxpY2UoaSwgMSlcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9KVxuXHR9XG59XG5cbi8vIE1ha2UgSGlnaHdheSBnbG9iYWxseSBhdmFpbGFibGVcbnNlbGYuSGlnaHdheSA9IEhpZ2h3YXkiXX0=
