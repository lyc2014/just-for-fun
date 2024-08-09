/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./test/base.css":
/*!***********************!*\
  !*** ./test/base.css ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n      const cssArray = [];\n      let n = 0;\n      \n           cssArray[n] = __webpack_require__(/*! ./test/font.css */ \"./test/font.css\");\n           n++\n        \n      const content = cssArray.join('\\n')\n      module.exports = content + \"\\r\\nbody{\\r\\n  color: red;\\r\\n}\";\n    \n\n//# sourceURL=webpack://webpack5_writingALoader/./test/base.css?");

/***/ }),

/***/ "./test/font.css":
/*!***********************!*\
  !*** ./test/font.css ***!
  \***********************/
/***/ ((module) => {

eval("\n        module.exports = \".font {\\r\\n  font-size: 18px;\\r\\n}\"\n      \n\n//# sourceURL=webpack://webpack5_writingALoader/./test/font.css?");

/***/ }),

/***/ "./test/test.css":
/*!***********************!*\
  !*** ./test/test.css ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n      const cssArray = [];\n      let n = 0;\n      \n           cssArray[n] = __webpack_require__(/*! ./test/base.css */ \"./test/base.css\");\n           n++\n        \n      const content = cssArray.join('\\n')\n      module.exports = content + \"\\r\\nh1 {\\r\\n  color: green;\\r\\n}\";\n    \n\n//# sourceURL=webpack://webpack5_writingALoader/./test/test.css?");

/***/ }),

/***/ "./test/index.js":
/*!***********************!*\
  !*** ./test/index.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _test_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./test.css */ \"./test/test.css\");\n/* harmony import */ var _test_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_test_css__WEBPACK_IMPORTED_MODULE_0__);\n// import data from './data.txt'\r\n// import data1 from './data.text'\r\n\r\n// console.log(data1)\r\n\r\n// console.log(data)\r\n// import base from './base.css'\r\n\r\n// console.log(base)\r\n\r\n\r\nconsole.log((_test_css__WEBPACK_IMPORTED_MODULE_0___default()))\n\n//# sourceURL=webpack://webpack5_writingALoader/./test/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./test/index.js");
/******/ 	
/******/ })()
;