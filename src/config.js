"use strict";
let config = {
    //静态文件路径
    assets: 'assets',
    //生成路径
    assetsBulid: 'assetsBulid',
    //是否开启dev
    devBulid: true,
    //默认启动页面
    mainPath: 'index.html',
    //模块文件的路径
    mainJsPath: 'index.js',
    //打包进模块文件的 node模块
    mainModules: ['react', 'react-dom', 'react-router'],
    //web访问端口
    webPort: 666,
    //开发长连接端口
    devPort: 555
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = config;

//# sourceMappingURL=config.js.map
