import * as C from './_Constants.Shared.es6'

export function buildRoute (){
    return Array.prototype.filter.call(arguments, Boolean)
           .join(C.EVENT_DELIMITER)
}

export function registerHelper(name, handler, Handlers){
    // Extract segments
    let segments = name.split(C.EVENT_DELIMITER)

    // Apply segments and prototype
    let temp = Handlers
    segments.forEach((k, i, a) => {
        if (!temp.hasOwnProperty(k)) {
            temp[k] = {
                handlers: []
            }
        }
        temp = temp[k]
        ++i === a.length && temp.handlers.push(handler)
    })
}

export function parseRoute(route, Handlers){
    let parsed = Handlers
    route.split(C.EVENT_DELIMITER).forEach((s) => {
        parsed.hasOwnProperty(s) && (parsed = parsed[s])
    })
    return parsed
}

export function handlerHelper(Handlers, ev){
    let parsed = parseRoute(ev.name, Handlers)
    applyHandlers(parsed, ev)
}

function applyHandlers(obj, ev){
    for (let i in obj) {
        if (obj.hasOwnProperty(i)){
            typeof obj[i] === 'object'
            && handlerHelper(obj[i], ev);

            (i = obj.handlers)
            && i.length
            && i.forEach((fn) => fn.call(null, ev))
        }
    }
}