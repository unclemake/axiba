import importConfig, { Config } from './config';
import { run, config as axibaConfig } from 'axiba-server';
import Compile from './compile';
import MainFile from './main-file';



// 退出时保存依赖信息
process.on('exit', function (err) {
    // dep.createJsonFile();
});



let CompileNew = new Compile();
/**
 * 项目初始化
 * 
 * @export
 */
export async function init() {
    MainFile.buildMainFile();
    await CompileNew.build();
    console.log('运行完毕');
}


/**
 * 监视
 * 
 * @export
 */
export function watch() { }

/**
 * 配置
 * 
 * @export
 */
export let config = importConfig;


/**
 * 启动服务器
 * 
 * @export
 */
export function serverRun(dev = true) {
    // 修改服务器配置
    axibaConfig.mainPath = config.output + '/' + config.mainHtml;
    axibaConfig.webPort = config.devPort;
    run();
}






