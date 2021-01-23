let hotEmitter = require('../../webpack/hot/emitter')

hotEmitter.on('webpackHotUpdate',(currentHash)=>{
    console.log('dev-server接收到了最新的hash值',currentHash)
    //热更新检查
})