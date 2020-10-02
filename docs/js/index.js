/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"index": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["sandbox"] = window["sandbox"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./src/index.ts","vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist/index.js?!./src/App.vue?vue&type=style&index=0&lang=scss":
/*!******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist??ref--8-0!./src/App.vue?vue&type=style&index=0&lang=scss ***!
  \******************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(true);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "#app {\n  font-family: Avenir, Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  text-align: center;\n  color: #2c3e50;\n  margin-top: 60px;\n}\n", "",{"version":3,"sources":["webpack://src/App.vue"],"names":[],"mappings":"AACA;EACE,iDAAiD;EACjD,mCAAmC;EACnC,kCAAkC;EAClC,kBAAkB;EAClB,cAAc;EACd,gBAAgB;AAAA","sourcesContent":["\n#app {\n  font-family: Avenir, Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  text-align: center;\n  color: #2c3e50;\n  margin-top: 60px;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist/index.js?!./src/components/ImagePreview.vue?vue&type=style&index=0&lang=scss":
/*!**************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist??ref--8-0!./src/components/ImagePreview.vue?vue&type=style&index=0&lang=scss ***!
  \**************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(true);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "img {\n  width: 300px;\n}\n", "",{"version":3,"sources":["webpack://src/components/ImagePreview.vue"],"names":[],"mappings":"AACA;EACE,YAAY;AAAA","sourcesContent":["\nimg {\n  width: 300px;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist/index.js?!./src/components/SandboxStage1.vue?vue&type=style&index=0&lang=scss":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist??ref--8-0!./src/components/SandboxStage1.vue?vue&type=style&index=0&lang=scss ***!
  \***************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(true);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".stage {\n  display: flex;\n  justify-content: center;\n}\n.stage-title {\n    font-weight: bold;\n}\n.stage-detail {\n    color: #333;\n}\n", "",{"version":3,"sources":["webpack://src/components/SandboxStage1.vue"],"names":[],"mappings":"AACA;EACE,aAAa;EACb,uBAAuB;AAAA;AAEvB;IACE,iBAAiB;AAAA;AAGnB;IACE,WAAW;AAAA","sourcesContent":["\n.stage {\n  display: flex;\n  justify-content: center;\n\n  &-title {\n    font-weight: bold;\n  }\n\n  &-detail {\n    color: #333;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist/index.js?!./src/components/SandboxStage2.vue?vue&type=style&index=0&lang=scss":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist??ref--8-0!./src/components/SandboxStage2.vue?vue&type=style&index=0&lang=scss ***!
  \***************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(true);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".stage {\n  display: flex;\n  justify-content: center;\n}\n.stage-title {\n    font-weight: bold;\n}\n.stage-detail {\n    color: #333;\n}\n", "",{"version":3,"sources":["webpack://src/components/SandboxStage2.vue"],"names":[],"mappings":"AACA;EACE,aAAa;EACb,uBAAuB;AAAA;AAEvB;IACE,iBAAiB;AAAA;AAGnB;IACE,WAAW;AAAA","sourcesContent":["\n.stage {\n  display: flex;\n  justify-content: center;\n\n  &-title {\n    font-weight: bold;\n  }\n\n  &-detail {\n    color: #333;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist/index.js?!./src/App.vue?vue&type=style&index=0&lang=scss":
/*!**********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist??ref--8-0!./src/App.vue?vue&type=style&index=0&lang=scss ***!
  \**********************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../node_modules/css-loader/dist/cjs.js!../node_modules/vue-loader/dist/stylePostLoader.js!../node_modules/sass-loader/dist/cjs.js!../node_modules/vue-loader/dist??ref--8-0!./App.vue?vue&type=style&index=0&lang=scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist/index.js?!./src/App.vue?vue&type=style&index=0&lang=scss");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist/index.js?!./src/components/ImagePreview.vue?vue&type=style&index=0&lang=scss":
/*!******************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist??ref--8-0!./src/components/ImagePreview.vue?vue&type=style&index=0&lang=scss ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/dist/stylePostLoader.js!../../node_modules/sass-loader/dist/cjs.js!../../node_modules/vue-loader/dist??ref--8-0!./ImagePreview.vue?vue&type=style&index=0&lang=scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist/index.js?!./src/components/ImagePreview.vue?vue&type=style&index=0&lang=scss");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist/index.js?!./src/components/SandboxStage1.vue?vue&type=style&index=0&lang=scss":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist??ref--8-0!./src/components/SandboxStage1.vue?vue&type=style&index=0&lang=scss ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/dist/stylePostLoader.js!../../node_modules/sass-loader/dist/cjs.js!../../node_modules/vue-loader/dist??ref--8-0!./SandboxStage1.vue?vue&type=style&index=0&lang=scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist/index.js?!./src/components/SandboxStage1.vue?vue&type=style&index=0&lang=scss");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist/index.js?!./src/components/SandboxStage2.vue?vue&type=style&index=0&lang=scss":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist??ref--8-0!./src/components/SandboxStage2.vue?vue&type=style&index=0&lang=scss ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/dist/stylePostLoader.js!../../node_modules/sass-loader/dist/cjs.js!../../node_modules/vue-loader/dist??ref--8-0!./SandboxStage2.vue?vue&type=style&index=0&lang=scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist/index.js?!./src/components/SandboxStage2.vue?vue&type=style&index=0&lang=scss");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/dist/index.js?!./src/App.vue?vue&type=script&lang=ts":
/*!*************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--2-0!./node_modules/vue-loader/dist??ref--8-0!./src/App.vue?vue&type=script&lang=ts ***!
  \*************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var HelloWorld_vue_1 = __importDefault(__webpack_require__(/*! ~/components/HelloWorld.vue */ "./src/components/HelloWorld.vue"));
var ImagePreview_vue_1 = __importDefault(__webpack_require__(/*! ~/components/ImagePreview.vue */ "./src/components/ImagePreview.vue"));
var SandboxStage1_vue_1 = __importDefault(__webpack_require__(/*! ~/components/SandboxStage1.vue */ "./src/components/SandboxStage1.vue"));
var SandboxStage2_vue_1 = __importDefault(__webpack_require__(/*! ~/components/SandboxStage2.vue */ "./src/components/SandboxStage2.vue"));
exports.default = {
    name: 'App',
    components: {
        HelloWorld: HelloWorld_vue_1.default,
        ImagePreview: ImagePreview_vue_1.default,
        SandboxStage1: SandboxStage1_vue_1.default,
        SandboxStage2: SandboxStage2_vue_1.default,
    },
};


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/dist/index.js?!./src/components/HelloWorld.vue?vue&type=script&lang=ts":
/*!*******************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--2-0!./node_modules/vue-loader/dist??ref--8-0!./src/components/HelloWorld.vue?vue&type=script&lang=ts ***!
  \*******************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {};


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/dist/index.js?!./src/components/ImagePreview.vue?vue&type=script&lang=ts":
/*!*********************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--2-0!./node_modules/vue-loader/dist??ref--8-0!./src/components/ImagePreview.vue?vue&type=script&lang=ts ***!
  \*********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// composition style
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {};


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/dist/index.js?!./src/components/SandboxStage1.vue?vue&type=script&lang=ts":
/*!**********************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--2-0!./node_modules/vue-loader/dist??ref--8-0!./src/components/SandboxStage1.vue?vue&type=script&lang=ts ***!
  \**********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm-bundler.js");
exports.default = {
    setup: function () {
        var state = vue_1.reactive({
            count: 0,
        });
        function increment() {
            state.count++;
        }
        function decrement() {
            state.count--;
        }
        return {
            state: state,
            increment: increment,
            decrement: decrement,
        };
    },
};


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/dist/index.js?!./src/components/SandboxStage2.vue?vue&type=script&lang=ts":
/*!**********************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--2-0!./node_modules/vue-loader/dist??ref--8-0!./src/components/SandboxStage2.vue?vue&type=script&lang=ts ***!
  \**********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm-bundler.js");
var vuex_1 = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm-browser.js");
exports.default = {
    setup: function () {
        var store = vuex_1.useStore();
        var count = vue_1.computed(function () { return store.state.count; });
        var increment = function () {
            store.dispatch('increment', 1);
        };
        var decrement = function () {
            store.dispatch('decrement', 1);
        };
        return {
            count: count,
            increment: increment,
            decrement: decrement,
        };
    },
};


/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js?!./node_modules/vue-loader/dist/index.js?!./src/App.vue?vue&type=template&id=7ba5bd90":
/*!*****************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ref--5!./node_modules/vue-loader/dist??ref--8-0!./src/App.vue?vue&type=template&id=7ba5bd90 ***!
  \*****************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm-bundler.js");


const _hoisted_1 = { id: "app" }
const _hoisted_2 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])("p", null, "hogehgoe", -1 /* HOISTED */)
const _hoisted_3 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])("img", {
  alt: "Vue logo",
  src: "/img/test.png"
}, null, -1 /* HOISTED */)
const _hoisted_4 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])("hr", null, null, -1 /* HOISTED */)
const _hoisted_5 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])("hr", null, null, -1 /* HOISTED */)
const _hoisted_6 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])("hr", null, null, -1 /* HOISTED */)

function render(_ctx, _cache) {
  const _component_HelloWorld = Object(vue__WEBPACK_IMPORTED_MODULE_0__["resolveComponent"])("HelloWorld")
  const _component_SandboxStage1 = Object(vue__WEBPACK_IMPORTED_MODULE_0__["resolveComponent"])("SandboxStage1")
  const _component_SandboxStage2 = Object(vue__WEBPACK_IMPORTED_MODULE_0__["resolveComponent"])("SandboxStage2")

  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createBlock"])("div", _hoisted_1, [
    _hoisted_2,
    _hoisted_3,
    _hoisted_4,
    Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])(_component_HelloWorld, { msg: "Welcome to Your Vue.js App" }),
    _hoisted_5,
    Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])(_component_SandboxStage1),
    _hoisted_6,
    Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])(_component_SandboxStage2)
  ]))
}

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js?!./node_modules/vue-loader/dist/index.js?!./src/components/HelloWorld.vue?vue&type=template&id=469af010":
/*!***********************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ref--5!./node_modules/vue-loader/dist??ref--8-0!./src/components/HelloWorld.vue?vue&type=template&id=469af010 ***!
  \***********************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm-bundler.js");


const _hoisted_1 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])("p", null, "HelloWorld!!!", -1 /* HOISTED */)
const _hoisted_2 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])("p", null, "HelloWorld!!!", -1 /* HOISTED */)
const _hoisted_3 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])("p", null, "HelloWorld!!!", -1 /* HOISTED */)
const _hoisted_4 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])("p", null, "HelloWorld!!!", -1 /* HOISTED */)

function render(_ctx, _cache) {
  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createBlock"])(vue__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, [
    _hoisted_1,
    _hoisted_2,
    _hoisted_3,
    _hoisted_4
  ], 64 /* STABLE_FRAGMENT */))
}

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js?!./node_modules/vue-loader/dist/index.js?!./src/components/ImagePreview.vue?vue&type=template&id=6b8b08c6":
/*!*************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ref--5!./node_modules/vue-loader/dist??ref--8-0!./src/components/ImagePreview.vue?vue&type=template&id=6b8b08c6 ***!
  \*************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm-bundler.js");


const _hoisted_1 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])("img", {
  alt: "Vue logo",
  src: "/img/test.png"
}, null, -1 /* HOISTED */)
const _hoisted_2 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])("p", null, "がぞう", -1 /* HOISTED */)

function render(_ctx, _cache) {
  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createBlock"])("div", null, [
    _hoisted_1,
    _hoisted_2
  ]))
}

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js?!./node_modules/vue-loader/dist/index.js?!./src/components/SandboxStage1.vue?vue&type=template&id=5224fd9a":
/*!**************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ref--5!./node_modules/vue-loader/dist??ref--8-0!./src/components/SandboxStage1.vue?vue&type=template&id=5224fd9a ***!
  \**************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm-bundler.js");


const _hoisted_1 = { class: "stage" }
const _hoisted_2 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])("dt", { class: "stage-title" }, "count", -1 /* HOISTED */)
const _hoisted_3 = { class: "stage-detail" }

function render(_ctx, _cache) {
  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createBlock"])(vue__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, [
    Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])("dl", _hoisted_1, [
      _hoisted_2,
      Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])("dd", _hoisted_3, Object(vue__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"])(_ctx.state.count), 1 /* TEXT */)
    ]),
    Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])("button", {
      onClick: _cache[1] || (_cache[1] = (...args) => (_ctx.increment(...args)))
    }, "+1"),
    Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])("button", {
      onClick: _cache[2] || (_cache[2] = (...args) => (_ctx.decrement(...args)))
    }, "-1")
  ], 64 /* STABLE_FRAGMENT */))
}

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js?!./node_modules/vue-loader/dist/index.js?!./src/components/SandboxStage2.vue?vue&type=template&id=5233151b":
/*!**************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ref--5!./node_modules/vue-loader/dist??ref--8-0!./src/components/SandboxStage2.vue?vue&type=template&id=5233151b ***!
  \**************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm-bundler.js");


const _hoisted_1 = { class: "stage" }
const _hoisted_2 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])("dt", { class: "stage-title" }, "count", -1 /* HOISTED */)
const _hoisted_3 = { class: "stage-detail" }

function render(_ctx, _cache) {
  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createBlock"])(vue__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, [
    Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])("dl", _hoisted_1, [
      _hoisted_2,
      Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])("dd", _hoisted_3, Object(vue__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"])(_ctx.count), 1 /* TEXT */)
    ]),
    Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])("button", {
      onClick: _cache[1] || (_cache[1] = (...args) => (_ctx.increment(...args)))
    }, "+1"),
    Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])("button", {
      onClick: _cache[2] || (_cache[2] = (...args) => (_ctx.decrement(...args)))
    }, "-1")
  ], 64 /* STABLE_FRAGMENT */))
}

/***/ }),

/***/ "./src/App.vue":
/*!*********************!*\
  !*** ./src/App.vue ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _App_vue_vue_type_template_id_7ba5bd90__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./App.vue?vue&type=template&id=7ba5bd90 */ "./src/App.vue?vue&type=template&id=7ba5bd90");
/* harmony import */ var _App_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./App.vue?vue&type=script&lang=ts */ "./src/App.vue?vue&type=script&lang=ts");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _App_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _App_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _App_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./App.vue?vue&type=style&index=0&lang=scss */ "./src/App.vue?vue&type=style&index=0&lang=scss");





_App_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__["default"].render = _App_vue_vue_type_template_id_7ba5bd90__WEBPACK_IMPORTED_MODULE_0__["render"]
/* hot reload */
if (false) {}

_App_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__["default"].__file = "src/App.vue"

/* harmony default export */ __webpack_exports__["default"] = (_App_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__["default"]);

/***/ }),

/***/ "./src/App.vue?vue&type=script&lang=ts":
/*!*********************************************!*\
  !*** ./src/App.vue?vue&type=script&lang=ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_App_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../node_modules/ts-loader??ref--2-0!../node_modules/vue-loader/dist??ref--8-0!./App.vue?vue&type=script&lang=ts */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/dist/index.js?!./src/App.vue?vue&type=script&lang=ts");
/* harmony import */ var _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_App_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_App_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_App_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0___default.a; });
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_App_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_App_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 

/***/ }),

/***/ "./src/App.vue?vue&type=style&index=0&lang=scss":
/*!******************************************************!*\
  !*** ./src/App.vue?vue&type=style&index=0&lang=scss ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_App_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../node_modules/style-loader/dist/cjs.js!../node_modules/css-loader/dist/cjs.js!../node_modules/vue-loader/dist/stylePostLoader.js!../node_modules/sass-loader/dist/cjs.js!../node_modules/vue-loader/dist??ref--8-0!./App.vue?vue&type=style&index=0&lang=scss */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist/index.js?!./src/App.vue?vue&type=style&index=0&lang=scss");
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_App_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_App_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_App_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0___default.a; });
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_App_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_App_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 

/***/ }),

/***/ "./src/App.vue?vue&type=template&id=7ba5bd90":
/*!***************************************************!*\
  !*** ./src/App.vue?vue&type=template&id=7ba5bd90 ***!
  \***************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ref_5_node_modules_vue_loader_dist_index_js_ref_8_0_App_vue_vue_type_template_id_7ba5bd90__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../node_modules/vue-loader/dist/templateLoader.js??ref--5!../node_modules/vue-loader/dist??ref--8-0!./App.vue?vue&type=template&id=7ba5bd90 */ "./node_modules/vue-loader/dist/templateLoader.js?!./node_modules/vue-loader/dist/index.js?!./src/App.vue?vue&type=template&id=7ba5bd90");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_dist_templateLoader_js_ref_5_node_modules_vue_loader_dist_index_js_ref_8_0_App_vue_vue_type_template_id_7ba5bd90__WEBPACK_IMPORTED_MODULE_0__["render"]; });



/***/ }),

/***/ "./src/components/HelloWorld.vue":
/*!***************************************!*\
  !*** ./src/components/HelloWorld.vue ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HelloWorld_vue_vue_type_template_id_469af010__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HelloWorld.vue?vue&type=template&id=469af010 */ "./src/components/HelloWorld.vue?vue&type=template&id=469af010");
/* harmony import */ var _HelloWorld_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HelloWorld.vue?vue&type=script&lang=ts */ "./src/components/HelloWorld.vue?vue&type=script&lang=ts");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _HelloWorld_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _HelloWorld_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));



_HelloWorld_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__["default"].render = _HelloWorld_vue_vue_type_template_id_469af010__WEBPACK_IMPORTED_MODULE_0__["render"]
/* hot reload */
if (false) {}

_HelloWorld_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__["default"].__file = "src/components/HelloWorld.vue"

/* harmony default export */ __webpack_exports__["default"] = (_HelloWorld_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__["default"]);

/***/ }),

/***/ "./src/components/HelloWorld.vue?vue&type=script&lang=ts":
/*!***************************************************************!*\
  !*** ./src/components/HelloWorld.vue?vue&type=script&lang=ts ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_HelloWorld_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/ts-loader??ref--2-0!../../node_modules/vue-loader/dist??ref--8-0!./HelloWorld.vue?vue&type=script&lang=ts */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/dist/index.js?!./src/components/HelloWorld.vue?vue&type=script&lang=ts");
/* harmony import */ var _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_HelloWorld_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_HelloWorld_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_HelloWorld_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0___default.a; });
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_HelloWorld_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_HelloWorld_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 

/***/ }),

/***/ "./src/components/HelloWorld.vue?vue&type=template&id=469af010":
/*!*********************************************************************!*\
  !*** ./src/components/HelloWorld.vue?vue&type=template&id=469af010 ***!
  \*********************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ref_5_node_modules_vue_loader_dist_index_js_ref_8_0_HelloWorld_vue_vue_type_template_id_469af010__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/dist/templateLoader.js??ref--5!../../node_modules/vue-loader/dist??ref--8-0!./HelloWorld.vue?vue&type=template&id=469af010 */ "./node_modules/vue-loader/dist/templateLoader.js?!./node_modules/vue-loader/dist/index.js?!./src/components/HelloWorld.vue?vue&type=template&id=469af010");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_dist_templateLoader_js_ref_5_node_modules_vue_loader_dist_index_js_ref_8_0_HelloWorld_vue_vue_type_template_id_469af010__WEBPACK_IMPORTED_MODULE_0__["render"]; });



/***/ }),

/***/ "./src/components/ImagePreview.vue":
/*!*****************************************!*\
  !*** ./src/components/ImagePreview.vue ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ImagePreview_vue_vue_type_template_id_6b8b08c6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ImagePreview.vue?vue&type=template&id=6b8b08c6 */ "./src/components/ImagePreview.vue?vue&type=template&id=6b8b08c6");
/* harmony import */ var _ImagePreview_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ImagePreview.vue?vue&type=script&lang=ts */ "./src/components/ImagePreview.vue?vue&type=script&lang=ts");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _ImagePreview_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _ImagePreview_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _ImagePreview_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ImagePreview.vue?vue&type=style&index=0&lang=scss */ "./src/components/ImagePreview.vue?vue&type=style&index=0&lang=scss");





_ImagePreview_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__["default"].render = _ImagePreview_vue_vue_type_template_id_6b8b08c6__WEBPACK_IMPORTED_MODULE_0__["render"]
/* hot reload */
if (false) {}

_ImagePreview_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__["default"].__file = "src/components/ImagePreview.vue"

/* harmony default export */ __webpack_exports__["default"] = (_ImagePreview_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__["default"]);

/***/ }),

/***/ "./src/components/ImagePreview.vue?vue&type=script&lang=ts":
/*!*****************************************************************!*\
  !*** ./src/components/ImagePreview.vue?vue&type=script&lang=ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_ImagePreview_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/ts-loader??ref--2-0!../../node_modules/vue-loader/dist??ref--8-0!./ImagePreview.vue?vue&type=script&lang=ts */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/dist/index.js?!./src/components/ImagePreview.vue?vue&type=script&lang=ts");
/* harmony import */ var _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_ImagePreview_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_ImagePreview_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_ImagePreview_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0___default.a; });
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_ImagePreview_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_ImagePreview_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 

/***/ }),

/***/ "./src/components/ImagePreview.vue?vue&type=style&index=0&lang=scss":
/*!**************************************************************************!*\
  !*** ./src/components/ImagePreview.vue?vue&type=style&index=0&lang=scss ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_ImagePreview_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/dist/stylePostLoader.js!../../node_modules/sass-loader/dist/cjs.js!../../node_modules/vue-loader/dist??ref--8-0!./ImagePreview.vue?vue&type=style&index=0&lang=scss */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist/index.js?!./src/components/ImagePreview.vue?vue&type=style&index=0&lang=scss");
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_ImagePreview_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_ImagePreview_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_ImagePreview_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0___default.a; });
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_ImagePreview_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_ImagePreview_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 

/***/ }),

/***/ "./src/components/ImagePreview.vue?vue&type=template&id=6b8b08c6":
/*!***********************************************************************!*\
  !*** ./src/components/ImagePreview.vue?vue&type=template&id=6b8b08c6 ***!
  \***********************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ref_5_node_modules_vue_loader_dist_index_js_ref_8_0_ImagePreview_vue_vue_type_template_id_6b8b08c6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/dist/templateLoader.js??ref--5!../../node_modules/vue-loader/dist??ref--8-0!./ImagePreview.vue?vue&type=template&id=6b8b08c6 */ "./node_modules/vue-loader/dist/templateLoader.js?!./node_modules/vue-loader/dist/index.js?!./src/components/ImagePreview.vue?vue&type=template&id=6b8b08c6");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_dist_templateLoader_js_ref_5_node_modules_vue_loader_dist_index_js_ref_8_0_ImagePreview_vue_vue_type_template_id_6b8b08c6__WEBPACK_IMPORTED_MODULE_0__["render"]; });



/***/ }),

/***/ "./src/components/SandboxStage1.vue":
/*!******************************************!*\
  !*** ./src/components/SandboxStage1.vue ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SandboxStage1_vue_vue_type_template_id_5224fd9a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SandboxStage1.vue?vue&type=template&id=5224fd9a */ "./src/components/SandboxStage1.vue?vue&type=template&id=5224fd9a");
/* harmony import */ var _SandboxStage1_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SandboxStage1.vue?vue&type=script&lang=ts */ "./src/components/SandboxStage1.vue?vue&type=script&lang=ts");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _SandboxStage1_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _SandboxStage1_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _SandboxStage1_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SandboxStage1.vue?vue&type=style&index=0&lang=scss */ "./src/components/SandboxStage1.vue?vue&type=style&index=0&lang=scss");





_SandboxStage1_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__["default"].render = _SandboxStage1_vue_vue_type_template_id_5224fd9a__WEBPACK_IMPORTED_MODULE_0__["render"]
/* hot reload */
if (false) {}

_SandboxStage1_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__["default"].__file = "src/components/SandboxStage1.vue"

/* harmony default export */ __webpack_exports__["default"] = (_SandboxStage1_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__["default"]);

/***/ }),

/***/ "./src/components/SandboxStage1.vue?vue&type=script&lang=ts":
/*!******************************************************************!*\
  !*** ./src/components/SandboxStage1.vue?vue&type=script&lang=ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage1_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/ts-loader??ref--2-0!../../node_modules/vue-loader/dist??ref--8-0!./SandboxStage1.vue?vue&type=script&lang=ts */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/dist/index.js?!./src/components/SandboxStage1.vue?vue&type=script&lang=ts");
/* harmony import */ var _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage1_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage1_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage1_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0___default.a; });
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage1_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage1_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 

/***/ }),

/***/ "./src/components/SandboxStage1.vue?vue&type=style&index=0&lang=scss":
/*!***************************************************************************!*\
  !*** ./src/components/SandboxStage1.vue?vue&type=style&index=0&lang=scss ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage1_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/dist/stylePostLoader.js!../../node_modules/sass-loader/dist/cjs.js!../../node_modules/vue-loader/dist??ref--8-0!./SandboxStage1.vue?vue&type=style&index=0&lang=scss */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist/index.js?!./src/components/SandboxStage1.vue?vue&type=style&index=0&lang=scss");
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage1_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage1_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage1_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0___default.a; });
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage1_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage1_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 

/***/ }),

/***/ "./src/components/SandboxStage1.vue?vue&type=template&id=5224fd9a":
/*!************************************************************************!*\
  !*** ./src/components/SandboxStage1.vue?vue&type=template&id=5224fd9a ***!
  \************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ref_5_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage1_vue_vue_type_template_id_5224fd9a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/dist/templateLoader.js??ref--5!../../node_modules/vue-loader/dist??ref--8-0!./SandboxStage1.vue?vue&type=template&id=5224fd9a */ "./node_modules/vue-loader/dist/templateLoader.js?!./node_modules/vue-loader/dist/index.js?!./src/components/SandboxStage1.vue?vue&type=template&id=5224fd9a");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_dist_templateLoader_js_ref_5_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage1_vue_vue_type_template_id_5224fd9a__WEBPACK_IMPORTED_MODULE_0__["render"]; });



/***/ }),

/***/ "./src/components/SandboxStage2.vue":
/*!******************************************!*\
  !*** ./src/components/SandboxStage2.vue ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SandboxStage2_vue_vue_type_template_id_5233151b__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SandboxStage2.vue?vue&type=template&id=5233151b */ "./src/components/SandboxStage2.vue?vue&type=template&id=5233151b");
/* harmony import */ var _SandboxStage2_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SandboxStage2.vue?vue&type=script&lang=ts */ "./src/components/SandboxStage2.vue?vue&type=script&lang=ts");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _SandboxStage2_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _SandboxStage2_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _SandboxStage2_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SandboxStage2.vue?vue&type=style&index=0&lang=scss */ "./src/components/SandboxStage2.vue?vue&type=style&index=0&lang=scss");





_SandboxStage2_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__["default"].render = _SandboxStage2_vue_vue_type_template_id_5233151b__WEBPACK_IMPORTED_MODULE_0__["render"]
/* hot reload */
if (false) {}

_SandboxStage2_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__["default"].__file = "src/components/SandboxStage2.vue"

/* harmony default export */ __webpack_exports__["default"] = (_SandboxStage2_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__["default"]);

/***/ }),

/***/ "./src/components/SandboxStage2.vue?vue&type=script&lang=ts":
/*!******************************************************************!*\
  !*** ./src/components/SandboxStage2.vue?vue&type=script&lang=ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage2_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/ts-loader??ref--2-0!../../node_modules/vue-loader/dist??ref--8-0!./SandboxStage2.vue?vue&type=script&lang=ts */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/dist/index.js?!./src/components/SandboxStage2.vue?vue&type=script&lang=ts");
/* harmony import */ var _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage2_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage2_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage2_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0___default.a; });
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage2_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_ts_loader_index_js_ref_2_0_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage2_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 

/***/ }),

/***/ "./src/components/SandboxStage2.vue?vue&type=style&index=0&lang=scss":
/*!***************************************************************************!*\
  !*** ./src/components/SandboxStage2.vue?vue&type=style&index=0&lang=scss ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage2_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/dist/stylePostLoader.js!../../node_modules/sass-loader/dist/cjs.js!../../node_modules/vue-loader/dist??ref--8-0!./SandboxStage2.vue?vue&type=style&index=0&lang=scss */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist/index.js?!./src/components/SandboxStage2.vue?vue&type=style&index=0&lang=scss");
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage2_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage2_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage2_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0___default.a; });
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage2_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage2_vue_vue_type_style_index_0_lang_scss__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 

/***/ }),

/***/ "./src/components/SandboxStage2.vue?vue&type=template&id=5233151b":
/*!************************************************************************!*\
  !*** ./src/components/SandboxStage2.vue?vue&type=template&id=5233151b ***!
  \************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ref_5_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage2_vue_vue_type_template_id_5233151b__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/dist/templateLoader.js??ref--5!../../node_modules/vue-loader/dist??ref--8-0!./SandboxStage2.vue?vue&type=template&id=5233151b */ "./node_modules/vue-loader/dist/templateLoader.js?!./node_modules/vue-loader/dist/index.js?!./src/components/SandboxStage2.vue?vue&type=template&id=5233151b");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_dist_templateLoader_js_ref_5_node_modules_vue_loader_dist_index_js_ref_8_0_SandboxStage2_vue_vue_type_template_id_5233151b__WEBPACK_IMPORTED_MODULE_0__["render"]; });



/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

////{{{{ どっちでもいいぽい
//import Vue from 'vue';
//import router from './router';
//import store from './store';
//Vue.config.productionTip = false;
//new Vue({
//  //  router,
//  //  store,
//  render: (h) => h(App),
//}).$mount('#app');
// }}}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
////どっちでもいいぽい
var vue_1 = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm-bundler.js");
var App_vue_1 = __importDefault(__webpack_require__(/*! ~/App.vue */ "./src/App.vue"));
var index_1 = __importDefault(__webpack_require__(/*! ~/store/index */ "./src/store/index.ts"));
var app = vue_1.createApp(App_vue_1.default);
app.use(index_1.default);
app.mount('#app');


/***/ }),

/***/ "./src/store/index.ts":
/*!****************************!*\
  !*** ./src/store/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vuex_1 = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm-browser.js");
exports.default = vuex_1.createStore({
    state: {
        count: 0,
    },
    getters: {
        hoge: function (state) {
            return state.count;
        },
    },
    actions: {
        increment: function (_a, payload) {
            var commit = _a.commit;
            commit('increment', payload);
        },
        decrement: function (_a, payload) {
            var commit = _a.commit;
            commit('decrement', payload);
        },
    },
    mutations: {
        increment: function (state, payload) {
            if (typeof payload !== 'number')
                return;
            console.log(state.count);
            state.count += payload;
        },
        decrement: function (state, payload) {
            if (typeof payload !== 'number')
                return;
            state.count -= payload;
        },
    },
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FwcC52dWU/ZjE4NCIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9JbWFnZVByZXZpZXcudnVlPzI1NDIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvU2FuZGJveFN0YWdlMS52dWU/OGViMCIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9TYW5kYm94U3RhZ2UyLnZ1ZT9kN2MyIiwid2VicGFjazovLy8uL3NyYy9BcHAudnVlPzFjNTYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvSW1hZ2VQcmV2aWV3LnZ1ZT9hOWI1Iiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1NhbmRib3hTdGFnZTEudnVlP2IzNzkiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvU2FuZGJveFN0YWdlMi52dWU/ZDJhOSIsIndlYnBhY2s6Ly8vLi9zcmMvQXBwLnZ1ZT82NGRjIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL0hlbGxvV29ybGQudnVlPzdhNzkiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvSW1hZ2VQcmV2aWV3LnZ1ZT84ODY5Iiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1NhbmRib3hTdGFnZTEudnVlP2Q5ZTAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvU2FuZGJveFN0YWdlMi52dWU/YjEwMCIsIndlYnBhY2s6Ly8vLi9zcmMvQXBwLnZ1ZSIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9IZWxsb1dvcmxkLnZ1ZSIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9JbWFnZVByZXZpZXcudnVlIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1NhbmRib3hTdGFnZTEudnVlIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1NhbmRib3hTdGFnZTIudnVlIiwid2VicGFjazovLy8uL3NyYy9BcHAudnVlP2FkMzgiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FwcC52dWU/ZjkyOCIsIndlYnBhY2s6Ly8vLi9zcmMvQXBwLnZ1ZT84N2ZlIiwid2VicGFjazovLy8uL3NyYy9BcHAudnVlPzVmMjEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvSGVsbG9Xb3JsZC52dWU/ZTVkOSIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9IZWxsb1dvcmxkLnZ1ZT83ZGExIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL0hlbGxvV29ybGQudnVlPzY2MTUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvSW1hZ2VQcmV2aWV3LnZ1ZT80OWRkIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL0ltYWdlUHJldmlldy52dWU/MDJkNiIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9JbWFnZVByZXZpZXcudnVlPzVkYWIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvSW1hZ2VQcmV2aWV3LnZ1ZT9iZmU3Iiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1NhbmRib3hTdGFnZTEudnVlPzYxMTciLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvU2FuZGJveFN0YWdlMS52dWU/ZDVhOCIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9TYW5kYm94U3RhZ2UxLnZ1ZT82NmUxIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1NhbmRib3hTdGFnZTEudnVlP2ZlZGQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvU2FuZGJveFN0YWdlMi52dWU/MjAzYyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9TYW5kYm94U3RhZ2UyLnZ1ZT9lMzJhIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1NhbmRib3hTdGFnZTIudnVlPzk1ZmEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvU2FuZGJveFN0YWdlMi52dWU/N2M2NCIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0b3JlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLFFBQVEsb0JBQW9CO1FBQzVCO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsaUJBQWlCLDRCQUE0QjtRQUM3QztRQUNBO1FBQ0Esa0JBQWtCLDJCQUEyQjtRQUM3QztRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLGdCQUFnQix1QkFB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LEVBQUUsRUFZZjs7QUFFRCxrRkFBTTs7QUFFUyxpSjs7Ozs7Ozs7Ozs7O0FDdkJmO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBOEssQzs7Ozs7Ozs7Ozs7O0FDQTlLO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBOFQsQzs7Ozs7Ozs7Ozs7O0FDQTlUO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7O0FDQWE7QUFDYixRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQSxZQUFZLG1CQUFPLENBQUMsK0RBQUs7QUFDekIsZ0NBQWdDLG1CQUFPLENBQUMsZ0NBQVc7QUFDbkQsOEJBQThCLG1CQUFPLENBQUMsMkNBQWU7QUFDckQ7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDdEJhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQsYUFBYSxtQkFBTyxDQUFDLDBEQUFNO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTCxDQUFDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhkYXRhKSB7XG4gXHRcdHZhciBjaHVua0lkcyA9IGRhdGFbMF07XG4gXHRcdHZhciBtb3JlTW9kdWxlcyA9IGRhdGFbMV07XG4gXHRcdHZhciBleGVjdXRlTW9kdWxlcyA9IGRhdGFbMl07XG5cbiBcdFx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG4gXHRcdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuIFx0XHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwLCByZXNvbHZlcyA9IFtdO1xuIFx0XHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcbiBcdFx0XHRcdHJlc29sdmVzLnB1c2goaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKTtcbiBcdFx0XHR9XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbiBcdFx0fVxuIFx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmKHBhcmVudEpzb25wRnVuY3Rpb24pIHBhcmVudEpzb25wRnVuY3Rpb24oZGF0YSk7XG5cbiBcdFx0d2hpbGUocmVzb2x2ZXMubGVuZ3RoKSB7XG4gXHRcdFx0cmVzb2x2ZXMuc2hpZnQoKSgpO1xuIFx0XHR9XG5cbiBcdFx0Ly8gYWRkIGVudHJ5IG1vZHVsZXMgZnJvbSBsb2FkZWQgY2h1bmsgdG8gZGVmZXJyZWQgbGlzdFxuIFx0XHRkZWZlcnJlZE1vZHVsZXMucHVzaC5hcHBseShkZWZlcnJlZE1vZHVsZXMsIGV4ZWN1dGVNb2R1bGVzIHx8IFtdKTtcblxuIFx0XHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIGFsbCBjaHVua3MgcmVhZHlcbiBcdFx0cmV0dXJuIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCk7XG4gXHR9O1xuIFx0ZnVuY3Rpb24gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKSB7XG4gXHRcdHZhciByZXN1bHQ7XG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgZGVmZXJyZWRNb2R1bGUgPSBkZWZlcnJlZE1vZHVsZXNbaV07XG4gXHRcdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG4gXHRcdFx0Zm9yKHZhciBqID0gMTsgaiA8IGRlZmVycmVkTW9kdWxlLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHR2YXIgZGVwSWQgPSBkZWZlcnJlZE1vZHVsZVtqXTtcbiBcdFx0XHRcdGlmKGluc3RhbGxlZENodW5rc1tkZXBJZF0gIT09IDApIGZ1bGZpbGxlZCA9IGZhbHNlO1xuIFx0XHRcdH1cbiBcdFx0XHRpZihmdWxmaWxsZWQpIHtcbiBcdFx0XHRcdGRlZmVycmVkTW9kdWxlcy5zcGxpY2UoaS0tLCAxKTtcbiBcdFx0XHRcdHJlc3VsdCA9IF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gZGVmZXJyZWRNb2R1bGVbMF0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdHJldHVybiByZXN1bHQ7XG4gXHR9XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4gXHQvLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbiBcdC8vIFByb21pc2UgPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG4gXHR2YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuIFx0XHRcImluZGV4XCI6IDBcbiBcdH07XG5cbiBcdHZhciBkZWZlcnJlZE1vZHVsZXMgPSBbXTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0dmFyIGpzb25wQXJyYXkgPSB3aW5kb3dbXCJzYW5kYm94XCJdID0gd2luZG93W1wic2FuZGJveFwiXSB8fCBbXTtcbiBcdHZhciBvbGRKc29ucEZ1bmN0aW9uID0ganNvbnBBcnJheS5wdXNoLmJpbmQoanNvbnBBcnJheSk7XG4gXHRqc29ucEFycmF5LnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjaztcbiBcdGpzb25wQXJyYXkgPSBqc29ucEFycmF5LnNsaWNlKCk7XG4gXHRmb3IodmFyIGkgPSAwOyBpIDwganNvbnBBcnJheS5sZW5ndGg7IGkrKykgd2VicGFja0pzb25wQ2FsbGJhY2soanNvbnBBcnJheVtpXSk7XG4gXHR2YXIgcGFyZW50SnNvbnBGdW5jdGlvbiA9IG9sZEpzb25wRnVuY3Rpb247XG5cblxuIFx0Ly8gYWRkIGVudHJ5IG1vZHVsZSB0byBkZWZlcnJlZCBsaXN0XG4gXHRkZWZlcnJlZE1vZHVsZXMucHVzaChbXCIuL3NyYy9pbmRleC50c1wiLFwidmVuZG9yXCJdKTtcbiBcdC8vIHJ1biBkZWZlcnJlZCBtb2R1bGVzIHdoZW4gcmVhZHlcbiBcdHJldHVybiBjaGVja0RlZmVycmVkTW9kdWxlcygpO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKHRydWUpO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiI2FwcCB7XFxuICBmb250LWZhbWlseTogQXZlbmlyLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO1xcbiAgLXdlYmtpdC1mb250LXNtb290aGluZzogYW50aWFsaWFzZWQ7XFxuICAtbW96LW9zeC1mb250LXNtb290aGluZzogZ3JheXNjYWxlO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgY29sb3I6ICMyYzNlNTA7XFxuICBtYXJnaW4tdG9wOiA2MHB4O1xcbn1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vc3JjL0FwcC52dWVcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQ0E7RUFDRSxpREFBaUQ7RUFDakQsbUNBQW1DO0VBQ25DLGtDQUFrQztFQUNsQyxrQkFBa0I7RUFDbEIsY0FBYztFQUNkLGdCQUFnQjtBQUFBXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIlxcbiNhcHAge1xcbiAgZm9udC1mYW1pbHk6IEF2ZW5pciwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZjtcXG4gIC13ZWJraXQtZm9udC1zbW9vdGhpbmc6IGFudGlhbGlhc2VkO1xcbiAgLW1vei1vc3gtZm9udC1zbW9vdGhpbmc6IGdyYXlzY2FsZTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGNvbG9yOiAjMmMzZTUwO1xcbiAgbWFyZ2luLXRvcDogNjBweDtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyh0cnVlKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcImltZyB7XFxuICB3aWR0aDogMzAwcHg7XFxufVxcblwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly9zcmMvY29tcG9uZW50cy9JbWFnZVByZXZpZXcudnVlXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUNBO0VBQ0UsWUFBWTtBQUFBXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIlxcbmltZyB7XFxuICB3aWR0aDogMzAwcHg7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18odHJ1ZSk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCIuc3RhZ2Uge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG4uc3RhZ2UtdGl0bGUge1xcbiAgICBmb250LXdlaWdodDogYm9sZDtcXG59XFxuLnN0YWdlLWRldGFpbCB7XFxuICAgIGNvbG9yOiAjMzMzO1xcbn1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vc3JjL2NvbXBvbmVudHMvU2FuZGJveFN0YWdlMS52dWVcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQ0E7RUFDRSxhQUFhO0VBQ2IsdUJBQXVCO0FBQUE7QUFFdkI7SUFDRSxpQkFBaUI7QUFBQTtBQUduQjtJQUNFLFdBQVc7QUFBQVwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJcXG4uc3RhZ2Uge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcblxcbiAgJi10aXRsZSB7XFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgfVxcblxcbiAgJi1kZXRhaWwge1xcbiAgICBjb2xvcjogIzMzMztcXG4gIH1cXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyh0cnVlKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIi5zdGFnZSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcbi5zdGFnZS10aXRsZSB7XFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xcbn1cXG4uc3RhZ2UtZGV0YWlsIHtcXG4gICAgY29sb3I6ICMzMzM7XFxufVxcblwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly9zcmMvY29tcG9uZW50cy9TYW5kYm94U3RhZ2UyLnZ1ZVwiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFDQTtFQUNFLGFBQWE7RUFDYix1QkFBdUI7QUFBQTtBQUV2QjtJQUNFLGlCQUFpQjtBQUFBO0FBR25CO0lBQ0UsV0FBVztBQUFBXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIlxcbi5zdGFnZSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuXFxuICAmLXRpdGxlIHtcXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICB9XFxuXFxuICAmLWRldGFpbCB7XFxuICAgIGNvbG9yOiAjMzMzO1xcbiAgfVxcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwidmFyIGFwaSA9IHJlcXVpcmUoXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCIpO1xuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L3N0eWxlUG9zdExvYWRlci5qcyEuLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC9pbmRleC5qcz8/cmVmLS04LTAhLi9BcHAudnVlP3Z1ZSZ0eXBlPXN0eWxlJmluZGV4PTAmbGFuZz1zY3NzXCIpO1xuXG4gICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5fX2VzTW9kdWxlID8gY29udGVudC5kZWZhdWx0IDogY29udGVudDtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4gICAgICAgICAgICB9XG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuaW5zZXJ0ID0gXCJoZWFkXCI7XG5vcHRpb25zLnNpbmdsZXRvbiA9IGZhbHNlO1xuXG52YXIgdXBkYXRlID0gYXBpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscyB8fCB7fTsiLCJ2YXIgYXBpID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIik7XG4gICAgICAgICAgICB2YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2Rpc3Qvc3R5bGVQb3N0TG9hZGVyLmpzIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L2luZGV4LmpzPz9yZWYtLTgtMCEuL0ltYWdlUHJldmlldy52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZsYW5nPXNjc3NcIik7XG5cbiAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50Ll9fZXNNb2R1bGUgPyBjb250ZW50LmRlZmF1bHQgOiBjb250ZW50O1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbiAgICAgICAgICAgIH1cblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5pbnNlcnQgPSBcImhlYWRcIjtcbm9wdGlvbnMuc2luZ2xldG9uID0gZmFsc2U7XG5cbnZhciB1cGRhdGUgPSBhcGkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzIHx8IHt9OyIsInZhciBhcGkgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiKTtcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC9zdHlsZVBvc3RMb2FkZXIuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2Rpc3QvaW5kZXguanM/P3JlZi0tOC0wIS4vU2FuZGJveFN0YWdlMS52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZsYW5nPXNjc3NcIik7XG5cbiAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50Ll9fZXNNb2R1bGUgPyBjb250ZW50LmRlZmF1bHQgOiBjb250ZW50O1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbiAgICAgICAgICAgIH1cblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5pbnNlcnQgPSBcImhlYWRcIjtcbm9wdGlvbnMuc2luZ2xldG9uID0gZmFsc2U7XG5cbnZhciB1cGRhdGUgPSBhcGkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzIHx8IHt9OyIsInZhciBhcGkgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiKTtcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC9zdHlsZVBvc3RMb2FkZXIuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2Rpc3QvaW5kZXguanM/P3JlZi0tOC0wIS4vU2FuZGJveFN0YWdlMi52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZsYW5nPXNjc3NcIik7XG5cbiAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50Ll9fZXNNb2R1bGUgPyBjb250ZW50LmRlZmF1bHQgOiBjb250ZW50O1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbiAgICAgICAgICAgIH1cblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5pbnNlcnQgPSBcImhlYWRcIjtcbm9wdGlvbnMuc2luZ2xldG9uID0gZmFsc2U7XG5cbnZhciB1cGRhdGUgPSBhcGkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzIHx8IHt9OyIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEhlbGxvV29ybGRfdnVlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIn4vY29tcG9uZW50cy9IZWxsb1dvcmxkLnZ1ZVwiKSk7XG52YXIgSW1hZ2VQcmV2aWV3X3Z1ZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJ+L2NvbXBvbmVudHMvSW1hZ2VQcmV2aWV3LnZ1ZVwiKSk7XG52YXIgU2FuZGJveFN0YWdlMV92dWVfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwifi9jb21wb25lbnRzL1NhbmRib3hTdGFnZTEudnVlXCIpKTtcbnZhciBTYW5kYm94U3RhZ2UyX3Z1ZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJ+L2NvbXBvbmVudHMvU2FuZGJveFN0YWdlMi52dWVcIikpO1xuZXhwb3J0cy5kZWZhdWx0ID0ge1xuICAgIG5hbWU6ICdBcHAnLFxuICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgSGVsbG9Xb3JsZDogSGVsbG9Xb3JsZF92dWVfMS5kZWZhdWx0LFxuICAgICAgICBJbWFnZVByZXZpZXc6IEltYWdlUHJldmlld192dWVfMS5kZWZhdWx0LFxuICAgICAgICBTYW5kYm94U3RhZ2UxOiBTYW5kYm94U3RhZ2UxX3Z1ZV8xLmRlZmF1bHQsXG4gICAgICAgIFNhbmRib3hTdGFnZTI6IFNhbmRib3hTdGFnZTJfdnVlXzEuZGVmYXVsdCxcbiAgICB9LFxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0ge307XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIGNvbXBvc2l0aW9uIHN0eWxlXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSB7fTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHZ1ZV8xID0gcmVxdWlyZShcInZ1ZVwiKTtcbmV4cG9ydHMuZGVmYXVsdCA9IHtcbiAgICBzZXR1cDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc3RhdGUgPSB2dWVfMS5yZWFjdGl2ZSh7XG4gICAgICAgICAgICBjb3VudDogMCxcbiAgICAgICAgfSk7XG4gICAgICAgIGZ1bmN0aW9uIGluY3JlbWVudCgpIHtcbiAgICAgICAgICAgIHN0YXRlLmNvdW50Kys7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZGVjcmVtZW50KCkge1xuICAgICAgICAgICAgc3RhdGUuY291bnQtLTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgICAgICAgaW5jcmVtZW50OiBpbmNyZW1lbnQsXG4gICAgICAgICAgICBkZWNyZW1lbnQ6IGRlY3JlbWVudCxcbiAgICAgICAgfTtcbiAgICB9LFxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHZ1ZV8xID0gcmVxdWlyZShcInZ1ZVwiKTtcbnZhciB2dWV4XzEgPSByZXF1aXJlKFwidnVleFwiKTtcbmV4cG9ydHMuZGVmYXVsdCA9IHtcbiAgICBzZXR1cDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc3RvcmUgPSB2dWV4XzEudXNlU3RvcmUoKTtcbiAgICAgICAgdmFyIGNvdW50ID0gdnVlXzEuY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyByZXR1cm4gc3RvcmUuc3RhdGUuY291bnQ7IH0pO1xuICAgICAgICB2YXIgaW5jcmVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goJ2luY3JlbWVudCcsIDEpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgZGVjcmVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goJ2RlY3JlbWVudCcsIDEpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY291bnQ6IGNvdW50LFxuICAgICAgICAgICAgaW5jcmVtZW50OiBpbmNyZW1lbnQsXG4gICAgICAgICAgICBkZWNyZW1lbnQ6IGRlY3JlbWVudCxcbiAgICAgICAgfTtcbiAgICB9LFxufTtcbiIsIjx0ZW1wbGF0ZT5cbiAgPGRpdiBpZD1cImFwcFwiPlxuICAgIDxwPmhvZ2VoZ29lPC9wPlxuICAgIDxpbWcgYWx0PVwiVnVlIGxvZ29cIiBzcmM9XCIvaW1nL3Rlc3QucG5nXCIgLz5cbiAgICA8aHIgLz5cbiAgICA8SGVsbG9Xb3JsZCBtc2c9XCJXZWxjb21lIHRvIFlvdXIgVnVlLmpzIEFwcFwiIC8+XG4gICAgPGhyIC8+XG4gICAgPFNhbmRib3hTdGFnZTE+PC9TYW5kYm94U3RhZ2UxPlxuICAgIDxociAvPlxuICAgIDxTYW5kYm94U3RhZ2UyPjwvU2FuZGJveFN0YWdlMj5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0IGxhbmc9XCJ0c1wiPlxuaW1wb3J0IEhlbGxvV29ybGQgZnJvbSAnfi9jb21wb25lbnRzL0hlbGxvV29ybGQudnVlJztcbmltcG9ydCBJbWFnZVByZXZpZXcgZnJvbSAnfi9jb21wb25lbnRzL0ltYWdlUHJldmlldy52dWUnO1xuaW1wb3J0IFNhbmRib3hTdGFnZTEgZnJvbSAnfi9jb21wb25lbnRzL1NhbmRib3hTdGFnZTEudnVlJztcbmltcG9ydCBTYW5kYm94U3RhZ2UyIGZyb20gJ34vY29tcG9uZW50cy9TYW5kYm94U3RhZ2UyLnZ1ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ0FwcCcsXG4gIGNvbXBvbmVudHM6IHtcbiAgICBIZWxsb1dvcmxkLFxuICAgIEltYWdlUHJldmlldyxcbiAgICBTYW5kYm94U3RhZ2UxLFxuICAgIFNhbmRib3hTdGFnZTIsXG4gIH0sXG59O1xuPC9zY3JpcHQ+XG5cbjxzdHlsZSBsYW5nPVwic2Nzc1wiPlxuI2FwcCB7XG4gIGZvbnQtZmFtaWx5OiBBdmVuaXIsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7XG4gIC13ZWJraXQtZm9udC1zbW9vdGhpbmc6IGFudGlhbGlhc2VkO1xuICAtbW96LW9zeC1mb250LXNtb290aGluZzogZ3JheXNjYWxlO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGNvbG9yOiAjMmMzZTUwO1xuICBtYXJnaW4tdG9wOiA2MHB4O1xufVxuPC9zdHlsZT5cbiIsIjx0ZW1wbGF0ZT5cbiAgPHA+SGVsbG9Xb3JsZCEhITwvcD5cbiAgPHA+SGVsbG9Xb3JsZCEhITwvcD5cbiAgPHA+SGVsbG9Xb3JsZCEhITwvcD5cbiAgPHA+SGVsbG9Xb3JsZCEhITwvcD5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQgbGFuZz1cInRzXCI+XG5leHBvcnQgZGVmYXVsdCB7fTtcbjwvc2NyaXB0PlxuXG48c3R5bGUgbGFuZz1cInNjc3NcIj48L3N0eWxlPlxuIiwiPHRlbXBsYXRlPlxuICA8ZGl2PlxuICAgIDxpbWcgYWx0PVwiVnVlIGxvZ29cIiBzcmM9XCIvaW1nL3Rlc3QucG5nXCIgLz5cbiAgICA8cD7jgYzjgZ7jgYY8L3A+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdCBsYW5nPVwidHNcIj5cbi8vIGNvbXBvc2l0aW9uIHN0eWxlXG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuPC9zY3JpcHQ+XG5cbjxzdHlsZSBsYW5nPVwic2Nzc1wiPlxuaW1nIHtcbiAgd2lkdGg6IDMwMHB4O1xufVxuPC9zdHlsZT5cbiIsIjx0ZW1wbGF0ZT5cbiAgPGRsIGNsYXNzPVwic3RhZ2VcIj5cbiAgICA8ZHQgY2xhc3M9XCJzdGFnZS10aXRsZVwiPmNvdW50PC9kdD5cbiAgICA8ZGQgY2xhc3M9XCJzdGFnZS1kZXRhaWxcIj57eyBzdGF0ZS5jb3VudCB9fTwvZGQ+XG4gIDwvZGw+XG4gIDxidXR0b24gQGNsaWNrPVwiaW5jcmVtZW50XCI+KzE8L2J1dHRvbj5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJkZWNyZW1lbnRcIj4tMTwvYnV0dG9uPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdCBsYW5nPVwidHNcIj5cbmltcG9ydCB7IHJlYWN0aXZlLCBjb21wdXRlZCB9IGZyb20gJ3Z1ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgc2V0dXAoKSB7XG4gICAgY29uc3Qgc3RhdGUgPSByZWFjdGl2ZTx7IGNvdW50OiBudW1iZXIgfT4oe1xuICAgICAgY291bnQ6IDAsXG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBpbmNyZW1lbnQoKSB7XG4gICAgICBzdGF0ZS5jb3VudCsrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlY3JlbWVudCgpIHtcbiAgICAgIHN0YXRlLmNvdW50LS07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXRlLFxuICAgICAgaW5jcmVtZW50LFxuICAgICAgZGVjcmVtZW50LFxuICAgIH07XG4gIH0sXG59O1xuPC9zY3JpcHQ+XG5cbjxzdHlsZSBsYW5nPVwic2Nzc1wiPlxuLnN0YWdlIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cbiAgJi10aXRsZSB7XG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIH1cblxuICAmLWRldGFpbCB7XG4gICAgY29sb3I6ICMzMzM7XG4gIH1cbn1cbjwvc3R5bGU+XG4iLCI8dGVtcGxhdGU+XG4gIDxkbCBjbGFzcz1cInN0YWdlXCI+XG4gICAgPGR0IGNsYXNzPVwic3RhZ2UtdGl0bGVcIj5jb3VudDwvZHQ+XG4gICAgPGRkIGNsYXNzPVwic3RhZ2UtZGV0YWlsXCI+e3sgY291bnQgfX08L2RkPlxuICA8L2RsPlxuICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudFwiPisxPC9idXR0b24+XG4gIDxidXR0b24gQGNsaWNrPVwiZGVjcmVtZW50XCI+LTE8L2J1dHRvbj5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQgbGFuZz1cInRzXCI+XG5pbXBvcnQgeyByZWFjdGl2ZSwgY29tcHV0ZWQgfSBmcm9tICd2dWUnO1xuaW1wb3J0IHsgdXNlU3RvcmUgfSBmcm9tICd2dWV4JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBzZXR1cCgpIHtcbiAgICBjb25zdCBzdG9yZSA9IHVzZVN0b3JlKCk7XG5cbiAgICBjb25zdCBjb3VudCA9IGNvbXB1dGVkKCgpID0+IHN0b3JlLnN0YXRlLmNvdW50KTtcblxuICAgIGNvbnN0IGluY3JlbWVudCA9ICgpID0+IHtcbiAgICAgIHN0b3JlLmRpc3BhdGNoKCdpbmNyZW1lbnQnLCAxKTtcbiAgICB9O1xuXG4gICAgY29uc3QgZGVjcmVtZW50ID0gKCkgPT4ge1xuICAgICAgc3RvcmUuZGlzcGF0Y2goJ2RlY3JlbWVudCcsIDEpO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgY291bnQsXG4gICAgICBpbmNyZW1lbnQsXG4gICAgICBkZWNyZW1lbnQsXG4gICAgfTtcbiAgfSxcbn07XG48L3NjcmlwdD5cblxuPHN0eWxlIGxhbmc9XCJzY3NzXCI+XG4uc3RhZ2Uge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblxuICAmLXRpdGxlIHtcbiAgICBmb250LXdlaWdodDogYm9sZDtcbiAgfVxuXG4gICYtZGV0YWlsIHtcbiAgICBjb2xvcjogIzMzMztcbiAgfVxufVxuPC9zdHlsZT5cbiIsImltcG9ydCB7IHJlbmRlciB9IGZyb20gXCIuL0FwcC52dWU/dnVlJnR5cGU9dGVtcGxhdGUmaWQ9N2JhNWJkOTBcIlxuaW1wb3J0IHNjcmlwdCBmcm9tIFwiLi9BcHAudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPXRzXCJcbmV4cG9ydCAqIGZyb20gXCIuL0FwcC52dWU/dnVlJnR5cGU9c2NyaXB0Jmxhbmc9dHNcIlxuXG5pbXBvcnQgXCIuL0FwcC52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZsYW5nPXNjc3NcIlxuc2NyaXB0LnJlbmRlciA9IHJlbmRlclxuLyogaG90IHJlbG9hZCAqL1xuaWYgKG1vZHVsZS5ob3QpIHtcbiAgc2NyaXB0Ll9faG1ySWQgPSBcIjdiYTViZDkwXCJcbiAgY29uc3QgYXBpID0gX19WVUVfSE1SX1JVTlRJTUVfX1xuICBtb2R1bGUuaG90LmFjY2VwdCgpXG4gIGlmICghYXBpLmNyZWF0ZVJlY29yZCgnN2JhNWJkOTAnLCBzY3JpcHQpKSB7XG4gICAgYXBpLnJlbG9hZCgnN2JhNWJkOTAnLCBzY3JpcHQpXG4gIH1cbiAgXG4gIG1vZHVsZS5ob3QuYWNjZXB0KFwiLi9BcHAudnVlP3Z1ZSZ0eXBlPXRlbXBsYXRlJmlkPTdiYTViZDkwXCIsICgpID0+IHtcbiAgICBhcGkucmVyZW5kZXIoJzdiYTViZDkwJywgcmVuZGVyKVxuICB9KVxuXG59XG5cbnNjcmlwdC5fX2ZpbGUgPSBcInNyYy9BcHAudnVlXCJcblxuZXhwb3J0IGRlZmF1bHQgc2NyaXB0IiwiZXhwb3J0IHsgZGVmYXVsdCB9IGZyb20gXCItIS4uL25vZGVfbW9kdWxlcy90cy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMi0wIS4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2Rpc3QvaW5kZXguanM/P3JlZi0tOC0wIS4vQXBwLnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz10c1wiOyBleHBvcnQgKiBmcm9tIFwiLSEuLi9ub2RlX21vZHVsZXMvdHMtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTItMCEuLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L2luZGV4LmpzPz9yZWYtLTgtMCEuL0FwcC52dWU/dnVlJnR5cGU9c2NyaXB0Jmxhbmc9dHNcIiIsImV4cG9ydCB7IGRlZmF1bHQgfSBmcm9tIFwiLSEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2Rpc3Qvc3R5bGVQb3N0TG9hZGVyLmpzIS4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L2luZGV4LmpzPz9yZWYtLTgtMCEuL0FwcC52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZsYW5nPXNjc3NcIjsgZXhwb3J0ICogZnJvbSBcIi0hLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L3N0eWxlUG9zdExvYWRlci5qcyEuLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC9pbmRleC5qcz8/cmVmLS04LTAhLi9BcHAudnVlP3Z1ZSZ0eXBlPXN0eWxlJmluZGV4PTAmbGFuZz1zY3NzXCIiLCJleHBvcnQgKiBmcm9tIFwiLSEuLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L3RlbXBsYXRlTG9hZGVyLmpzPz9yZWYtLTUhLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC9pbmRleC5qcz8/cmVmLS04LTAhLi9BcHAudnVlP3Z1ZSZ0eXBlPXRlbXBsYXRlJmlkPTdiYTViZDkwXCIiLCJpbXBvcnQgeyByZW5kZXIgfSBmcm9tIFwiLi9IZWxsb1dvcmxkLnZ1ZT92dWUmdHlwZT10ZW1wbGF0ZSZpZD00NjlhZjAxMFwiXG5pbXBvcnQgc2NyaXB0IGZyb20gXCIuL0hlbGxvV29ybGQudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPXRzXCJcbmV4cG9ydCAqIGZyb20gXCIuL0hlbGxvV29ybGQudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPXRzXCJcbnNjcmlwdC5yZW5kZXIgPSByZW5kZXJcbi8qIGhvdCByZWxvYWQgKi9cbmlmIChtb2R1bGUuaG90KSB7XG4gIHNjcmlwdC5fX2htcklkID0gXCI0NjlhZjAxMFwiXG4gIGNvbnN0IGFwaSA9IF9fVlVFX0hNUl9SVU5USU1FX19cbiAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICBpZiAoIWFwaS5jcmVhdGVSZWNvcmQoJzQ2OWFmMDEwJywgc2NyaXB0KSkge1xuICAgIGFwaS5yZWxvYWQoJzQ2OWFmMDEwJywgc2NyaXB0KVxuICB9XG4gIFxuICBtb2R1bGUuaG90LmFjY2VwdChcIi4vSGVsbG9Xb3JsZC52dWU/dnVlJnR5cGU9dGVtcGxhdGUmaWQ9NDY5YWYwMTBcIiwgKCkgPT4ge1xuICAgIGFwaS5yZXJlbmRlcignNDY5YWYwMTAnLCByZW5kZXIpXG4gIH0pXG5cbn1cblxuc2NyaXB0Ll9fZmlsZSA9IFwic3JjL2NvbXBvbmVudHMvSGVsbG9Xb3JsZC52dWVcIlxuXG5leHBvcnQgZGVmYXVsdCBzY3JpcHQiLCJleHBvcnQgeyBkZWZhdWx0IH0gZnJvbSBcIi0hLi4vLi4vbm9kZV9tb2R1bGVzL3RzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0yLTAhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC9pbmRleC5qcz8/cmVmLS04LTAhLi9IZWxsb1dvcmxkLnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz10c1wiOyBleHBvcnQgKiBmcm9tIFwiLSEuLi8uLi9ub2RlX21vZHVsZXMvdHMtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTItMCEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L2luZGV4LmpzPz9yZWYtLTgtMCEuL0hlbGxvV29ybGQudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPXRzXCIiLCJleHBvcnQgKiBmcm9tIFwiLSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L3RlbXBsYXRlTG9hZGVyLmpzPz9yZWYtLTUhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC9pbmRleC5qcz8/cmVmLS04LTAhLi9IZWxsb1dvcmxkLnZ1ZT92dWUmdHlwZT10ZW1wbGF0ZSZpZD00NjlhZjAxMFwiIiwiaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSBcIi4vSW1hZ2VQcmV2aWV3LnZ1ZT92dWUmdHlwZT10ZW1wbGF0ZSZpZD02YjhiMDhjNlwiXG5pbXBvcnQgc2NyaXB0IGZyb20gXCIuL0ltYWdlUHJldmlldy52dWU/dnVlJnR5cGU9c2NyaXB0Jmxhbmc9dHNcIlxuZXhwb3J0ICogZnJvbSBcIi4vSW1hZ2VQcmV2aWV3LnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz10c1wiXG5cbmltcG9ydCBcIi4vSW1hZ2VQcmV2aWV3LnZ1ZT92dWUmdHlwZT1zdHlsZSZpbmRleD0wJmxhbmc9c2Nzc1wiXG5zY3JpcHQucmVuZGVyID0gcmVuZGVyXG4vKiBob3QgcmVsb2FkICovXG5pZiAobW9kdWxlLmhvdCkge1xuICBzY3JpcHQuX19obXJJZCA9IFwiNmI4YjA4YzZcIlxuICBjb25zdCBhcGkgPSBfX1ZVRV9ITVJfUlVOVElNRV9fXG4gIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgaWYgKCFhcGkuY3JlYXRlUmVjb3JkKCc2YjhiMDhjNicsIHNjcmlwdCkpIHtcbiAgICBhcGkucmVsb2FkKCc2YjhiMDhjNicsIHNjcmlwdClcbiAgfVxuICBcbiAgbW9kdWxlLmhvdC5hY2NlcHQoXCIuL0ltYWdlUHJldmlldy52dWU/dnVlJnR5cGU9dGVtcGxhdGUmaWQ9NmI4YjA4YzZcIiwgKCkgPT4ge1xuICAgIGFwaS5yZXJlbmRlcignNmI4YjA4YzYnLCByZW5kZXIpXG4gIH0pXG5cbn1cblxuc2NyaXB0Ll9fZmlsZSA9IFwic3JjL2NvbXBvbmVudHMvSW1hZ2VQcmV2aWV3LnZ1ZVwiXG5cbmV4cG9ydCBkZWZhdWx0IHNjcmlwdCIsImV4cG9ydCB7IGRlZmF1bHQgfSBmcm9tIFwiLSEuLi8uLi9ub2RlX21vZHVsZXMvdHMtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTItMCEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L2luZGV4LmpzPz9yZWYtLTgtMCEuL0ltYWdlUHJldmlldy52dWU/dnVlJnR5cGU9c2NyaXB0Jmxhbmc9dHNcIjsgZXhwb3J0ICogZnJvbSBcIi0hLi4vLi4vbm9kZV9tb2R1bGVzL3RzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0yLTAhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC9pbmRleC5qcz8/cmVmLS04LTAhLi9JbWFnZVByZXZpZXcudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPXRzXCIiLCJleHBvcnQgeyBkZWZhdWx0IH0gZnJvbSBcIi0hLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L3N0eWxlUG9zdExvYWRlci5qcyEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC9pbmRleC5qcz8/cmVmLS04LTAhLi9JbWFnZVByZXZpZXcudnVlP3Z1ZSZ0eXBlPXN0eWxlJmluZGV4PTAmbGFuZz1zY3NzXCI7IGV4cG9ydCAqIGZyb20gXCItIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC9zdHlsZVBvc3RMb2FkZXIuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2Rpc3QvaW5kZXguanM/P3JlZi0tOC0wIS4vSW1hZ2VQcmV2aWV3LnZ1ZT92dWUmdHlwZT1zdHlsZSZpbmRleD0wJmxhbmc9c2Nzc1wiIiwiZXhwb3J0ICogZnJvbSBcIi0hLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC90ZW1wbGF0ZUxvYWRlci5qcz8/cmVmLS01IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2Rpc3QvaW5kZXguanM/P3JlZi0tOC0wIS4vSW1hZ2VQcmV2aWV3LnZ1ZT92dWUmdHlwZT10ZW1wbGF0ZSZpZD02YjhiMDhjNlwiIiwiaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSBcIi4vU2FuZGJveFN0YWdlMS52dWU/dnVlJnR5cGU9dGVtcGxhdGUmaWQ9NTIyNGZkOWFcIlxuaW1wb3J0IHNjcmlwdCBmcm9tIFwiLi9TYW5kYm94U3RhZ2UxLnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz10c1wiXG5leHBvcnQgKiBmcm9tIFwiLi9TYW5kYm94U3RhZ2UxLnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz10c1wiXG5cbmltcG9ydCBcIi4vU2FuZGJveFN0YWdlMS52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZsYW5nPXNjc3NcIlxuc2NyaXB0LnJlbmRlciA9IHJlbmRlclxuLyogaG90IHJlbG9hZCAqL1xuaWYgKG1vZHVsZS5ob3QpIHtcbiAgc2NyaXB0Ll9faG1ySWQgPSBcIjUyMjRmZDlhXCJcbiAgY29uc3QgYXBpID0gX19WVUVfSE1SX1JVTlRJTUVfX1xuICBtb2R1bGUuaG90LmFjY2VwdCgpXG4gIGlmICghYXBpLmNyZWF0ZVJlY29yZCgnNTIyNGZkOWEnLCBzY3JpcHQpKSB7XG4gICAgYXBpLnJlbG9hZCgnNTIyNGZkOWEnLCBzY3JpcHQpXG4gIH1cbiAgXG4gIG1vZHVsZS5ob3QuYWNjZXB0KFwiLi9TYW5kYm94U3RhZ2UxLnZ1ZT92dWUmdHlwZT10ZW1wbGF0ZSZpZD01MjI0ZmQ5YVwiLCAoKSA9PiB7XG4gICAgYXBpLnJlcmVuZGVyKCc1MjI0ZmQ5YScsIHJlbmRlcilcbiAgfSlcblxufVxuXG5zY3JpcHQuX19maWxlID0gXCJzcmMvY29tcG9uZW50cy9TYW5kYm94U3RhZ2UxLnZ1ZVwiXG5cbmV4cG9ydCBkZWZhdWx0IHNjcmlwdCIsImV4cG9ydCB7IGRlZmF1bHQgfSBmcm9tIFwiLSEuLi8uLi9ub2RlX21vZHVsZXMvdHMtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTItMCEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L2luZGV4LmpzPz9yZWYtLTgtMCEuL1NhbmRib3hTdGFnZTEudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPXRzXCI7IGV4cG9ydCAqIGZyb20gXCItIS4uLy4uL25vZGVfbW9kdWxlcy90cy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMi0wIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2Rpc3QvaW5kZXguanM/P3JlZi0tOC0wIS4vU2FuZGJveFN0YWdlMS52dWU/dnVlJnR5cGU9c2NyaXB0Jmxhbmc9dHNcIiIsImV4cG9ydCB7IGRlZmF1bHQgfSBmcm9tIFwiLSEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2Rpc3Qvc3R5bGVQb3N0TG9hZGVyLmpzIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L2luZGV4LmpzPz9yZWYtLTgtMCEuL1NhbmRib3hTdGFnZTEudnVlP3Z1ZSZ0eXBlPXN0eWxlJmluZGV4PTAmbGFuZz1zY3NzXCI7IGV4cG9ydCAqIGZyb20gXCItIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC9zdHlsZVBvc3RMb2FkZXIuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2Rpc3QvaW5kZXguanM/P3JlZi0tOC0wIS4vU2FuZGJveFN0YWdlMS52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZsYW5nPXNjc3NcIiIsImV4cG9ydCAqIGZyb20gXCItIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2Rpc3QvdGVtcGxhdGVMb2FkZXIuanM/P3JlZi0tNSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L2luZGV4LmpzPz9yZWYtLTgtMCEuL1NhbmRib3hTdGFnZTEudnVlP3Z1ZSZ0eXBlPXRlbXBsYXRlJmlkPTUyMjRmZDlhXCIiLCJpbXBvcnQgeyByZW5kZXIgfSBmcm9tIFwiLi9TYW5kYm94U3RhZ2UyLnZ1ZT92dWUmdHlwZT10ZW1wbGF0ZSZpZD01MjMzMTUxYlwiXG5pbXBvcnQgc2NyaXB0IGZyb20gXCIuL1NhbmRib3hTdGFnZTIudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPXRzXCJcbmV4cG9ydCAqIGZyb20gXCIuL1NhbmRib3hTdGFnZTIudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPXRzXCJcblxuaW1wb3J0IFwiLi9TYW5kYm94U3RhZ2UyLnZ1ZT92dWUmdHlwZT1zdHlsZSZpbmRleD0wJmxhbmc9c2Nzc1wiXG5zY3JpcHQucmVuZGVyID0gcmVuZGVyXG4vKiBob3QgcmVsb2FkICovXG5pZiAobW9kdWxlLmhvdCkge1xuICBzY3JpcHQuX19obXJJZCA9IFwiNTIzMzE1MWJcIlxuICBjb25zdCBhcGkgPSBfX1ZVRV9ITVJfUlVOVElNRV9fXG4gIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgaWYgKCFhcGkuY3JlYXRlUmVjb3JkKCc1MjMzMTUxYicsIHNjcmlwdCkpIHtcbiAgICBhcGkucmVsb2FkKCc1MjMzMTUxYicsIHNjcmlwdClcbiAgfVxuICBcbiAgbW9kdWxlLmhvdC5hY2NlcHQoXCIuL1NhbmRib3hTdGFnZTIudnVlP3Z1ZSZ0eXBlPXRlbXBsYXRlJmlkPTUyMzMxNTFiXCIsICgpID0+IHtcbiAgICBhcGkucmVyZW5kZXIoJzUyMzMxNTFiJywgcmVuZGVyKVxuICB9KVxuXG59XG5cbnNjcmlwdC5fX2ZpbGUgPSBcInNyYy9jb21wb25lbnRzL1NhbmRib3hTdGFnZTIudnVlXCJcblxuZXhwb3J0IGRlZmF1bHQgc2NyaXB0IiwiZXhwb3J0IHsgZGVmYXVsdCB9IGZyb20gXCItIS4uLy4uL25vZGVfbW9kdWxlcy90cy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMi0wIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2Rpc3QvaW5kZXguanM/P3JlZi0tOC0wIS4vU2FuZGJveFN0YWdlMi52dWU/dnVlJnR5cGU9c2NyaXB0Jmxhbmc9dHNcIjsgZXhwb3J0ICogZnJvbSBcIi0hLi4vLi4vbm9kZV9tb2R1bGVzL3RzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0yLTAhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC9pbmRleC5qcz8/cmVmLS04LTAhLi9TYW5kYm94U3RhZ2UyLnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz10c1wiIiwiZXhwb3J0IHsgZGVmYXVsdCB9IGZyb20gXCItIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC9zdHlsZVBvc3RMb2FkZXIuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2Rpc3QvaW5kZXguanM/P3JlZi0tOC0wIS4vU2FuZGJveFN0YWdlMi52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZsYW5nPXNjc3NcIjsgZXhwb3J0ICogZnJvbSBcIi0hLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L3N0eWxlUG9zdExvYWRlci5qcyEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC9pbmRleC5qcz8/cmVmLS04LTAhLi9TYW5kYm94U3RhZ2UyLnZ1ZT92dWUmdHlwZT1zdHlsZSZpbmRleD0wJmxhbmc9c2Nzc1wiIiwiZXhwb3J0ICogZnJvbSBcIi0hLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC90ZW1wbGF0ZUxvYWRlci5qcz8/cmVmLS01IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2Rpc3QvaW5kZXguanM/P3JlZi0tOC0wIS4vU2FuZGJveFN0YWdlMi52dWU/dnVlJnR5cGU9dGVtcGxhdGUmaWQ9NTIzMzE1MWJcIiIsIlwidXNlIHN0cmljdFwiO1xuLy8vL3t7e3sg44Gp44Gj44Gh44Gn44KC44GE44GE44G944GEXG4vL2ltcG9ydCBWdWUgZnJvbSAndnVlJztcbi8vaW1wb3J0IHJvdXRlciBmcm9tICcuL3JvdXRlcic7XG4vL2ltcG9ydCBzdG9yZSBmcm9tICcuL3N0b3JlJztcbi8vVnVlLmNvbmZpZy5wcm9kdWN0aW9uVGlwID0gZmFsc2U7XG4vL25ldyBWdWUoe1xuLy8gIC8vICByb3V0ZXIsXG4vLyAgLy8gIHN0b3JlLFxuLy8gIHJlbmRlcjogKGgpID0+IGgoQXBwKSxcbi8vfSkuJG1vdW50KCcjYXBwJyk7XG4vLyB9fX1cbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8vLy/jganjgaPjgaHjgafjgoLjgYTjgYTjgb3jgYRcbnZhciB2dWVfMSA9IHJlcXVpcmUoXCJ2dWVcIik7XG52YXIgQXBwX3Z1ZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJ+L0FwcC52dWVcIikpO1xudmFyIGluZGV4XzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIn4vc3RvcmUvaW5kZXhcIikpO1xudmFyIGFwcCA9IHZ1ZV8xLmNyZWF0ZUFwcChBcHBfdnVlXzEuZGVmYXVsdCk7XG5hcHAudXNlKGluZGV4XzEuZGVmYXVsdCk7XG5hcHAubW91bnQoJyNhcHAnKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHZ1ZXhfMSA9IHJlcXVpcmUoXCJ2dWV4XCIpO1xuZXhwb3J0cy5kZWZhdWx0ID0gdnVleF8xLmNyZWF0ZVN0b3JlKHtcbiAgICBzdGF0ZToge1xuICAgICAgICBjb3VudDogMCxcbiAgICB9LFxuICAgIGdldHRlcnM6IHtcbiAgICAgICAgaG9nZTogZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUuY291bnQ7XG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBhY3Rpb25zOiB7XG4gICAgICAgIGluY3JlbWVudDogZnVuY3Rpb24gKF9hLCBwYXlsb2FkKSB7XG4gICAgICAgICAgICB2YXIgY29tbWl0ID0gX2EuY29tbWl0O1xuICAgICAgICAgICAgY29tbWl0KCdpbmNyZW1lbnQnLCBwYXlsb2FkKTtcbiAgICAgICAgfSxcbiAgICAgICAgZGVjcmVtZW50OiBmdW5jdGlvbiAoX2EsIHBheWxvYWQpIHtcbiAgICAgICAgICAgIHZhciBjb21taXQgPSBfYS5jb21taXQ7XG4gICAgICAgICAgICBjb21taXQoJ2RlY3JlbWVudCcsIHBheWxvYWQpO1xuICAgICAgICB9LFxuICAgIH0sXG4gICAgbXV0YXRpb25zOiB7XG4gICAgICAgIGluY3JlbWVudDogZnVuY3Rpb24gKHN0YXRlLCBwYXlsb2FkKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHBheWxvYWQgIT09ICdudW1iZXInKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXRlLmNvdW50KTtcbiAgICAgICAgICAgIHN0YXRlLmNvdW50ICs9IHBheWxvYWQ7XG4gICAgICAgIH0sXG4gICAgICAgIGRlY3JlbWVudDogZnVuY3Rpb24gKHN0YXRlLCBwYXlsb2FkKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHBheWxvYWQgIT09ICdudW1iZXInKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHN0YXRlLmNvdW50IC09IHBheWxvYWQ7XG4gICAgICAgIH0sXG4gICAgfSxcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==