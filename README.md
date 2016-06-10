# Highway.js
A flexible pub/sub event emitter for web-worker cross-communication with fallback support.

!["Highway PubSub Cross-Communication"](/www/cross.png)

##Usage
Include **Highway.js** on both client side and worker side.

Import Highway and a Proxy you want to use, both in client side and worker side:
```javascript
import Highway from 'Highway'
import WebWorkerProxy from 'Highway/Proxy/WebWorker'
```

Initialize:
```javascript
// Client side
var Host = self.Worker ? new self.Worker('worker.bundle.js') : self
self.HW = self.HW || new Highway(new WebWorkerProxy(Host))
// Worker side
self.HW = self.HW || new Highway(new WebWorkerProxy(self))
```
Fallback when there is no worker support:
```javascript
// On client side
if (!self.Worker) {
    var script = document.createElement('script')
    script.setAttribute('src', 'worker.bundle.js')
    document.body.appendChild(script)
}
```

In most cases you want to initialize client side stuff after the worker is loaded. Use your own event for this.
For example you need your data model from the backend before rendering the site.

```javascript
// Client side
self.HW.one('ready', function(){
    InitSomeGUIFramework()
})
// Worker side
InitSomeDataModelStuff()
InitSomeWebSocketConnection()
self.HW.pub('ready')
```

##API

###sub

Subscribe to an event.

```javascript
self.HW.sub('MyOwnEvent', function(){
    // Do something when event occurs
    // See pub, this will run 3 times
})
self.HW.sub('MyOwnEvent->DidSomething', function(){
    // Do something when event occurs
    // See pub, this will run once
})
```

###pub

Publish an event.

```javascript
self.HW.pub('MyOwnEvent', customData)
self.HW.pub('MyOwnEvent->DidSomething', customData)
self.HW.pub('MyOwnEvent->IHaveState', customData, 'passed')
```

###one

Subscribe to an event, unsubscribe once it is called.

```javascript
self.HW.one('MyOwnEventOnce', function(){
    // I'll just run once and automatically unsubscribe then
})
```

###exe

Execute a function on the other side. Your function will be executed within `self` context.

```javascript
self.HW.exe(function(){
    // Do some code
})
```

###off

Unsubscribe from an event.

```javascript
// Unsubscribe from ALL events associated with MyOwnEvent
self.HW.off('MyOwnEvent')
// Unsubscribe only a specific function
self.HW.off('MyOwnEvent', handlerFunction)
// Unsubscribe from ALL events associated with MyOwnEvent and event the deep ones. eg: MyOwnEvent->DeepEvent too
self.HW.off('MyOwnEvent', true)
```

###destroy

Destroy the Highway instance.

```javascript
self.HW.destroy()
```

#Credits
[Victor Vincent](http://wintercounter.me)
[DoclerLabs](http://doclerlabs.com)

![](http://c.statcounter.com/10870964/0/443694a8/1/)
