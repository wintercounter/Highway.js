const DELIMITER = '->'

export default class Highway {

	static Host;
	static Bucket = {
		'*': {
			handlers: []
		}
	};

	constructor(Host = undefined){
		Highway.Host = Host || self
		this._bind()
	}

	pub(name, data, state = undefined){
		Highway.Host.postMessage({name, data, state}, self === window ? location.origin : Highway.Host)
		return this
	}

	sub(name, handler){
		// Extract segments
		let segments = name.split(DELIMITER)

		// Apply segments and prototype
		let temp = Highway.Bucket
		segments.forEach((k, i, a) => {
			if (!temp.hasOwnProperty(k)) {
				temp[k] = {
					handlers: []
				}
			}
			temp = temp[k];
			++i === a.length && temp.handlers.push(handler)
		})
		return this
	}

	destroy(){
		Highway.Host.removeEventListener('message', ::this._handler)
	}

	_bind(){
		Highway.Host.addEventListener('message', ::this._handler)
	}

	_handler(ev){
		let parsed = Highway.Bucket
		parsed['*'].handlers.forEach((fn) => fn.call(null, ev.data))
		ev.data.name.split(DELIMITER).forEach((segment) => {
			if (parsed.hasOwnProperty(segment)) {
				parsed = parsed[segment]

				parsed.handlers.length
				&& parsed.handlers.forEach((fn) => fn.call(null, ev.data))
			}
		})
	}
}

self.Highway = Highway