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
   }
   self['webpackHotUpdate'] = function(chunkId,moreModules){ //是一个脚本，会执行
	   hotAddUpdateChunk(chunkId,moreModules)
   }
   //新的模块代码：moreModules
   let hotUpdate = {}
   function hotAddUpdateChunk(chunkId,moreModules){ //moreModules是一个对象，key-moduleId 值-新的定义
	   for(var moduleId in moreModules){
		   hotUpdate[moduleId] = modules[moduleId] = moreModules[moduleId]
	   }
	   hotApply()
   }
   function hotApply(){
	   for(let moduleId in hotUpdate){ //怎么热更新
		   let oldModule = cache[moduleId] //获取到老的模块，module 他有父亲和儿子
		   delete cache[moduleId] //得把老得缓存删掉，不然再加载还会读到
		   if(oldModule?.parents && oldModule.parents.size > 0){ //判断有没有父亲（入口文件没有）
			   let parents = oldModule.parents //拿到父亲
			   parents.forEach(father=>{
				   console.log(father)
				   father.hot.check(moduleId)
			   })
		   }
	   }
   }
	var modules = ({
		"./src/index.js":
		((module,exports,require) => {
			let render = ()=>{
				let title = require('./src/title.js')
				document.getElementById('root').innerHTML = title
			}
		   render()
		   if(module.hot){
			   module.hot.accept(['./src/title.js'],render)
		   }
		}),
"./src/title.js":
((module,exports,require) => {
   module.exports = 'title'
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
		   let hot = {  //index中的hot就是这里,有个方法叫accept,可以接受并处理哪些模块的变更
			   _acceptedDependencies: {}, //接收的依赖对象
			   accept(deps,callback){ //接受依赖的变化，注册各个模块回调函数     调用accept的时候，会给模块赋值，key就是模块id，值就是callback
				   for(let i=0;i<deps.length;i++){
					   hot._acceptedDependencies[deps[i]] = callback //key = value
				   }
			   },
			   check(moduleId){
				let callback = hot._acceptedDependencies[moduleId] //有回调就执行，比如index.js accept添加了回调，有就执行
				callback && callback()
			   }
		   }
		   return hot
	   }
	   function hotCreateRequire(parentModuleId){ //接收父模块id
		//先判断父亲这个模块加载过吗，如果还没有加载过，那么就返回require，就不走hotRequire了
		   let parentModule = cache[parentModuleId]
		   if(!parentModule) return require 
		   let hotRequire = function(childModuleId){ 
			   parentModule.children.add(childModuleId) //父亲添加一个儿子
			   let childExports = require(childModuleId)
			   let childModule = cache[childModuleId]
			   childModule.parents.add(parentModule) //子模块添加父亲
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
				hot: hotCreateModule(), 
				parents: new Set(),
				children: new Set()
			};
			modules[moduleId](module, module.exports, hotCreateRequire(moduleId));
			return module.exports;
		}
   (() => {
   let hotEmitter = require( "./webpack/hot/emitter.js")
   let socket = io()
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
   return hotCreateRequire('./src/index.js')('./src/index.js') //不用require，用hotCreateRequire
   // require('./src/index.js')
   })()
   ;