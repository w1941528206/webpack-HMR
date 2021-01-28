class EventEmitter{
    constructor(){
        this.events = {}
    }
    on(eventName,fn){ //监听，key事件名字，值是函数
        this.events[eventName] = fn
    }

    emit(eventName,...args){ //emit发射的意思
        this.events[eventName](...args)
    }
}

module.exports = new EventEmitter()