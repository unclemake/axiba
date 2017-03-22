let config = {
    // 静态文件路径
    assets: 'assets',

    // 生成路径
    bulidPath: 'dist',
    // dev生成路径
    devBulidPath: 'dist-dev',

    // 默认启动页面
    mainPath: 'index.html',
    // 模块文件的路径
    mainJsPath: 'index.js',
    // 打包进模块文件的 node模块
    mainModules: [
        'react',
        'react-dom',
        'react-router',
        'antd',
        'superagent'
    ],


    // 是否在页面注入热加载
    hotload: true,

    // web访问端口
    devWebPort: 666,

    // web访问端口
    webPort: 667
};




export default config;
