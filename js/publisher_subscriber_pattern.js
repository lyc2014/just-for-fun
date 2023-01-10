/**
 * 思路：
 * 1.需要一个订阅者收集器，负责收集存储
 * To do a subscriber's collector to keep track of subscriber callbacks
 * 
 * 2.需要一个订阅功能 负责注册订阅
 * To do a subscribe method to registered subscriber callbacks
 * 
 * 3.需要一个发布功能(publish) 负责消息发布 (invoke subscriber callbacks)
 * To do a pushlish method to invoke these callbacks correspondingly
 * 
 * 4.添加一个取消订阅功能 负责注销订阅
 * To do a unsubscribe method
 * 
 * 整体结构大致如下
 * rough structure
 * 
 * {
 *     subscribers: {},
 *     subscribe: function () {},
 *     publish: function () {},
 *     unsubscribe: function () {}
 * }
 */

class PubSubPattern {
    constructor () {
        this.subscribers = {}
    }
    subscribe (eventName, callback) {
        // method to subscribe an update
        if (!this.subscribers.hasOwnProperty(eventName)) {
            this.subscribers[eventName] = []
        }
        this.subscribers[eventName].push(callback)
        // supports chained exection
        return this
    }
    publish (eventName) {
        // method to publish  an update
        if (!this.subscribers.hasOwnProperty(eventName)) return
        let len = this.subscribers[eventName].length
        let args = Array.prototype.slice.call(arguments, 1)
        for (let i = 0; i < len; i++) {
            this.subscribers[eventName][i].apply(this, args)
        }
        return this
    }
    unsubscribe (eventName, callback) {
        // method to unsubscribe an update
        if (!this.subscribers.hasOwnProperty(eventName)) return
        let subscriber = this.subscribers[eventName]
        let len = subscriber.length
        // avoid array collapse
        for (let i = len - 1; i >= 0; i--) {
            if(this.subscribers[eventName][i] === callback) {
                this.subscribers[eventName].splice(i, 1)
            }
        }
        return this
    }
}

// test
let pubsubInstance = new PubSubPattern()
pubsubInstance.subscribe('person', function (name, age) {
    console.log('name', name)
    console.log('age', age)
})
let rdUnsubFun = function (name, age) {
    console.log('age after five years', age+5)
    console.log('name', name)
}
pubsubInstance.subscribe('person', rdUnsubFun)
pubsubInstance.publish('person', 'lyc', 28)
pubsubInstance.unsubscribe('person', rdUnsubFun)
console.log('-------------------')
pubsubInstance.publish('person', 'lyc', 28)

