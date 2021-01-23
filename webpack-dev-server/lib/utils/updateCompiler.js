function updateCompiler(compiler){
    const options = compiler.options
    //更新入口 修改入口，加了两个文件

    // 1.浏览器中的websocket客户端
    options.entry.main.import.unshift(require.resolve('../../client/index.js'))
    // 2.用来在浏览器里监听发生的事件，进行后续热更新逻辑
    options.entry.main.import.unshift(require.resolve('../../../webpack/hot/dev-server.js'))

    // 1 和 2 可以合二为一，但是为了解耦 1是客户端2是有业务逻辑的

    // console.log(options.entry)

    compiler.hooks.entryOption.call(options.context,options.entry)
}

module.exports = updateCompiler