import * as gulp from 'gulp';
import dep from 'axiba-dependencies';
import * as through from 'through2';
import * as gulpUtil from 'gulp-util';

interface Config {
    // 项目静态文件开发目录
    assets: string

    // 项目静态文件生成目录
    assetsBulid: string

    //gulp 扫描文件glob数组
    glob: string[]

    //框架文件路径
    mainPath: string

    //框架文件包含模块
    mainModules: string[]
}


/**
 * 啊洗吧
 */
export class Axiba {

    config: Config = {
        assets: 'assets',
        assetsBulid: 'assetsBulid',
        glob: ['/**/*.less', '/**/*.js'],
        mainPath: 'index.js',
        mainModules: ['react']
    };

    /**
     * 启动
     */
    start() {
        let config = this.config;
        gulp.watch(config.glob.map(value => config.assets + value), (event) => {

            switch (event.type) {
                case 'added':
                    this.changed(event.path);
                    break;
                case 'changed':
                    this.changed(event.path);
                    break;
                case 'deleted':
                    this.deleted(event.path);
                    break;
            }
        });
    }

    deleted(path: string) {

    }

    changed(path: string) {
        let th = through.obj.bind(through);

        gulp.src(path)
            .pipe(dep.getReadWriteStream.bind(dep))
            .pipe(th(async (file: gulpUtil.File, enc, cb) => {

            }))
    }


}


export default new Axiba();
