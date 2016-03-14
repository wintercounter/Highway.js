"use strict"

var assert = chai.assert

suite('Highway.js', function() {
	var Host, HW
	var ForceFallback = false

	setup(function(){
		Host = self.Worker && !ForceFallback ? new self.Worker('./worker.js') : self
		HW   = new Highway(Host)
	})

	test('initialization', function(){

	})

	test('pub-sub', function(){

	})

	test('sub', function(){

	})

	teardown(function(){
		Host.terminate && Host.terminate()
	})
});

self.HW = self.HW || new self.Highway(Host);

self.HW.sub('$', $happened)
self.HW.off('$')

function $happened(){
	console.log('$ happened')
}

self.HW.sub('$->test', function(){
	console.log('$->test happened')
})

self.HW.sub('$->test->one', function(){
	console.log('$->test->one happened', arguments)
})

self.HW.sub('*', function(ev){
	console.log('*', ev.name)
})