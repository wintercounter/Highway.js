const DELIMITER = '->'
const DEFAULT_BUCKET = {
	'*': {
		handlers: []
	}
}

export default class Highway {

	/**
	 * Host object
	 * @static
	 */
	static Host

	/**
	 * Bucket to store handlers
	 * @type {{*: {handlers: Array}}}
	 */
	static Bucket

	/**
	 * @constructor
	 * @param Host {Window || Worker}
	 */
	constructor(Host = self) {
		Highway.Host   = Host
		Highway.Bucket = Object.assign({}, DEFAULT_BUCKET)
		this._bind()
	}

	/**
	 * Publish an event
	 * @param name  {String} The event's name
	 * @param data  {Object} Custom event data
	 * @param state [String] Optional state identifier
	 * @returns {Highway}
	 */
	pub(name, data, state = undefined) {
		Highway.Host.postMessage({name, data, state}, self === window ? location.origin : Highway.Host)
		return this
	}

	/**
	 * Subscribe to an event
	 * @param name    {String}   The event's name
	 * @param handler {Function} Callback function
	 * @param one     {Boolean}  Run once, then off?
	 * @returns {Highway}
	 */
	sub(name, handler, one = false) {
		// Apply one prop
		handler.one = one

		// Apply segments and prototype
		let temp = Highway.Bucket
		name.split(DELIMITER).forEach((k, i, a) => {
			if (!temp.hasOwnProperty(k)) {
				temp[k] = {
					handlers: []
				}
			}
			temp = temp[k];
			++i === a.length && temp.handlers.push(handler)
		})

		// Make it chainable
		return this
	}

	/**
	 * Shorthand to subscribe once
	 * @param   ...a = this.sub args
	 * @returns {Highway}
	 */
	one(...a){
		this.sub(...a, true)
		return this
	}

	/**
	 * Unsubscribe from an event
	 * @param   name      {String} Name of the event
	 * @param   handler   {Function|undefined|Boolean} Handler to remove | Remove all for this event name | true: Deep remove
	 * @returns {Highway}
	 */
	off(name, handler = undefined) {
		let temp = Highway.Bucket

		name.split(DELIMITER).forEach((k, i, a) => {
			if (temp.hasOwnProperty(k)) {
				if (handler === true && k === a[a.length-1]) {
					delete temp[k]
				}
				else {
					temp = temp[k];
					temp.handlers && temp.handlers.forEach((hd, ind, arr) => {
						(hd === handler || handler === undefined) && arr.splice(ind, 1)
					})
				}
			}
		})
		return this
	}

	/**
	 * Destroy the full Highway instance
	 */
	destroy() {
		Highway.Host.removeEventListener('message', ::this._handler)
	}

	/**
	 * Add message listener to the host
	 * @private
	 */
	_bind() {
		Highway.Host.addEventListener('message',::this._handler)
	}

	/**
	 * onMessage callback handler
	 * @param ev {WorkerEvent}
	 * @private
	 */
	_handler(ev) {
		let parsed = Highway.Bucket
		parsed['*'].handlers.forEach((fn) => fn.call(null, ev.data))
		ev.data.name.split(DELIMITER).forEach((segment) => {
			if (parsed.hasOwnProperty(segment)) {
				parsed = parsed[segment]

				parsed.handlers.length
				&& parsed.handlers.forEach((fn, i, arr) => {
					fn.call(null, ev.data)
					fn.one && arr.splice(i, 1)
				})
			}
		})
	}
}

// Make Highway globally available
self.Highway = Highway