"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const compile_1 = require('./compile');
const config_1 = require('./config');
exports.config = config_1.default;
const axiba_server_1 = require('axiba-server');
const axiba_util_1 = require('axiba-util');
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
    return __awaiter(this, void 0, void 0, function* () {
        axiba_util_1.default.log('项目文件依赖扫描');
        yield compile_1.default.scanDependence();
        axiba_util_1.default.log('node依赖打包');
        yield compile_1.default.packNodeDependencies();
        axiba_util_1.default.log('框架文件生成');
        yield compile_1.default.buildMainFile();
        axiba_util_1.default.log('项目文件全部生成');
        yield compile_1.default.build();
    });
}
exports.init = init;
/**
 * 监视
 *
 * @export
 */
function watch() {
    serverRun();
    compile_1.default.watch();
}
exports.watch = watch;
//# sourceMappingURL=index.js.map
