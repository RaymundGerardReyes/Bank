"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-absolute-url";
exports.ids = ["vendor-chunks/is-absolute-url"];
exports.modules = {

/***/ "(ssr)/./node_modules/is-absolute-url/index.js":
/*!***********************************************!*\
  !*** ./node_modules/is-absolute-url/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ isAbsoluteUrl)\n/* harmony export */ });\n// Scheme: https://tools.ietf.org/html/rfc3986#section-3.1\n// Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3\nconst ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\\d+\\-.]*?:/;\n\n// Windows paths like `c:\\`\nconst WINDOWS_PATH_REGEX = /^[a-zA-Z]:\\\\/;\n\nfunction isAbsoluteUrl(url) {\n\tif (typeof url !== 'string') {\n\t\tthrow new TypeError(`Expected a \\`string\\`, got \\`${typeof url}\\``);\n\t}\n\n\tif (WINDOWS_PATH_REGEX.test(url)) {\n\t\treturn false;\n\t}\n\n\treturn ABSOLUTE_URL_REGEX.test(url);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXMtYWJzb2x1dGUtdXJsL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFZTtBQUNmO0FBQ0Esc0RBQXNELFdBQVc7QUFDakU7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EiLCJzb3VyY2VzIjpbIkQ6XFxKYXZhXFxCYW5rXFx3ZWItYXBwXFxub2RlX21vZHVsZXNcXGlzLWFic29sdXRlLXVybFxcaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gU2NoZW1lOiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiNzZWN0aW9uLTMuMVxuLy8gQWJzb2x1dGUgVVJMOiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiNzZWN0aW9uLTQuM1xuY29uc3QgQUJTT0xVVEVfVVJMX1JFR0VYID0gL15bYS16QS1aXVthLXpBLVpcXGQrXFwtLl0qPzovO1xuXG4vLyBXaW5kb3dzIHBhdGhzIGxpa2UgYGM6XFxgXG5jb25zdCBXSU5ET1dTX1BBVEhfUkVHRVggPSAvXlthLXpBLVpdOlxcXFwvO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0Fic29sdXRlVXJsKHVybCkge1xuXHRpZiAodHlwZW9mIHVybCAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKGBFeHBlY3RlZCBhIFxcYHN0cmluZ1xcYCwgZ290IFxcYCR7dHlwZW9mIHVybH1cXGBgKTtcblx0fVxuXG5cdGlmIChXSU5ET1dTX1BBVEhfUkVHRVgudGVzdCh1cmwpKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cmV0dXJuIEFCU09MVVRFX1VSTF9SRUdFWC50ZXN0KHVybCk7XG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/is-absolute-url/index.js\n");

/***/ })

};
;