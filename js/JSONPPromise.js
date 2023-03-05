function jsonp ({ url, params = {}, callback, timeout=5000 }) {
    return new Promise ((resolve, reject) => {
        // 创建标签
        let script = document.createElement('script')
        // 回调的函数名（加上时间戳有效里面重复）
        const fnName = `jsonp_${new Date().getTime()}`
        let paramsArr = []
        Object.keys(params).forEach(key => {
            paramsArr.push(`${key}=${params[key]}`)
        })
        paramsArr.push(`callback=${fnName}`)
        url+=`?${paramsArr.join('&')}`
        console.log(url)
        // 配置超时
        let timer = setTimeout(() => {
            reject({ error: -1, msg: '请求超时' })
        }, timeout)
        // 回调函数
        window[fnName] = function (res) {
            // 删除标签
            delete script
            delete window[fnName]
            clearTimeout(timer)
            delete script
            delete window[fnName]
            // 返回结果
            resolve(res)
        }
        script.src=url;
        
        document.body.appendChild(script);
    })
}