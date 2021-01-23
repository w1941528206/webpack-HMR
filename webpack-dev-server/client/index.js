let hotEmitter = require('../../webpack/hot/emitter')

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
    hotEmitter.emit('webpackHotUpdate',currentHash) //hot/dev-server监听
}