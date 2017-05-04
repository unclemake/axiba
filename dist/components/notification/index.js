define("components/notification/index.js",["../antd/notification/style/index.css","antd/lib/notification/index"],function(require, exports, module) {
'use strict';

require('../antd/notification/style/index.css');
var notification = require('antd/lib/notification/index');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = notification;
exports.open = notification.open;
exports.success = notification.success;
exports.info = notification.info;
exports.error = notification.error;
exports.warning = notification.warning;
});