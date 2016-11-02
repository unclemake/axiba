"use strict";
const fs = require('fs');
const ph = require('path');
const axiba_npm_dependencies_1 = require('axiba-npm-dependencies');
let devPath = '__dev__';
/**
   * 编译文件 添加
   */
function addDefine(content, path, devPaths = devPath) {
    content = `\ndefine("${devPaths ? devPaths + '/' : ''}${path}",function(require, exports, module) {\n${content}\n});\n`;
    return content;
}
function getFile(name) {
    return fs.readFileSync(`${ph.resolve(__dirname, '..')}/${name}.js`);
}
function get() {
    let content = '';
    let fileArray = [
        'webDev/dev',
        'config',
        'webDev/socket'
    ];
    fileArray.forEach(value => {
        content += addDefine(getFile(value), `src/${value}.js`);
    });
    let mF = axiba_npm_dependencies_1.default.getFileByName('socket.io-client');
    content += addDefine(mF, 'socket.io-client', '');
    content += `seajs.use('${devPath}/src/webDev/dev.js')`;
    return content;
}
exports.get = get;

//# sourceMappingURL=index.js.map
