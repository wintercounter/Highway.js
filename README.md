# Highway.js
A flexible pub/sub event emitter for web-worker cross-communication with fallback support.

!["Highway PubSub Cross-Communication"](https://raw.githubusercontent.com/DoclerLabs/Highway.js/master/www/cross.png)

##Usage
Include **Highway.js** on both client side and worker side.

Client:
```html
<script src="Highway.js"></script>
```

Worker:
```javascript
importScripts('Highway.js')
```

Initialize:
```javascript
// Client side
var Host = self.Worker ? new self.Worker('worker.bundle.js') : self
self.HW = self.HW || new self.Highway(Host)
// Worker side
self.HW = self.HW || new self.Highway()
```

Note that you cannot use `importScripts` in case you want proper fallback if there is no web-worker support.
In that you need to include a bundle in `new Worker('worker.bundle.js')` and the bundle should also include Highway.
This way you can include your worker bundle on the client side after no worker support is detected.

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