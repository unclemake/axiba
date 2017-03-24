
/**
 * 程序配置
 * 
 * @interface Config
 */
export interface Config {
    /**
     * 项目文件目录
     * 
     * @type {string}
     * @memberOf Config
     */
    assets: string

    /**
     * 输出文件目录
     * 
     * @type {string}
     * @memberOf Config
     */
    output: string

    /**
     * 框架文件目录
     * 
     * @type {string}
     * @memberOf Config
     */
    main: string

    /**
     * html入口
     * 
     * @type {string}
     * @memberOf Config
     */
    mainHtml: string

    /**
     * 打包进框架文件的 node模块
     * 
     * @type {string[]}
     * @memberOf Config
     */
    mainModules: string[]

    /**
     * 是否在页面注入热加载
     * 
     * @type {boolean}
     * @memberOf Config
     */
    hotload: boolean

    /**
     * 调试接口
     * 
     * @type {boolean}
     * @memberOf Config
     */
    devPort: number
}

let config: Config = {
    assets: 'assets',
    output: 'dist',
    main: 'index.js',
    mainHtml: 'index.html',
    mainModules: [
        'react',
        'react-dom',
        'react-router',
        'antd',
        'superagent'
    ],
    hotload: true,
    devPort: 8080
};



export default config;
