# Highway.js
A flexible pub/sub event emitter for web-worker (and more) cross-communication with fallback support.
Worker can be anything: an Iframe, a WebWorker, a ServiceWorker, a Node WS Server.

!["Highway PubSub Cross-Communication"](/www/cross.png)

## Usage
Include **Highway.js** on both client side and worker side.

Import Highway and a Proxy you want to use, both in client side and worker side:
```js
import Highway from 'Highway'
import WebWorkerProxy from 'Highway/Proxy/WebWorker'
```

Initialize:
```js
// Client side
const Host = self.Worker ? new self.Worker('worker.bundle.js') : self
self.HW = self.HW || new Highway(new WebWorkerProxy(Host))
// Worker side
self.HW = self.HW || new Highway(new WebWorkerProxy(self))
```
Fallback when there is no worker support:
```javascript
// On client side
if (!self.Worker) {
    const script = document.createElement('script')
    script.setAttribute('src', 'worker.bundle.js')
    document.body.appendChild(script)
}
```

In most cases you want to initialize client side stuff after the worker is loaded.
Use your own event for this.
For example you need your data model from the backend before rendering the site.

```js
// Client side
HW.one('ready', InitSomeGUIFramework)
// Worker side
InitSomeDataModelStuff()
InitSomeWebSocketConnection()
HW.pub('ready')
```

## API

### HW.sub(string eventName, callable callback [,boolean one = false])

Subscribe to an event.

```js
HW.sub('MyOwnEvent', function(){
    // Do something when event occurs
    // See pub, this will run 3 times
})
HW.sub('MyOwnEvent->DidSomething', function(){
    // Do something when event occurs
    // See pub, this will run once
})
```

### HW.pub(eventName[, customData, customState])

Publish an event.

```js
HW.pub('MyOwnEvent', { customData })
HW.pub('MyOwnEvent->DidSomething', { customData })
HW.pub('MyOwnEvent->IHaveState', { customData }, 'passed')
```

### HW.one(eventName, callback)

Subscribe to an event, unsubscribe once it is called. It's a shorthand for
`HW.sub(eventName, callback, true)`

```js
HW.one('MyOwnEventOnce', function(){
    // I'll just run once and automatically unsubscribe then
})
```

### HW.exe(callable)

Execute a function on the other side. Your function will be executed within `self` context.

```javascript
HW.exe(() => {
    // Do some code
})
```

#### Disable exe

```js
HW.AllowExe = false
```

> You might want to disable this if you're using Node as you backend for example.
> Function is passed over as a string and it's executed by `eval` which is a high security risk.

### off

Unsubscribe from an event.

```javascript
// Unsubscribe from ALL events associated with MyOwnEvent
HW.off('MyOwnEvent')
// Unsubscribe only a specific callback
HW.off('MyOwnEvent', callback)
// Unsubscribe from ALL events associated with MyOwnEvent, even the deep ones. eg: MyOwnEvent->DeepEvent too
HW.off('MyOwnEvent', true)
```

### destroy

Destroy the Highway instance.

```javascript
HW.destroy()
```

## Proxies
- EventEmitter: for everything which uses the node EventEmitter interface (like socket.io)
- Iframe
- WebWorker: for both Web and Service Workers

#Credits
[Victor Vincent](http://wintercounter.me)

![](http://c.statcounter.com/10870964/0/443694a8/1/)
