import compile from './compile';
import config from './config';
import { run, config as axibaConfig } from 'axiba-server';
import util from 'axiba-util';


//导出配置
export { config };

/**
 * 启动服务器
 * 
 * @export
 */
export function serverRun() {
    //修改服务器配置
    axibaConfig.devPort = config.devPort;
    axibaConfig.webPort = config.webPort;
    axibaConfig.mainPath = config.assetsBulid + '/' + config.mainPath;
    run();
}


/**
 * 初始化
 * 
 * @export
 */
export async function init() {
    util.log('项目文件依赖扫描');
    await compile.scanDependence();
    util.log('node依赖打包');
    await compile.packNodeDependencies();
    util.log('框架文件生成');
    await compile.buildMainFile();
    util.log('项目文件全部生成');
    await compile.build();
}

/**
 * 监视
 * 
 * @export
 */
export function watch() {
    serverRun();
    compile.watch();
}


