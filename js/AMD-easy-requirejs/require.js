// require 实现：string加载模块   模块运行 defined 方法后 执行rquire的回调
// defined 实现：执行传入的func  返回的值 传给 require传入的回调
let ModuleCache = {}

function myRequire (moduleName, callback) {
    let mod
    if (!ModuleCache[moduleName]) {
        mod = ModuleCache[moduleName] = callback
        var _script = document.createElement('script')
        _script.id = moduleName
        _script.type = 'text/javascript'
        _script.charset = 'utf-8'
        _script.src = moduleName
    }
    var fs = document.getElementsByTagName('script')[0];
    fs.parentNode.insertBefore(_script, fs)
}

function define (func) {
    let result = func()
    let modName = document.currentScript && document.currentScript.id
    if (ModuleCache[modName]) {
        ModuleCache[modName](result)
    }
}