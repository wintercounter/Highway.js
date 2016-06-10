export default class WebWorkerProxy {

	Host = undefined

	constructor(Host){
		this.Host = Host
	}

	postMessage(message){
		this.Host.postMessage(message, this.Host.document ? self.location.origin : undefined)
	}

	addEventListener(handler){
		this.Host.addEventListener('message', handler)
	}

	removeEventListener(handler){
		this.Host.removeEventListener('message', handler)
	}
}