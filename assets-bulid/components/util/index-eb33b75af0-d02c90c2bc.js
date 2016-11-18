define("components/util/index-eb33b75af0.js",function(require, exports, module) {
"use strict";function getLength(t){return t.replace(/[^\x00-\xff]/g,"01").length/2}function rand(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2147483647;arguments.length;return Math.floor(Math.random()*(e-t+1))+t}function trim(t){return t.replace(/(^\s*)|(\s*$)/g,"")}exports.getLength=getLength,exports.rand=rand,exports.trim=trim;
});
//# sourceMappingURL=index-eb33b75af0.js.map
