//启动开发服务器

const webpack = require('webpack')
const config = require('./webpack.config')
const Server = require('./webpack-dev-server/lib/Server')

function startDevServer(compiler,config){
    //启动http服务器
    const devServerArgs = config.devServer || {} //webpack.config.js 中的devServer配置
    const server = new Server(compiler,devServerArgs)
    const {host="localhost",port=9000,} = devServerArgs
    server.listen(port,host,(err)=>{
        console.log(`running at http://${host}:${port}`)
    })
}

//1.创建webpack实例
const compiler = webpack(config)
//2.启动服务http服务器
startDevServer(compiler,config)

module.exports = startDevServer