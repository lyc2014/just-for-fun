// modules = { './src/index.js': function () {} }

(function (modules) {
    // module缓存
    var installedModules = {};
    // 用于缓存和加载 chunks
    // undefined 代表 chunk 还没加载
    // null 代表 chunk 处于 preloaded、prefetched阶段
    // Promise 代表 chunk 处于 loadging
    // 0 代表 已经加载完成
    var installedChunks = {
        "bundle": 0
    };
    function __webpack_require__ (moduleId) {
        var module = {
            i: moduleId,
            exports: {}
        }
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)
        return module.exports
    }

    __webpack_require__.d = function (exports, name, getter) {
        if (!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, { enumerable: true, get: getter });
        }
    }

    __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); }

    __webpack_require__.r = function(exports) {
        Object.defineProperty(exports, '__esModule', { value: true });
    };


    __webpack_require__.e = function requireEnsure (chunkId) {
        var promises = []
        // 使用 JSONP 方式加载chunk
        var installedChunkData = installedChunks[chunkId]

        if (installedChunkData !== 0) {  // 等于 0 代表 chunk 已经加载好了
            if (installedChunkData) { // 代表chunk在加载中
                promise.push(installedChunkData[2])
            } else {
                // 创建一个 promise 挂在外部变量 installedChunks 上。
                // 等 chunk 加载后直接 window['webpackJsonp'] => 加载好module => 执行 installedChunks[chunId] 上的resolve。
                var promise = new Promise(function (resolve, reject) {
                    installedChunkData = installedChunks[chunkId] = [resolve, reject]
                })
                // 这是为了解决 两个地方都加载同一个chunk的问题  与上面的 promise.push(installedChunkData[2])对应
                promises.push(installedChunkData[2] = promise)
                var head = document.getElementsByTagName('head')[0]
                var script = document.createElement('script')

                script.charset = 'utf-8'
                
                script.src = chunkId + '.js' // 此处应该略过一个src处理函数 jsonpScriptSrc(chunkId)

                head.appendChild(script);
            }
        }
        // [resolve, reject, promise]
        // resolve 和 reject 是为了存在 installedChunks 执行完加载module代码后 promise 的状态
        // return promise.all([promise]) 便于 promise 状态 resolve后 调用 __webpack_require__.e(xx).then() 
        return Promise.all(promises);
    }
    var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || []
    var oldJsonpFunction = jsonpArray.push.bind(jsonpArray)
    // 拦截 push 方法  执行push时会执行 webpackJsonpCallback方法
    window["webpackJsonp"].push = webpackJsonpCallback
    // 如果要使用原来push方法的功能 往 window["webpackJsonp"] 数组里面推东西  可以使用 parentJsonpFunction 方法。
    var parentJsonpFunction = oldJsonpFunction

    function webpackJsonpCallback (data) {
        // data 即 module： [[0], {'xxx': function(){...}}]
        var chunkIds = data[0]
        var moreModules = data[1]

        var moduleId, chunkId, i = 0, resolves = []
        for (; i < chunkIds.length; i++) {
            chunkId = chunkIds[i]
            if (installedChunks[chunkId]) {
                // 即 __webpack_require__.e 中 promises = [resolve, reject] 的resolve
                // installedChunks[chunkId] = [resolve,reject]
                resolves.push(installedChunks[chunkId][0])
            }
            // 代表 chunk已经加载完成
            installedChunks[chunkId] = 0;
        }
        for (moduleId in moreModules) {
            if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
                modules[moduleId] = moreModules[moduleId]
            }
        }
        // window[webpackJsonp] 数组存储 chunk的数据
        if(parentJsonpFunction) parentJsonpFunction(data);

        while(resolves.length) {
            resolves.shift()();
        }
    }

    return __webpack_require__("./main.js")
}) ({
    "./main.js": function (module, exports, __webpack_require__) {
        console.log("this is main.js")
        var rea = __webpack_require__("./rea.js")
        console.log("this is end of main.js")
        __webpack_require__.e(0).then(__webpack_require__.bind(null, './a.js'))
                                .then(function (dynamic) { dynamic.default() })
        __webpack_require__.e(1).then(function () {
            var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__('./r.js')];
            (function (r) {
                console.log(r.name)
            }).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__)
        })
    },
    "./rea.js": function (module, exports) {
        console.log('this is rea.js')
        module.exports = {
            name: 'this is rea.js'
        }
    }
})