//webpack中间件，监听模式，自动编译
//返回一个express中间件，用来预览
const MemoryFileSystem = require('memory-fs')
const fs = require('fs')
const memoryFileSystem = new MemoryFileSystem()
const middleware = require('./middleware')

function webpackDevMiddleware(compiler){
    compiler.watch({},()=>{
        console.log('监听到文件变化，重新编译。')
    })
    // let fs = compiler.outputFileSystem = memoryFileSystem
    return middleware({
        fs,
        outputPath:compiler.options.output.path
    })
}

module.exports = webpackDevMiddleware