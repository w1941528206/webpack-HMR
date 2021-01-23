function render(){
    let message = require('./message.js')
    root.innerHTML = message
}

render()

if(module.hot){
    module.hot.accept(['./message.js'],render)
}