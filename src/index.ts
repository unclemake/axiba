import importConfig, { Config } from './config';
import { run, config as axibaConfig } from 'axiba-server';
import Compile, { Release } from './compile';
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
    console.log('项目文件生成');
    await CompileNew.build();
    console.log('框架文件生成');
    await MainFile.buildMainFile();
    console.log('运行完毕');
}


let ReleaseNew = new Release();
export async function release() {
    console.log('项目文件生成');
    await ReleaseNew.build();
    console.log('框架文件生成');
    await MainFile.buildMainFileMin();
    console.log('Md5文件生成');
    await ReleaseNew.md5Build();
    console.log('局部文件合并');
    await ReleaseNew.merge();
    console.log('运行完毕');
}


/**
 * 监视
 * 
 * @export
 */
export function watch() {
    console.log('启动服务');
    CompileNew.watch();
}

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
    axibaConfig.mainPath = process.cwd() + '/' + config.output + '/' + config.mainHtml;
    axibaConfig.webPort = config.devPort;
    run();
}






