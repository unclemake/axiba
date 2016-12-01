import compile from './compile';
import compileDev from './compileDev';
import config from './config';
import { run, config as axibaConfig } from 'axiba-server';
import util from 'axiba-util';
import { default as dep, DependenciesModel } from 'axiba-dependencies';

// 退出时保存依赖信息
process.on('exit', function (err) {
    dep.createJsonFile();
});


//导出配置
export { config };



let isRun = false;
/**
 * 启动服务器
 * 
 * @export
 */
function serverRun(dev = true) {
    if (isRun) {
        return;
    }
    isRun = true;

    //修改服务器配置
    if (dev) {
        axibaConfig.devPort = config.devWatchPort;
        axibaConfig.mainPath = config.devBulidPath + '/' + config.mainPath;
        axibaConfig.webPort = config.devWebPort;
    } else {
        axibaConfig.devPort = config.watchPort;
        axibaConfig.mainPath = config.bulidPath + '/' + config.mainPath;
        axibaConfig.webPort = config.webPort;
    }
    run();
}


/**
 * 生成所有文件
 *
 * @export
 */
export async function bulid(dev = true) {
    if (dev) {
        config.bulidPath = config.devBulidPath;
    }
    let com: any = dev ? compileDev : compile;

    util.log('项目文件依赖扫描');
    await com.scanDependence();
    util.log('node依赖打包');
    await com.packNodeDependencies();
    util.log('框架文件生成');
    await com.buildMainFile();
    util.log('项目文件全部生成');
    await com.build();

    if (!dev) {
        await com.mainJsMd5Build();
        com.md5Build();
    }
}


/**
 * 监视
 * 
 * @export
 */
export function watch(dev = true) {
    serverRun(dev);
    compile.watch();
}

