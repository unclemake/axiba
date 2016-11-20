import compile from './compile';
import compileDev from './compileDev';
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
function serverRun() {
    //修改服务器配置
    axibaConfig.devPort = config.devPort;
    axibaConfig.webPort = config.webPort;
    axibaConfig.mainPath = config.bulidPath + '/' + config.mainPath;
    run();
}



let bulidPath = config.bulidPath;
let dev = false;
export function openDev() {
    dev = true;
    config.bulidPath = 'dev-' + config.bulidPath;
}

export function closeDev() {
    dev = false;
    config.bulidPath = bulidPath;
}


/**
 * 初始化
 * 
 * @export
 */
export async function init() {
    let com = dev ? compileDev : compile;

    util.log('项目文件依赖扫描');
    await com.scanDependence();
    util.log('node依赖打包');
    await com.packNodeDependencies();
    util.log('框架文件生成');
    await com.buildMainFile();
    util.log('项目文件全部生成');
    await com.build();
}

/**
 * 监视
 * 
 * @export
 */
export function watch() {
    let com = dev ? compileDev : compile;
    serverRun();
    com.watch();
}


