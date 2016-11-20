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
const compileDev_1 = require('./compileDev');
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
    axiba_server_1.config.mainPath = config_1.default.bulidPath + '/' + config_1.default.mainPath;
    axiba_server_1.run();
}
let bulidPath = config_1.default.bulidPath;
let dev = false;
function openDev() {
    dev = true;
    config_1.default.bulidPath = 'dev-' + config_1.default.bulidPath;
}
exports.openDev = openDev;
function closeDev() {
    dev = false;
    config_1.default.bulidPath = bulidPath;
}
exports.closeDev = closeDev;
/**
 * 初始化
 *
 * @export
 */
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        let com = dev ? compileDev_1.default : compile_1.default;
        axiba_util_1.default.log('项目文件依赖扫描');
        yield com.scanDependence();
        axiba_util_1.default.log('node依赖打包');
        yield com.packNodeDependencies();
        axiba_util_1.default.log('框架文件生成');
        yield com.buildMainFile();
        axiba_util_1.default.log('项目文件全部生成');
        yield com.build();
    });
}
exports.init = init;
/**
 * 监视
 *
 * @export
 */
function watch() {
    let com = dev ? compileDev_1.default : compile_1.default;
    serverRun();
    com.watch();
}
exports.watch = watch;
//# sourceMappingURL=index.js.map
