"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const config_1 = require('./config');
const axiba_server_1 = require('axiba-server');
const compile_1 = require('./compile');
const main_file_1 = require('./main-file');
// 退出时保存依赖信息
process.on('exit', function (err) {
    // dep.createJsonFile();
});
let CompileNew = new compile_1.default();
/**
 * 项目初始化
 *
 * @export
 */
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        main_file_1.default.buildMainFile();
        yield CompileNew.build();
        console.log('运行完毕');
    });
}
exports.init = init;
/**
 * 监视
 *
 * @export
 */
function watch() { }
exports.watch = watch;
/**
 * 配置
 *
 * @export
 */
exports.config = config_1.default;
/**
 * 启动服务器
 *
 * @export
 */
function serverRun(dev = true) {
    // 修改服务器配置
    axiba_server_1.config.mainPath = exports.config.output + '/' + exports.config.mainHtml;
    axiba_server_1.config.webPort = exports.config.devPort;
    axiba_server_1.run();
}
exports.serverRun = serverRun;

//# sourceMappingURL=index.js.map
