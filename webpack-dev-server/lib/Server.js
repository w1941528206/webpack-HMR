const express = require('express')
const http = require('http')
const updateCompiler = require('./utils/updateCompiler')
const webpackDevMiddleware = require('../../webpack-dev-middleware')
const io = require('socket.io')

class Server {
    constructor(compiler,devServerArgs){
        this.sockets = [] //存放所有和服务器链接的客户端
        this.compiler = compiler
        this.devServerArgs = devServerArgs
        updateCompiler(compiler)
        this.setupHooks() //开始启动webpack编译
        this.setupApp()
        this.routes()
        this.setupDevMiddleware() //开发中间件
        this.createServer()
        this.createSocketServer()
    }
    setupDevMiddleware(){
        this.middleware = webpackDevMiddleware(this.compiler)
        this.app.use(this.middleware)
    }
    //监听编译成功事件
    setupHooks(){
        this.compiler.hooks.done.tap('webpack-dev-server',(stats)=>{
            console.log('新的编译已经完成，新的hash值为',stats.hash)
            // console.log('新的编译已经完成，新的stats值为',stats)
            //编译完成了广播
            //以后每一次新的编译成功，都要发送新的hash和ok
            this.sockets.forEach(socket=>{
                socket.emit('hash',stats.hash)
                socket.emit('ok')
            })
            this._stats = stats //保存上一次stats
        })
    }
    routes(){
        if(this.devServerArgs.contentBase){
            this.app.use(express.static(this.devServerArgs.contentBase))
        }
    }
    setupApp(){
        //这个app不是一个服务，是一个路由中间件
        this.app = express()
    }
    createSocketServer(){
        //websocket通信前要握手，使用的是http协议，需要app服务器
        const websocketServer = io(this.server)
        websocketServer.on('connection',(socket)=>{
            console.log('一个新的websocket客户端已经连接')
            this.sockets.push(socket)
            //断开链接就删掉
            socket.on('disconnect',()=>{
                let index = this.sockets.indexOf(socket)
                this.sockets.splice(index,1)
            })
            //已经编译过了，发送上一次hash和ok
            if(this._stats){
                socket.emit('hash',this._stats.hash)
                socket.emit('ok')
            }
        })
    }
    createServer(){
        // this.server = http.createServer(this)
        // return this.server.listen.apply(server,arguments)
        this.server = http.createServer(this.app)
    }
    listen(port,host,callback){
        this.server.listen(port,host,callback)
    }
}

module.exports = Server