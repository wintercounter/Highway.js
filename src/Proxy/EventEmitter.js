export default class EventEmitterProxy {

	Host = undefined

	constructor(EventEmitter){
		this.EventEmitter = EventEmitter
	}

	postMessage(message = {}){
		this.EventEmitter.emit('highway-message', message)
	}

	addEventListener(handler){
		this.EventEmitter.on('highway-message', handler)
	}

	removeEventListener(handler){
		this.EventEmitter.removeEventListener('highway-message', handler)
	}
}