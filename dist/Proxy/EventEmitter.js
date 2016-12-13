'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitterProxy = function () {
	function EventEmitterProxy(EventEmitter) {
		_classCallCheck(this, EventEmitterProxy);

		this.Host = undefined;

		this.EventEmitter = EventEmitter;
	}

	_createClass(EventEmitterProxy, [{
		key: 'postMessage',
		value: function postMessage() {
			var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			this.EventEmitter.emit('highway-message', {
				data: message
			});
		}
	}, {
		key: 'addEventListener',
		value: function addEventListener(handler) {
			this.EventEmitter.on('highway-message', handler);
		}
	}, {
		key: 'removeEventListener',
		value: function removeEventListener(handler) {
			this.EventEmitter.removeEventListener('highway-message', handler);
		}
	}]);

	return EventEmitterProxy;
}();

exports.default = EventEmitterProxy;