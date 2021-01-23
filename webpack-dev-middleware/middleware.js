//中间件，负责产出文件的预览
//拦截http请求，看是不是打包的文件，如果是就读出，返回客户端
let mime = require('mime')
let path = require('path')

function wrapper({fs,outputPath}){
    return (req,res,next)=>{
        let url = req.url
        if(url === '/') url = '/index.html'
        //绝对路径
        let filename = path.join(outputPath,url)
        try{
            let stat = fs.statSync(filename) //拿到描述信息,看是不是文件
            if(stat.isFile()){
                let content = fs.readFileSync(filename) //是文件，读内容
                res.setHeader('Content-Type',mime.getType(filename)) //返回文件类型
                res.send(content)
            }else {
                console.log('else',filename)
                res.sendStatus(404)
            }
        }catch(err){
            console.log(err)
            console.log('catch',filename)
            res.sendStatus(404)
        }
    }
}

module.exports = wrapper