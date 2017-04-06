'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IframeProxy = function () {
	function IframeProxy(Sender, Receiver) {
		_classCallCheck(this, IframeProxy);

		this.Sender = Sender;
		this.Receiver = Receiver;
	}

	_createClass(IframeProxy, [{
		key: 'postMessage',
		value: function postMessage(message) {
			this.Receiver.postMessage(message, '*');
		}
	}, {
		key: 'addEventListener',
		value: function addEventListener(handler) {
			this.Sender.addEventListener('message', handler);
		}
	}, {
		key: 'removeEventListener',
		value: function removeEventListener(handler) {
			this.Sender.removeEventListener('message', handler);
		}
	}]);

	return IframeProxy;
}();

exports.default = IframeProxy;