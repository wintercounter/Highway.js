importScripts('../dist/Highway.js')

self.HW = self.HW || new self.Highway()

self.HW.sub('*', function(ev){
	self.HW.pub('W->' + ev.name)
})