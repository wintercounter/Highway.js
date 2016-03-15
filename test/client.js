"use strict"

var assert = chai.assert

suite('Highway.js', function() {
	var Host, HW
	var ForceFallback = false

	setup(function(){
		Host = self.Worker && !ForceFallback ? new self.Worker('./worker.js') : self
		self.HW = HW = new Highway(Host)
	})

	test('exe', function(done){
		HW.sub('exe', function(){
			done()
		})
		HW.exe(function(){
			self.HW.pub('exe')
		})
	})

	test('pub-sub simple', function(done){
		HW.sub('W->testPub', function(){
			done()
		})
		HW.pub('testPub')
	})

	test('pub-sub route root', function(done){
		var i = 0
		HW.sub('W', function(){ i++ })
		HW.pub('testPub1')
		HW.pub('testPub2')
		HW.pub('testPub3')
		setTimeout(function(){ i === 3 && done() }, 200)
	})

	test('pub-sub sub-route', function(done){
		var i = 0
		HW.sub('W->testPub', function(){ i++ })
		HW.pub('testPub->one')
		HW.pub('testPub->two')
		HW.pub('testPub->three')
		setTimeout(function(){ i === 3 && done() }, 200)
	})

	test('pub-sub sub-route', function(done){
		var i = 0
		HW.sub('W->testPub', function(){ i++ })
		HW.pub('testPub->one')
		HW.pub('testPub->two')
		HW.pub('testPub->three')
		setTimeout(function(){ i === 3 && done() }, 200)
	})

	test('pub-sub any', function(done){
		var i = 0
		HW.sub('*', function(){ i++ })
		HW.pub('testPub1')
		HW.pub('testPub2')
		HW.pub('testPub3')
		setTimeout(function(){ i === 3 && done() }, 200)
	})

	test('one', function(done){
		var i = 0
		HW.one('W->testPub', function(){ i++ })
		HW.pub('testPub')
		HW.pub('testPub')
		setTimeout(function(){ i === 1 && done() }, 200)
	})

	test('off single', function(done){
		var i = 0
		var fn = function(){ i++ }
		HW.sub('W->testPub1', fn)
		HW.sub('W->testPub1', function(){ i++ })
		HW.off('W->testPub1', fn)
		HW.pub('testPub1')
		setTimeout(function(){ console.log(i); i === 1 && done() }, 200)
	})

	test('off all', function(done){
		var i = 0
		var fn = function(){ i++ }
		HW.sub('W', fn)
		HW.sub('W', fn)
		HW.sub('W', fn)
		HW.off('W')
		HW.pub('testPub')
		HW.pub('testPub')
		HW.pub('testPub')
		setTimeout(function(){ i === 0 && done() }, 200)
	})

	test('off all deep', function(done){
		var i = 0
		var fn = function(){ i++ }
		HW.sub('W->testPub', fn)
		HW.sub('W->testPub2', fn)
		HW.sub('W->testPub3', fn)
		HW.off('W', true)
		HW.pub('testPub')
		HW.pub('testPub2')
		HW.pub('testPub3')
		setTimeout(function(){ i === 0 && done() }, 200)
	})

	teardown(function(){
		Host.terminate && Host.terminate()
	})
});
/*

self.HW = self.HW || new self.Highway(Host);

self.HW.sub('$', $happened)
self.HW.off('$')

self.HW.exe(function(){
	console.log('Exec done')
})

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
})*/
