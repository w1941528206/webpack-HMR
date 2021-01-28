let hotEmitter = require('../../webpack/hot/emitter')

let socket = io()//因为域名没变，所以省略里面的内容

let currentHash

socket.on('hash',(hash)=>{//监听hash事件，服务端发送hash客户端接到保存在currenthash里
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