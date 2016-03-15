/*var expect = chai.expect;
var should = chai.should();
var w = self

describe('Initialize Worker', function() {
	it('should detect worker support', function() {
		expect(true).to.equal(!!self.Worker);
	});
});*/

var Host = !self.Worker ? new self.Worker('./worker.js') : self;
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
})