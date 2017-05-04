define("components/select/index.js",["../antd/select/style/index.css","antd/lib/select/index"],function(require, exports, module) {
'use strict';

require('../antd/select/style/index.css');
var selectAll = require('antd/lib/select/index');
var select = selectAll;
exports.Option = selectAll.Option;
exports.OptGroup = selectAll.OptGroup;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = select;
});