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
    mainModules: ['react',
        'react-dom',
        'react-router',
        'antd/lib/button/index',
        'antd/lib/input/index',
        'antd/lib/select/index'
    ],
    //web访问端口
    webPort: 666,
    //开发长连接端口
    devPort: 555
};
export default config;