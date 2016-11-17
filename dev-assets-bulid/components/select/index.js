define("components/select/index.js",function(require, exports, module) {"use strict";
require('../antd/select/style/index.css');
let selectAll = require('antd/lib/select/index');
let select = selectAll;
exports.Option = selectAll.Option;
exports.OptGroup = selectAll.OptGroup;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = select;
});
//# sourceMappingURL=index.js.map
