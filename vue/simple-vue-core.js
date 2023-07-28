class Vue {
    constructor (options) {
        this.data = options.data
        new Observer(options.data)
    }
}
class Observer {
    constructor (data) {
        this.data = data
        this.walk(data)
    }
    walk (data) {
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }
    defineReactive (data, key, value) {
        var dep = new Dep()
        if (Object.prototype.toString.call(value) === '[object Object]') {
            this.walk(value)
        }
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get () {
                if (Dep.target) {
                    dep.addSub(Dep.target)
                }
                return value
            },
            set (newValue) {
                if (value === newValue) {
                    return
                }
                value = newValue
                dep.notify()
            }
        })
    }
}
class Dep {
    constructor () {
        this.subs = []
    }
    addSub (sub) {
        this.subs.push(sub)
    }
    notify () {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}



class Watcher {
    constructor (vm, exp, callback) {
        this.callback = callback
        this.vm = vm
        this.exp = exp.split('.')
        this.value = this.get()
    }
    update () {
        this.run()
    }
    run () {
        let temValue = this.vm.data
        for (let i = 0; i < this.exp.length; i++) {
            temValue = temValue[`${this.exp[i]}`]
        }
        var value = temValue
        var oldVal = this.value
        if (value !== oldVal) {
            this.value = value
            this.callback.call(this.vm, value, oldVal)
        }
    }
    get () {
        let temValue = this.vm.data
        var value
        for (let i = 0; i < this.exp.length; i++) {
            if (i === this.exp.length -1 ) {
                Dep.target = this
                value = temValue[`${this.exp[i]}`]
            }
            temValue = temValue[`${this.exp[i]}`]
        }
        Dep.target = null
        return value
    }
}
// 使用
var vueInstance = new Vue({
    data: {
        a: 1,
        b: 2,
        c: {
            d: 1
        }
    }
})
new Watcher(vueInstance, 'a', function () {
    console.log('a属性更新啦')
})
new Watcher(vueInstance, 'c.d', function () {
    console.log('c属性中的d属性更新啦')
})
vueInstance.data.a = 2
vueInstance.data.c.d = 2
