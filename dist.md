 (() => {
	 function hotCheck(){
		 console.log('hot check') //开始进行热更新检查
	 }
 	var modules = ({
 "./src/message.js":
 ((module) => {
	module.exports = 'message'
	 }),
	 "./webpack/hot/emitter.js":
	 ((module) => {
	class EventEmitter{
		constructor(){
			this.events = {}
		}
		on(eventName,fn){
			this.events[eventName] = fn
		}
		emit(eventName,...args){
			this.events[eventName](...args)
		}
	}
	module.exports = new EventEmitter()
	 })
	 	});
		 var cache = {};
		function hotCreateModule(){
			let hot = {
				_acceptedDependencies: {}, //接受的依赖对象
				accept(deps,callback){ //接受依赖的变化
					for(let i=0;i<deps.length;i++){
						hot._acceptedDependencies[deps[i]] = callback
					}
				}
			}
			return hot
		}
		function hotCreateRequire(parentModuleId){
			var parentModule = cache[parentModuleId]
			if(!parentModule) return require
			var hotRequire = function(childModuleId){
				parentModule.children.push(childModuleId)
				let childExports = require(childModuleId)
				let childModule = cache[childModuleId]
				childModule.parents.push(parentModule)
				return childExports
			}
			return hotRequire
		}
	 	function require(moduleId) {
	 		if(cache[moduleId]) {
	 			return cache[moduleId].exports;
	 		}
	 		var module = cache[moduleId] = {
				 exports: {},
				 hot: hotCreateModule(), //每个模块都有一个hot属性注册热更新回调
				 parents: [],
				 children: []
	 		};
	 		modules[moduleId](module, module.exports, hotCreateRequire(moduleId));
	 		return module.exports;
	 	}
	(() => {
	let hotEmitter = require( "./webpack/hot/emitter.js")
	let socket = io()
	let currentHash
	socket.on('hash',(hash)=>{
		console.log('客户端接收到hash消息')
		currentHash = hash
	})
	socket.on('ok',()=>{
		console.log('客户端接收到ok消息')
		reloadApp()
	})
	function reloadApp(){
		hotEmitter.emit('webpackHotUpdate',currentHash)
	}
	})();
	(() => {
	let hotEmitter = require( "./webpack/hot/emitter.js")
	hotEmitter.on('webpackHotUpdate',(currentHash)=>{
		console.log('dev-server接收到了最新的hash值',currentHash)
	})
	})();
	hotCreateRequire('./src/index.js')('./src/index.js') // 1.父模块id 2.
	setTimeout(()=>{
		console.log(cache)
	},1000)
	 })()
	;