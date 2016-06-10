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