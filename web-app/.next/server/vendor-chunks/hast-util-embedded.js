"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/hast-util-embedded";
exports.ids = ["vendor-chunks/hast-util-embedded"];
exports.modules = {

/***/ "(ssr)/./node_modules/hast-util-embedded/lib/index.js":
/*!******************************************************!*\
  !*** ./node_modules/hast-util-embedded/lib/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   embedded: () => (/* binding */ embedded)\n/* harmony export */ });\n/* harmony import */ var hast_util_is_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hast-util-is-element */ \"(ssr)/./node_modules/hast-util-is-element/lib/index.js\");\n\n\n/**\n * Check if a node is a *embedded content*.\n *\n * @param value\n *   Thing to check (typically `Node`).\n * @returns\n *   Whether `value` is an element considered embedded content.\n *\n *   The elements `audio`, `canvas`, `embed`, `iframe`, `img`, `math`,\n *   `object`, `picture`, `svg`, and `video` are embedded content.\n */\nconst embedded = (0,hast_util_is_element__WEBPACK_IMPORTED_MODULE_0__.convertElement)(\n  /**\n   * @param element\n   * @returns {element is {tagName: 'audio' | 'canvas' | 'embed' | 'iframe' | 'img' | 'math' | 'object' | 'picture' | 'svg' | 'video'}}\n   */\n  function (element) {\n    return (\n      element.tagName === 'audio' ||\n      element.tagName === 'canvas' ||\n      element.tagName === 'embed' ||\n      element.tagName === 'iframe' ||\n      element.tagName === 'img' ||\n      element.tagName === 'math' ||\n      element.tagName === 'object' ||\n      element.tagName === 'picture' ||\n      element.tagName === 'svg' ||\n      element.tagName === 'video'\n    )\n  }\n)\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaGFzdC11dGlsLWVtYmVkZGVkL2xpYi9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFtRDs7QUFFbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLGlCQUFpQixvRUFBYztBQUN0QztBQUNBO0FBQ0EsZUFBZSxZQUFZO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJEOlxcSmF2YVxcQmFua1xcd2ViLWFwcFxcbm9kZV9tb2R1bGVzXFxoYXN0LXV0aWwtZW1iZWRkZWRcXGxpYlxcaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtjb252ZXJ0RWxlbWVudH0gZnJvbSAnaGFzdC11dGlsLWlzLWVsZW1lbnQnXG5cbi8qKlxuICogQ2hlY2sgaWYgYSBub2RlIGlzIGEgKmVtYmVkZGVkIGNvbnRlbnQqLlxuICpcbiAqIEBwYXJhbSB2YWx1ZVxuICogICBUaGluZyB0byBjaGVjayAodHlwaWNhbGx5IGBOb2RlYCkuXG4gKiBAcmV0dXJuc1xuICogICBXaGV0aGVyIGB2YWx1ZWAgaXMgYW4gZWxlbWVudCBjb25zaWRlcmVkIGVtYmVkZGVkIGNvbnRlbnQuXG4gKlxuICogICBUaGUgZWxlbWVudHMgYGF1ZGlvYCwgYGNhbnZhc2AsIGBlbWJlZGAsIGBpZnJhbWVgLCBgaW1nYCwgYG1hdGhgLFxuICogICBgb2JqZWN0YCwgYHBpY3R1cmVgLCBgc3ZnYCwgYW5kIGB2aWRlb2AgYXJlIGVtYmVkZGVkIGNvbnRlbnQuXG4gKi9cbmV4cG9ydCBjb25zdCBlbWJlZGRlZCA9IGNvbnZlcnRFbGVtZW50KFxuICAvKipcbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICogQHJldHVybnMge2VsZW1lbnQgaXMge3RhZ05hbWU6ICdhdWRpbycgfCAnY2FudmFzJyB8ICdlbWJlZCcgfCAnaWZyYW1lJyB8ICdpbWcnIHwgJ21hdGgnIHwgJ29iamVjdCcgfCAncGljdHVyZScgfCAnc3ZnJyB8ICd2aWRlbyd9fVxuICAgKi9cbiAgZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gKFxuICAgICAgZWxlbWVudC50YWdOYW1lID09PSAnYXVkaW8nIHx8XG4gICAgICBlbGVtZW50LnRhZ05hbWUgPT09ICdjYW52YXMnIHx8XG4gICAgICBlbGVtZW50LnRhZ05hbWUgPT09ICdlbWJlZCcgfHxcbiAgICAgIGVsZW1lbnQudGFnTmFtZSA9PT0gJ2lmcmFtZScgfHxcbiAgICAgIGVsZW1lbnQudGFnTmFtZSA9PT0gJ2ltZycgfHxcbiAgICAgIGVsZW1lbnQudGFnTmFtZSA9PT0gJ21hdGgnIHx8XG4gICAgICBlbGVtZW50LnRhZ05hbWUgPT09ICdvYmplY3QnIHx8XG4gICAgICBlbGVtZW50LnRhZ05hbWUgPT09ICdwaWN0dXJlJyB8fFxuICAgICAgZWxlbWVudC50YWdOYW1lID09PSAnc3ZnJyB8fFxuICAgICAgZWxlbWVudC50YWdOYW1lID09PSAndmlkZW8nXG4gICAgKVxuICB9XG4pXG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/hast-util-embedded/lib/index.js\n");

/***/ })

};
;