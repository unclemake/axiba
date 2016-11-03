import * as fs from 'fs';
import * as ph from 'path';
import nodeFile from '../nodefile';

let devPath = '__dev__';
/**
   * 编译文件 添加
   */
function addDefine(content, path, devPaths: string = devPath) {
    content = `\ndefine("${devPaths ? devPaths + '/' : ''}${path}",function(require, exports, module) {\n${content}\n});\n`;
    return content;
}

function getFile(name: string) {
    return fs.readFileSync(`${ph.resolve(__dirname, '..')}/${name}.js`);
}


export function get() {
    let content = '';

    let fileArray = [
        'webDev/dev',
        'config',
        'webDev/socket'
    ]

    fileArray.forEach(value => {
        content += addDefine(getFile(value), `src/${value}.js`);
    })

    let mF = nodeFile.getFileByName('socket.io-client');
    content += addDefine(mF, 'socket.io-client', '');

    content += `seajs.use('${devPath}/src/webDev/dev.js')`;

    return content;
}