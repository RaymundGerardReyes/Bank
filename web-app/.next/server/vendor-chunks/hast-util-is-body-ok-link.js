"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/hast-util-is-body-ok-link";
exports.ids = ["vendor-chunks/hast-util-is-body-ok-link"];
exports.modules = {

/***/ "(ssr)/./node_modules/hast-util-is-body-ok-link/lib/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/hast-util-is-body-ok-link/lib/index.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   isBodyOkLink: () => (/* binding */ isBodyOkLink)\n/* harmony export */ });\n/**\n * @import {Nodes} from 'hast'\n */\n\nconst list = new Set(['pingback', 'prefetch', 'stylesheet'])\n\n/**\n * Checks whether a node is a “body OK” link.\n *\n * @param {Nodes} node\n *   Node to check.\n * @returns {boolean}\n *   Whether `node` is a “body OK” link.\n */\nfunction isBodyOkLink(node) {\n  if (node.type !== 'element' || node.tagName !== 'link') {\n    return false\n  }\n\n  if (node.properties.itemProp) {\n    return true\n  }\n\n  const value = node.properties.rel\n  let index = -1\n\n  if (!Array.isArray(value) || value.length === 0) {\n    return false\n  }\n\n  while (++index < value.length) {\n    if (!list.has(String(value[index]))) {\n      return false\n    }\n  }\n\n  return true\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaGFzdC11dGlsLWlzLWJvZHktb2stbGluay9saWIvaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0EsWUFBWSxPQUFPO0FBQ25COztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSIsInNvdXJjZXMiOlsiRDpcXEphdmFcXEJhbmtcXHdlYi1hcHBcXG5vZGVfbW9kdWxlc1xcaGFzdC11dGlsLWlzLWJvZHktb2stbGlua1xcbGliXFxpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBpbXBvcnQge05vZGVzfSBmcm9tICdoYXN0J1xuICovXG5cbmNvbnN0IGxpc3QgPSBuZXcgU2V0KFsncGluZ2JhY2snLCAncHJlZmV0Y2gnLCAnc3R5bGVzaGVldCddKVxuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIGEgbm9kZSBpcyBhIOKAnGJvZHkgT0vigJ0gbGluay5cbiAqXG4gKiBAcGFyYW0ge05vZGVzfSBub2RlXG4gKiAgIE5vZGUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqICAgV2hldGhlciBgbm9kZWAgaXMgYSDigJxib2R5IE9L4oCdIGxpbmsuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0JvZHlPa0xpbmsobm9kZSkge1xuICBpZiAobm9kZS50eXBlICE9PSAnZWxlbWVudCcgfHwgbm9kZS50YWdOYW1lICE9PSAnbGluaycpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGlmIChub2RlLnByb3BlcnRpZXMuaXRlbVByb3ApIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgY29uc3QgdmFsdWUgPSBub2RlLnByb3BlcnRpZXMucmVsXG4gIGxldCBpbmRleCA9IC0xXG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSB8fCB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHdoaWxlICgrK2luZGV4IDwgdmFsdWUubGVuZ3RoKSB7XG4gICAgaWYgKCFsaXN0LmhhcyhTdHJpbmcodmFsdWVbaW5kZXhdKSkpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/hast-util-is-body-ok-link/lib/index.js\n");

/***/ })

};
;