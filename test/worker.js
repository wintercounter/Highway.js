import Highway from '../../dist/Highway'
import WebWorker from '../../dist/Proxy/WebWorker'

self.HW = self.HW || new Highway(new WebWorker(self))

self.InitWorker = function(){
	self.HW.off('*')
	self.HW.sub('*', function(ev){
		ev.name[0] !== 'W' && self.HW.pub('W->' + ev.name)
	})
}

self.importScripts && self.InitWorker()