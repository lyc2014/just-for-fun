(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0], {
    './a.js': function (module, __webpack_exports__, __webpack_require__) {
        // 给 exports 添加一个 __esModule: true 的属性
        __webpack_require__.r(__webpack_exports__)
        // 通过 Object.defineProperty 给 exports 设置一个default属性 并且使用getter拦截
        __webpack_require__.d(__webpack_exports__, "default", function () { return dynamic })
        function dynamic () {
            console.log('this is import dynamic')
        }
    }
}])