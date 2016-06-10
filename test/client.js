"use strict"

import Highway from '../../dist/Highway'
import WebWorker from '../../dist/Proxy/WebWorker'

suite('Highway.js', function() {
	var Host, HW
	var WORKER_PATH = './dist/Worker.js'
	var ForceFallback = false // Set this manually to test without worker. Coverage needs this also.
	var IsWorker = self.Worker && !ForceFallback

	if (!IsWorker) {
		var script = document.createElement('script')
		script.setAttribute('src', WORKER_PATH)
		document.body.appendChild(script)
	}

	Host = IsWorker ? new self.Worker(WORKER_PATH) : self
	self.HW = HW = new Highway(new WebWorker(Host))

	setup(function(){
		self.InitWorker && self.InitWorker()
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
		setTimeout(function(){
			// 3 = Worker based test
			// 6 = Browser (fallback) based test \ normal*3 + W*3
			if (
				(!IsWorker && i === 6)
				|| (IsWorker && i === 3)
			) {
				done()
			}
		}, 200)
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
		setTimeout(function(){ i === 1 && done() }, 200)
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
		self.HW.reset()
	})
})
