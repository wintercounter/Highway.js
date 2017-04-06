export default class IframeProxy {

	constructor(Sender, Receiver) {
		this.Sender = Sender;
		this.Receiver = Receiver;
	}

	postMessage(message) {
		this.Receiver.postMessage(message, '*');
	}

	addEventListener(handler) {
		this.Sender.addEventListener('message', handler);
	}

	removeEventListener(handler) {
		this.Sender.removeEventListener('message', handler);
	}
}