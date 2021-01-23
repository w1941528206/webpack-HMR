const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin')

module.exports = {
    mode: 'development',
    devtool: false,
    entry: [
        path.resolve('./webpack-dev-server/client/index.js'),
        path.resolve('./webpack/hot/dev-server.js'),
        './src/index.js'],
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'[name].js', 
        hotUpdateGlobal: 'webpackHotUpdate' //self里面的名字
    },
    devServer:{
        // hot: true,
        port: 9000,
        //除了打包后的资源外的额外的静态文件器
        contentBase: path.resolve(__dirname,'static'),
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./public/index.html'
        }),
        new HotModuleReplacementPlugin()
    ]
}