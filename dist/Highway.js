(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DELIMITER = '->';

var Highway = function () {
	function Highway() {
		var Host = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];

		_classCallCheck(this, Highway);

		Highway.Host = Host || self;
		this._bind();
	}

	_createClass(Highway, [{
		key: 'pub',
		value: function pub(name, data) {
			var state = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

			Highway.Host.postMessage({ name: name, data: data, state: state }, self === window ? location.origin : Highway.Host);
			return this;
		}
	}, {
		key: 'sub',
		value: function sub(name, handler) {
			// Extract segments
			var segments = name.split(DELIMITER);

			// Apply segments and prototype
			var temp = Highway.Bucket;
			segments.forEach(function (k, i, a) {
				if (!temp.hasOwnProperty(k)) {
					temp[k] = {
						handlers: []
					};
				}
				temp = temp[k];
				++i === a.length && temp.handlers.push(handler);
			});
			return this;
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			Highway.Host.removeEventListener('message', this._handler.bind(this));
		}
	}, {
		key: '_bind',
		value: function _bind() {
			Highway.Host.addEventListener('message', this._handler.bind(this));
		}
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

					parsed.handlers.length && parsed.handlers.forEach(function (fn) {
						return fn.call(null, ev.data);
					});
				}
			});
		}
	}]);

	return Highway;
}();

Highway.Bucket = {
	'*': {
		handlers: []
	}
};
exports.default = Highway;


self.Highway = Highway;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXEhpZ2h3YXkuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztBQ0FBLElBQU0sWUFBWSxJQUFaOztJQUVlO0FBU3BCLFVBVG9CLE9BU3BCLEdBQTZCO01BQWpCLDZEQUFPLHlCQUFVOzt3QkFUVCxTQVNTOztBQUM1QixVQUFRLElBQVIsR0FBZSxRQUFRLElBQVIsQ0FEYTtBQUU1QixPQUFLLEtBQUwsR0FGNEI7RUFBN0I7O2NBVG9COztzQkFjaEIsTUFBTSxNQUF3QjtPQUFsQiw4REFBUSx5QkFBVTs7QUFDakMsV0FBUSxJQUFSLENBQWEsV0FBYixDQUF5QixFQUFDLFVBQUQsRUFBTyxVQUFQLEVBQWEsWUFBYixFQUF6QixFQUE4QyxTQUFTLE1BQVQsR0FBa0IsU0FBUyxNQUFULEdBQWtCLFFBQVEsSUFBUixDQUFsRixDQURpQztBQUVqQyxVQUFPLElBQVAsQ0FGaUM7Ozs7c0JBSzlCLE1BQU0sU0FBUTs7QUFFakIsT0FBSSxXQUFXLEtBQUssS0FBTCxDQUFXLFNBQVgsQ0FBWDs7O0FBRmEsT0FLYixPQUFPLFFBQVEsTUFBUixDQUxNO0FBTWpCLFlBQVMsT0FBVCxDQUFpQixVQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFhO0FBQzdCLFFBQUksQ0FBQyxLQUFLLGNBQUwsQ0FBb0IsQ0FBcEIsQ0FBRCxFQUF5QjtBQUM1QixVQUFLLENBQUwsSUFBVTtBQUNULGdCQUFVLEVBQVY7TUFERCxDQUQ0QjtLQUE3QjtBQUtBLFdBQU8sS0FBSyxDQUFMLENBQVAsQ0FONkI7QUFPN0IsTUFBRSxDQUFGLEtBQVEsRUFBRSxNQUFGLElBQVksS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixPQUFuQixDQUFwQixDQVA2QjtJQUFiLENBQWpCLENBTmlCO0FBZWpCLFVBQU8sSUFBUCxDQWZpQjs7Ozs0QkFrQlQ7QUFDUixXQUFRLElBQVIsQ0FBYSxtQkFBYixDQUFpQyxTQUFqQyxFQUE4QyxLQUFLLFFBQUwsV0FBOUMsRUFEUTs7OzswQkFJRjtBQUNOLFdBQVEsSUFBUixDQUFhLGdCQUFiLENBQThCLFNBQTlCLEVBQTJDLEtBQUssUUFBTCxXQUEzQyxFQURNOzs7OzJCQUlFLElBQUc7QUFDWCxPQUFJLFNBQVMsUUFBUSxNQUFSLENBREY7QUFFWCxVQUFPLEdBQVAsRUFBWSxRQUFaLENBQXFCLE9BQXJCLENBQTZCLFVBQUMsRUFBRDtXQUFRLEdBQUcsSUFBSCxDQUFRLElBQVIsRUFBYyxHQUFHLElBQUg7SUFBdEIsQ0FBN0IsQ0FGVztBQUdYLE1BQUcsSUFBSCxDQUFRLElBQVIsQ0FBYSxLQUFiLENBQW1CLFNBQW5CLEVBQThCLE9BQTlCLENBQXNDLFVBQUMsT0FBRCxFQUFhO0FBQ2xELFFBQUksT0FBTyxjQUFQLENBQXNCLE9BQXRCLENBQUosRUFBb0M7QUFDbkMsY0FBUyxPQUFPLE9BQVAsQ0FBVCxDQURtQzs7QUFHbkMsWUFBTyxRQUFQLENBQWdCLE1BQWhCLElBQ0csT0FBTyxRQUFQLENBQWdCLE9BQWhCLENBQXdCLFVBQUMsRUFBRDthQUFRLEdBQUcsSUFBSCxDQUFRLElBQVIsRUFBYyxHQUFHLElBQUg7TUFBdEIsQ0FEM0IsQ0FIbUM7S0FBcEM7SUFEcUMsQ0FBdEMsQ0FIVzs7OztRQTdDUTs7O1FBR2IsU0FBUztBQUNmLE1BQUs7QUFDSixZQUFVLEVBQVY7RUFERDs7a0JBSm1COzs7QUEyRHJCLEtBQUssT0FBTCxHQUFlLE9BQWYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgREVMSU1JVEVSID0gJy0+J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIaWdod2F5IHtcblxuXHRzdGF0aWMgSG9zdDtcblx0c3RhdGljIEJ1Y2tldCA9IHtcblx0XHQnKic6IHtcblx0XHRcdGhhbmRsZXJzOiBbXVxuXHRcdH1cblx0fTtcblxuXHRjb25zdHJ1Y3RvcihIb3N0ID0gdW5kZWZpbmVkKXtcblx0XHRIaWdod2F5Lkhvc3QgPSBIb3N0IHx8IHNlbGZcblx0XHR0aGlzLl9iaW5kKClcblx0fVxuXG5cdHB1YihuYW1lLCBkYXRhLCBzdGF0ZSA9IHVuZGVmaW5lZCl7XG5cdFx0SGlnaHdheS5Ib3N0LnBvc3RNZXNzYWdlKHtuYW1lLCBkYXRhLCBzdGF0ZX0sIHNlbGYgPT09IHdpbmRvdyA/IGxvY2F0aW9uLm9yaWdpbiA6IEhpZ2h3YXkuSG9zdClcblx0XHRyZXR1cm4gdGhpc1xuXHR9XG5cblx0c3ViKG5hbWUsIGhhbmRsZXIpe1xuXHRcdC8vIEV4dHJhY3Qgc2VnbWVudHNcblx0XHRsZXQgc2VnbWVudHMgPSBuYW1lLnNwbGl0KERFTElNSVRFUilcblxuXHRcdC8vIEFwcGx5IHNlZ21lbnRzIGFuZCBwcm90b3R5cGVcblx0XHRsZXQgdGVtcCA9IEhpZ2h3YXkuQnVja2V0XG5cdFx0c2VnbWVudHMuZm9yRWFjaCgoaywgaSwgYSkgPT4ge1xuXHRcdFx0aWYgKCF0ZW1wLmhhc093blByb3BlcnR5KGspKSB7XG5cdFx0XHRcdHRlbXBba10gPSB7XG5cdFx0XHRcdFx0aGFuZGxlcnM6IFtdXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRlbXAgPSB0ZW1wW2tdO1xuXHRcdFx0KytpID09PSBhLmxlbmd0aCAmJiB0ZW1wLmhhbmRsZXJzLnB1c2goaGFuZGxlcilcblx0XHR9KVxuXHRcdHJldHVybiB0aGlzXG5cdH1cblxuXHRkZXN0cm95KCl7XG5cdFx0SGlnaHdheS5Ib3N0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCA6OnRoaXMuX2hhbmRsZXIpXG5cdH1cblxuXHRfYmluZCgpe1xuXHRcdEhpZ2h3YXkuSG9zdC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgOjp0aGlzLl9oYW5kbGVyKVxuXHR9XG5cblx0X2hhbmRsZXIoZXYpe1xuXHRcdGxldCBwYXJzZWQgPSBIaWdod2F5LkJ1Y2tldFxuXHRcdHBhcnNlZFsnKiddLmhhbmRsZXJzLmZvckVhY2goKGZuKSA9PiBmbi5jYWxsKG51bGwsIGV2LmRhdGEpKVxuXHRcdGV2LmRhdGEubmFtZS5zcGxpdChERUxJTUlURVIpLmZvckVhY2goKHNlZ21lbnQpID0+IHtcblx0XHRcdGlmIChwYXJzZWQuaGFzT3duUHJvcGVydHkoc2VnbWVudCkpIHtcblx0XHRcdFx0cGFyc2VkID0gcGFyc2VkW3NlZ21lbnRdXG5cblx0XHRcdFx0cGFyc2VkLmhhbmRsZXJzLmxlbmd0aFxuXHRcdFx0XHQmJiBwYXJzZWQuaGFuZGxlcnMuZm9yRWFjaCgoZm4pID0+IGZuLmNhbGwobnVsbCwgZXYuZGF0YSkpXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxufVxuXG5zZWxmLkhpZ2h3YXkgPSBIaWdod2F5Il19
