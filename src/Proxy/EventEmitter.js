export default class EventEmitterProxy {

	Host = undefined

	constructor(EventEmitter){
		this.EventEmitter = EventEmitter
	}

	postMessage(message = {}){
		this.EventEmitter.emit('chambr-message', message)
	}

	addEventListener(handler){
		this.EventEmitter.on('chambr-message', handler)
	}

	removeEventListener(handler){
		this.EventEmitter.removeEventListener('chambr-message', handler)
	}
}