"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/parse-ms";
exports.ids = ["vendor-chunks/parse-ms"];
exports.modules = {

/***/ "(ssr)/./node_modules/parse-ms/index.js":
/*!****************************************!*\
  !*** ./node_modules/parse-ms/index.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ parseMilliseconds)\n/* harmony export */ });\nfunction parseMilliseconds(milliseconds) {\n\tif (typeof milliseconds !== 'number') {\n\t\tthrow new TypeError('Expected a number');\n\t}\n\n\tconst roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;\n\n\treturn {\n\t\tdays: roundTowardsZero(milliseconds / 86400000),\n\t\thours: roundTowardsZero(milliseconds / 3600000) % 24,\n\t\tminutes: roundTowardsZero(milliseconds / 60000) % 60,\n\t\tseconds: roundTowardsZero(milliseconds / 1000) % 60,\n\t\tmilliseconds: roundTowardsZero(milliseconds) % 1000,\n\t\tmicroseconds: roundTowardsZero(milliseconds * 1000) % 1000,\n\t\tnanoseconds: roundTowardsZero(milliseconds * 1e6) % 1000\n\t};\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcGFyc2UtbXMvaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJEOlxcSmF2YVxcQmFua1xcd2ViLWFwcFxcbm9kZV9tb2R1bGVzXFxwYXJzZS1tc1xcaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGFyc2VNaWxsaXNlY29uZHMobWlsbGlzZWNvbmRzKSB7XG5cdGlmICh0eXBlb2YgbWlsbGlzZWNvbmRzICE9PSAnbnVtYmVyJykge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgbnVtYmVyJyk7XG5cdH1cblxuXHRjb25zdCByb3VuZFRvd2FyZHNaZXJvID0gbWlsbGlzZWNvbmRzID4gMCA/IE1hdGguZmxvb3IgOiBNYXRoLmNlaWw7XG5cblx0cmV0dXJuIHtcblx0XHRkYXlzOiByb3VuZFRvd2FyZHNaZXJvKG1pbGxpc2Vjb25kcyAvIDg2NDAwMDAwKSxcblx0XHRob3Vyczogcm91bmRUb3dhcmRzWmVybyhtaWxsaXNlY29uZHMgLyAzNjAwMDAwKSAlIDI0LFxuXHRcdG1pbnV0ZXM6IHJvdW5kVG93YXJkc1plcm8obWlsbGlzZWNvbmRzIC8gNjAwMDApICUgNjAsXG5cdFx0c2Vjb25kczogcm91bmRUb3dhcmRzWmVybyhtaWxsaXNlY29uZHMgLyAxMDAwKSAlIDYwLFxuXHRcdG1pbGxpc2Vjb25kczogcm91bmRUb3dhcmRzWmVybyhtaWxsaXNlY29uZHMpICUgMTAwMCxcblx0XHRtaWNyb3NlY29uZHM6IHJvdW5kVG93YXJkc1plcm8obWlsbGlzZWNvbmRzICogMTAwMCkgJSAxMDAwLFxuXHRcdG5hbm9zZWNvbmRzOiByb3VuZFRvd2FyZHNaZXJvKG1pbGxpc2Vjb25kcyAqIDFlNikgJSAxMDAwXG5cdH07XG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/parse-ms/index.js\n");

/***/ })

};
;