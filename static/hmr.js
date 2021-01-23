(() => {
	//首次不需要热更新检查
	let currentHash
	let lashHash
   function hotCheck(){
	   console.log('hot check') //开始进行热更新检查
	   hotDownloadManifest().then(update=>{
		   update.c.forEach(chunkId=>{
			   hotDownloadUpdateChunk(chunkId)
		   })
		   lashHash = currentHash
	   }).catch(()=>{
		   window.location.reload()
	   })
   }
   function hotDownloadManifest (){
	   return fetch(`main.${lashHash}.hot-update.json`).then(res=>res.json())
   }
   function hotDownloadUpdateChunk (chunkId){
	   let script = document.createElement('script')
	   script.src = `${chunkId}.${lashHash}.hot-update.js`
	   document.head.appendChild(script)
	   console.log(script);
   }
   self['webpackHotUpdate'] = function(chunkId,moreModules){
	   hotAddUpdateChunk(chunkId,moreModules)
   }
   //新的模块代码：moreModules
   let hotUpdate = {}
   function hotAddUpdateChunk(chunkId,moreModules){
	   for(var moduleId in moreModules){
		   hotUpdate[moduleId] = modules[moduleId] = moreModules[moduleId]
	   }
	   hotApply()
   }
   function hotApply(){
	   for(let moduleId in hotUpdate){
		   let oldModule = cache[moduleId]
		   console.log(oldModule.hot)
		   delete cache[moduleId] //得把老得缓存删掉，不然再加载还会读到
		   if(oldModule.parents && oldModule.parents.length > 0){
			   let parents = oldModule.parents
			   let callback = parents.hot._acceptedDependencies[moduleId]
				callback && callback()
		   }
	   }
   }
	var modules = ({
		"./src/index.js":
		((module,exports,require) => {
			let render = ()=>{
				let message = require('./src/message.js')
				document.getElementById('root').innerHTML = message
			}
		   render()
		   if(module.hot){
			   module.hot.accept(['./src/message.js'],render)
		   }
		}),
"./src/message.js":
((module,exports,require) => {
   module.exports = 'message1'
	}),
	"./webpack/hot/emitter.js":
	((module,exports,require) => {
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
	   // console.log('dev-server接收到了最新的hash值',currentHash)
	   if(!lashHash){
		   lashHash = currentHash
		   console.log('这是第一次收到hash，是首次渲染');
		   return
	   }
	   console.log('开始热更新');
	   hotCheck()
   })
   })();
   setTimeout(()=>{
   	console.log(cache)
   },1000)
   return hotCreateRequire('./src/index.js')('./src/index.js')
   })()
   ;