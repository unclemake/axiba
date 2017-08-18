
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
     * 打包进框架文件的 项目文件
     * 
     * @type {string[]}
     * @memberOf Config
     */
    mainFile: string[]

    /**
     * 调试接口
     * 
     * @type {boolean}
     * @memberOf Config
     */
    devPort: number

    /**
     * 合并
     * 
     * @type {string}
     * @memberOf Config
     */
    merge: string | string[]


    /**
     * 路径替换
     * 
     * @type {{
     *         [key: string]: string
     *     }}
     * @memberOf Config
     */
    paths?: {
        [key: string]: string
    }


    /**
     * 拷贝文件后缀
     * 
     * @type {string[]}
     * @memberof Config
     */
    loader: string[]
}

let config: Config = {
    merge: '',
    assets: 'assets',
    output: 'dist',
    main: 'index.js',
    mainHtml: 'index.html',
    mainModules: [],
    mainFile: [],
    devPort: 8080,
    loader: ['.eot', '.svg', '.ttf', '.woff', '.json', '.ico']
};



export default config;
