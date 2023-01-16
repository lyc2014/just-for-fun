//最简单的拦截器
// var defaultConfig = { num: 0, name: 'default' }
// function interceptor1 (inConfig) {
//     return { num: inConfig.num++, name: 'interceptor1' }
// }
// function interceptor2 (inConfig) {
//     return { num: inConfig.num++, name: 'interceptor2' }
// }
// var outConfig = interceptor2(interceptor1(defaultConfig))

// 多个拦截器就以此类推，但是会形成回调地狱，所以可以使用promise的链式操作来做。

// Promise.resolve(defaultConfig).then(interceptor1).then(interceptor2).then(outConfig => outConfig)

// 所以初步思路来了

// Promise.resolve(requestConfig).then(reqInterceptor).then(config => fetch(url, config)).then(repInterceptor).then(res => res)

class InterceptorManager {
    constructor () {
        this.handlers = []
    }
    use (fulfilled, rejected) {
        this.handlers.push([fulfilled, rejected])
    }
    get () {
        return this.handlers
    }
}

function fetchPlus (url, init) {
    const requestInterceptors = fetchPlus.requestInterceptors.get().reverse()
    const responseInterceptors = fetchPlus.responseInterceptors.get()
    const dispatchRequest = init => fetch(url, init)
    const chain = [...requestInterceptors, [dispatchRequest, undefined], ...responseInterceptors]
    let promise = Promise.resolve(init)
    while(chain.length) {
        const [fulfilled, rejected] = chain.shift()
        promise = promise.then(fulfilled, rejected)
    }
    return  promise;
}

// use for registering request interceptor
fetchPlus.requestInterceptors = new InterceptorManager();
// use for register response interceptor
fetchPlus.responseInterceptors = new InterceptorManager();
