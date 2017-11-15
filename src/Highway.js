/**
 * Delimiter to split event routes
 * @type {string}
 */
const DELIMITER = '->'

/**
 * Default bucket prototype
 * @type {{*: {handlers: Array}}}
 */
const DEFAULT_BUCKET = {
	'*': {
		handlers: []
	}
}

/**
 * 'exe' method event name
 * @type {String}
 */
const EV_EXECUTE = 'HWEXECUTE'

/**
 * Main Highway JS class
 */
export default class Highway {

	/**
	 * Proxy object
	 * @static
	 */
	Proxy

	/**
	 * Bucket to store handlers
	 * @type {{*: {handlers: Array}}}
	 */
	Bucket

	/**
	 * Allow the usage of exe?
	 * @type {boolean}
	 */
	AllowExe = true

	/**
	 * @constructor
	 * @param Proxy
	 */
	constructor(Proxy = self) {
		this.Proxy = Proxy
		this.reset()
		this._bind()
	}

	/**
	 * Publish an event
	 * @param name  {String} The event's name
	 * @param data  [Mixed]  Custom event data
	 * @param state [String] Optional state identifier
	 * @returns {Highway}
	 */
	pub(name, data = undefined, state = undefined) {
		this.Proxy.postMessage({name, data, state})
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
		let temp = this.Bucket
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
		let temp = this.Bucket

		name.split(DELIMITER).forEach((k, i, a) => {
			if (temp.hasOwnProperty(k)) {
				if (handler === true && k === a[a.length-1]) {
					delete temp[k]
				}
				else {
					temp = temp[k];
					temp.handlers = temp.handlers.filter((fn) => {
						return !(fn === handler || handler === undefined)
					})
				}
			}
		})
		return this
	}

	/**
	 * Execute a function on the other side.
	 * @param fn {Function} The function to execute.
	 */
	exe(fn){
		this.pub(EV_EXECUTE, fn.toString().match(/function[^{]+\{([\s\S]*)}$/)[1])
	}

	/**
	 * Destroy the full Highway instance
	 */
	destroy() {
		this.Proxy.removeEventListener(this.handler)
		delete this.Bucket
	}

	/**
	 * Resets Bucket to default
	 */
	reset(){
		DEFAULT_BUCKET['*'].handlers = []
		this.Bucket = Object.assign({}, DEFAULT_BUCKET)
	}

	/**
	 * Add message listener to the host
	 * @private
	 */
	_bind() {
		this.Proxy.addEventListener(this.handler)
		this.sub(EV_EXECUTE, function(ev){
			if (this.AllowExe) {
				(new Function(ev.data)).call(self)
			}
		})
	}

	/**
	 * Returns an already binded handler,
	 * so this handler can be used to remove event listener.
	 * @returns {*}
	 */
	get handler() {
		this.__handler = this.__handler || ::this._handler;
		return this.__handler;
	}

	/**
	 * onMessage callback handler
	 * @param ev {WorkerEvent}
	 * @private
	 */
	_handler(ev) {
		let parsed = this.Bucket
		let nope   = false

		parsed['*'].handlers.forEach((fn) => fn.call(null, ev.data))
		ev.data.name.split(DELIMITER).forEach((segment) => {
			if (!nope && parsed.hasOwnProperty(segment)) {
				parsed = parsed[segment]

				parsed.handlers.length
				&& parsed.handlers.forEach((fn, i, arr) => {
					fn.call(null, ev.data)
					fn.one && arr.splice(i, 1)
				})
			}
			else {
				nope = true
			}
		})
	}
}