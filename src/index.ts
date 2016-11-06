import compile from './compile';
import config from './config';
import { run, config as axibaConfig } from 'axiba-server';


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
export function init() {
    compile.makeMainFile();
    compile.bulid();
}

/**
 * 监视
 * 
 * @export
 */
export function watch() {
    compile.watch();
}


