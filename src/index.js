function render(){
    let title = require('./title.js')
    root.innerHTML = title
}

render()

if(module.hot){ //只有热更新才有
    module.hot.accept(['./title.js'],render)
}