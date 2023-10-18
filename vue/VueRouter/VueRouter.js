/**
 * @class
 * @classdesc 实现一个简易的vue-router插件
 * 思路
 * 1. const router = new VueRouter({routes, mode})  这里需要实现一个VueRouter类   通过new VueRouter注入路由列表、路由模式  对路由初始化 如添加 hashchange 和 popstate 的事件监听器
 * 2. new Vue({..., router})  这里将实例化的router挂载在根组件的$options对象上，以便后续组件内上下文对router对象的访问
 * 3. Vue.use(VueRouter)  这里需要负责注册好 router-link  router-view 全局组件 
 *    通过 Vue.mixin 全局混入钩子  实现对this.$router、this.$route的访问  根组件实现对当前路由变量响应式，
 *    后续router-view组件render函数中使用到路由变量，路由变量改变时，router-view的render函数会重新执行，从而实现“路由变化，渲染对应组件”的功能。
 * 
 * 逻辑流程： routes[{path: '/', component: Home}] 的注入 是为了让 router-view 能根据当前路由匹对到正确的component
 *           hash模式： 声名一个 响应式变量currentRoute当前路由， router-link 通过 a 标签 修改 hash 地址， 通过监听 hashchange 事件 修改响应式变量currentRoute的值
 *                      router-view的render函数使用到了这个响应式变量， 当响应式变量改变时  router-view的render函数会重新执行
 *           history模式: router-link 通过 a 标签 修改路由地址, 并且阻止浏览器的默认跳转 e.preventDefault()， 并通过 history.pushState(null, '', _self.to) 可以修改到url上的地址,
 *                       并手动修改响应式变量currentRoute触发更新。 另外通过 'popstate' 事件 可以监听到浏览器的前进和后退动作 同步修改 响应式变量currentRoute 触发更新。
 */
class VueRouter {
    /** 
     * @constructor 
     * @param {Object} options - 对象包含
     * @param {Array} options.routes - 路由列表
     * @param {String} options.mode - 路由模式 只能是 "hash" 或者 "history"，默认是"hash"
    */
    constructor (options) {
        this.routes = options.routes || []
        this.mode = options.mode || 'hash'
        // 这里为什么将 currentRoute 设置成对象 { current: null } 而不是 this.currentRoute = 'xxx'  
        // 是因为 后续组件上下文 要设置设置一个响应式变量 Vue.util.defineReactive(this, 'current', this.$options.router.currentRoute)   this.$options.router.currentRoute 即是这里的 this.currentRoute
        // 这样话 hashchange 事件 改变  this.currentRoute.current  也能映射到 组件的 this.current 变量上 从而 触发 render函数重新渲染。
        this.currentRoute = { current: null }
        // [{path: '/', component: Home}, {path: '/about', component: About}] 转换为 {'/': Home, '/about': About}
        this.routesMap = this.routes.reduce((pre, current) => {
            pre[current.path] = current.component
            return pre
        }, {})
        this.init()
    }
    init () {
        if (this.mode === 'hash') {
            location.hash ? '' : location.hash = '/'
            // 载入页面是执行
            this.currentRoute.current = location.hash.slice(1)
            // hash改变时执行
            window.addEventListener('hashchange', () => {
                this.currentRoute.current = location.hash.slice(1)
            })
        } else {
            location.pathname ? '' : location.pathname = '/'
            this.currentRoute.current = location.pathname
            // 浏览器点击前进或者后退键时触发 history.pushState(null,...) 不会触发
            window.addEventListener('popstate', () => {
                this.currentRoute.current = location.pathname
            })
        }
    }
    push (route) {
        if (this.mode === 'hash') {
            location.hash = route
        } else {
            history.pushState(null, '', route)
            this.currentRoute.current = route
        }
    }
    static install (Vue) {
        // 全局混入
        Vue.mixin({
            beforeCreate(){
                // 因为 new Vue({..., router}) 只在根组件里options里面写入了router 可以通过这一点判断是否是根组件  并且将根组件赋值给子组件的_root属性 便于后续子组件访问router
                if(this.$options && this.$options.router) {
                    this._root = this
                    Vue.util.defineReactive(this, 'currentRoute', this.$options.router.currentRoute)
                } else {
                    // 所有子组件都能继承 _root 属性  _root属性指向根组件
                    this._root = this.$parent && this.$parent._root
                }
                // 给每个组件声名一个 $router 属性   指向 router 实例对象
                Object.defineProperty(this, '$router', {
                    get () {
                        return this._root.$options.router
                    }
                })
                // 给每个组件声名一个 $route 属性   指向当前路由路径
                Object.defineProperty(this, '$route', {
                    get () {
                        return this._root.$options.currentRoute.current
                    }
                })
            }
        })
        // 全局注册 router-link 组件
        Vue.component('router-link', {
            props: { to: String },
            render (h) {
                let mode = this._root.$options.router.mode
                if (mode === 'hash') {
                    let to = '#' + this.to
                    return h('a', {attrs: { href: to }}, this.$slots.default[0].text)
                } else {
                    let _self = this
                    function preventClickDefault (e) {
                        e.preventDefault()
                        // 这里 不会触发 popstate 事件  所以需要在手动修改一下响应式变量 以便触发render函数
                        history.pushState(null, '', _self.to)
                        // 根组件的 currentRoute
                        _self._root.currentRoute.current = _self.to
                    }
                    return h('a', {
                        on: {
                            click: preventClickDefault
                        }
                    }, this.$slots.default[0].text)
                }
            }
        })
        // 全局注册 router-view
        Vue.component('router-view', {
            render (h) {
                // 根组件的 currentRoute
                let current = this._root.currentRoute.current
                let routesMap = this._root.$options.router.routesMap
                return h(routesMap[current])
            }
        })
    }
}