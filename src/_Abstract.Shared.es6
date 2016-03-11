import Observable from 'riot-observable'
import { registerHelper, handlerHelper, buildRoute } from './Utils.Shared.es6'
import * as C from './_Constants.Shared.es6'

export default class Abstract {

    const Handlers = {};

    register(name, handler){
        registerHelper(name, handler, this.Handlers)
    }

    parse(input){
        let segments = input.split(C.EVENT_DELIMITER)
        let last     = segments[segments.length - 1]
        let silent   = !last.split('::::')[1]
        let state    = last.split('::::')[1] || last.split('::')[1] || false

        state && (segments[segments.length - 1] = last.split('::')[0])

        return {segments, state, silent}
    }

    sub(name, handler){
        name = buildRoute(name)
        this.register(name)
    }

    pub(name, data, skipPost){
        name = buildRoute(name)
        if (!skipPost && !self.document.querySelector) {
            self.postMessage({name, data})
        }
        else if(!skipPost){
            this.Worker.postMessage({name, data})
        }
    }

    handle(ev){
        console.log(`Event: ${ev.name}`)
        this.pub(ev.name, ev.data, true)
        handlerHelper(Handlers, ev)
    }
}