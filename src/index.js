"use strict";
const compile_1 = require('./compile');
const config_1 = require('./config');
exports.config = config_1.default;
const axiba_server_1 = require('axiba-server');
//导出配置
/**
 * 启动服务器
 *
 * @export
 */
function serverRun() {
    //修改服务器配置
    axiba_server_1.config.devPort = config_1.default.devPort;
    axiba_server_1.config.webPort = config_1.default.webPort;
    axiba_server_1.config.mainPath = config_1.default.assetsBulid + '/' + config_1.default.mainPath;
    axiba_server_1.run();
}
exports.serverRun = serverRun;
/**
 * 初始化
 *
 * @export
 */
function init() {
    compile_1.default.makeMainFile();
    compile_1.default.bulid();
}
exports.init = init;
/**
 * 监视
 *
 * @export
 */
function watch() {
    compile_1.default.watch();
}
exports.watch = watch;

//# sourceMappingURL=index.js.map
