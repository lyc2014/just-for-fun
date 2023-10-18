class Store {
    constructor (options) {
        // 给每个组件的$store上挂一个state, 让每个组件都可以用 this.$store.state
        // 需要把data中的数据做成响应式的
        this._state = options.state
        this._s = new Vue({
            data () {
                // 只有data中的数据才是响应式的
                return {
                    state: options.state
                }
            }
        })
        let getters = options.getters || {}
        this.getters = {}

        Object.keys(getters).forEach(getter => {
            Object.defineProperty(this.getters, getter, {
                get: () => {
                    return getters[getter](this._state)
                }
            })
        })

        let mutations = options.mutations || {}
        this.mutations = {}

        Object.keys(mutations).forEach(mutation => {
            this.mutations[mutation] = (payload) => {
                mutations[mutation](this._state, payload)
            }
        })

        let actions = options.actions || {}
        this.actions = {}

        Object.keys(actions).forEach(action => {
            this.actions[action] = (payload => {
                actions[action](this, payload)
            })
        })
        console.log('this.actions', this.actions)
    }
    commit(type, payload) {
        this.mutations[type](payload)
    }
    dispatch (type, payload) {
        this.actions[type](payload)
    }
    get state () {
        return this._s.state
    }
    // install 本质上就是一个函数
    static install (Vue) {
        Vue.mixin({
            beforeCreate () {
                if (this.$options && this.$options.store) {
                    this.$store = this.$options.store
                } else {
                    this.$store = this.$parent && this.$parent.$store
                }
            }
        })
    }
}