self.importScripts && importScripts('../dist/Highway.js')

self.HW = self.HW || new self.Highway()

self.InitWorker = function(){
	self.HW.off('*')
	self.HW.sub('*', function(ev){
		ev.name[0] !== 'W' && self.HW.pub('W->' + ev.name)
	})
}

self.importScripts && self.InitWorker()