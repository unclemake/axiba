var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const gulp = require('gulp');
const ph = require('path');
const fs = require('fs');
const axiba_dependencies_1 = require('axiba-dependencies');
const axiba_gulp_1 = require('axiba-gulp');
const config_1 = require('./config');
var applySourceMap = require('vinyl-sourcemaps-apply');
var gulpConcat = require('gulp-concat');
var UglifyJS = require("uglify-js");
class Gulp {
    constructor() {
        this.alias = {};
        this.reloadList = [];
    }
    reload() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => __awaiter(this, void 0, void 0, function* () {
            let ph = axiba_dependencies_1.default.clearPath(file.path);
            this.reloadList.push(ph.replace(config_1.default.assets + '/', ''));
            callback(null, file);
        }));
    }
    /**
     * 添加js的alias
     * @param  {string} alias
     * @param  {string} path
     */
    addAlias(alias, path) {
        return axiba_gulp_1.makeLoader(function (file, enc, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                var content = file.contents.toString();
                content += `\n define("${alias}",[], function (require, exports, module) {var exp = require('${path}');module.exports = exp;});`;
                file.contents = new Buffer(content);
                callback(null, file);
            });
        });
    }
    /**
     * 合并
     *
     *
     * @memberOf Gulp
     */
    merge() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => __awaiter(this, void 0, void 0, function* () {
            let gulpPath = axiba_dependencies_1.default.clearPath(ph.dirname(file.path));
            let name = ph.basename(file.path);
            gulp.src(gulpPath + '/**/*-????????.js', {
                base: '/'
            }).pipe(gulpConcat(file.path))
                .pipe(gulp.dest(config_1.default.output))
                .on('finish', () => {
                callback(null, file);
            });
        }));
    }
    /**
      * 修改文件名流插件
      * @param  {string} extname
      * @param {stream.Transform} name loader
      */
    changeExtnameLoader(name, reg = /.+/g) {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            file.path = file.path.replace(reg, name);
            callback(null, file);
        });
    }
    /**
       * 空loader
       */
    nullLoader() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            return callback(null, file);
        });
    }
    /**
    * css文件转js文件
    * @param  {} file
    * @param  {} enc
    * @param  {} cb
    */
    cssToJs() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            var content = file.contents.toString();
            content = '__loaderCss(`' + content + '`)';
            file.contents = new Buffer(content);
            return callback(null, file);
        });
    }
    /**
     * 添加原始filePath
     *
     * @returns
     *
     * @memberOf Gulp
     */
    addFilePath() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            file.filePath = file.path;
            var content = file.contents.toString();
            content = `// <record value="${file.path}" />\n${content}`;
            file.contents = new Buffer(content);
            return callback(null, file);
        });
    }
    /**
    * 编译文件 添加define头
    */
    addDefine() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            let fi = file.sourceMap;
            if (fi) {
                fi.mappings = ";" + fi.mappings;
            }
            var content = file.contents.toString();
            let ph = axiba_dependencies_1.default.clearPath(file.path);
            let depObject = axiba_dependencies_1.default.getDependencies(file);
            let depString = '[]';
            if (depObject) {
                depString = JSON.stringify(depObject.dependent);
            }
            content = `define("${ph.replace(config_1.default.assets + '/', '')}",${depString},function(require, exports, module) {\n${content}\n});`;
            file.contents = new Buffer(content);
            return callback(null, file);
        });
    }
    /**
     * 删除delDebug
     *
     * @returns
     *
     * @memberOf Gulp
     */
    delDebug() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            var content = file.contents.toString();
            content = content.replace(/\/\/ +<debug>[\s\S]*?(\/\/ +<\/debug>)/g, '');
            file.contents = new Buffer(content);
            return callback(null, file);
        });
    }
    /**
    * 过滤忽略文件 文件名开始为_
    */
    ignoreLess() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            var bl = /^_.+/g.test(ph.basename(file.path));
            if (bl) {
                callback();
            }
            else {
                callback(null, file);
            }
        });
    }
    /**
     * 文件名 替换 成 md5路径
     *
     * @returns
     *
     * @memberOf Gulp
     */
    changeExtnameMd5Loader() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            let path = file.path;
            let depObject = axiba_dependencies_1.default.dependenciesArray.find(value => value.path === axiba_dependencies_1.default.clearPath(path));
            if (depObject.path !== `${config_1.default.output}/${config_1.default.mainHtml}`) {
                let md5 = depObject.md5.match(/^.{8}/g)[0];
                file.path = this.pathAddMd5(path, md5);
            }
            callback(null, file);
        });
    }
    /**
     * 给文件名添加md5
     *
     * @param {string} path
     * @param {string} md5
     * @returns
     *
     * @memberOf Gulp
     */
    pathAddMd5(path, md5) {
        md5 = md5.match(/^.{8}/g)[0];
        return path.replace(/(\.[^\.]+$)/g, `-${md5}$1`);
    }
    /**
       * 过滤忽略文件 文件名开始为_
       */
    md5IgnoreLess() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            let path = file.path;
            path = path.replace(/-[^\-]{8}(\.[^\-]+$)/g, `$1`);
            let md5 = file.path.match(/-[^\-]{8}(\.[^\-]+$)/g);
            let depObject = axiba_dependencies_1.default.dependenciesArray.find(value => value.path === axiba_dependencies_1.default.clearPath(path));
            if (!depObject) {
                return callback();
            }
            if (!fs.existsSync(path) || !md5) {
                callback(null, file);
            }
            else {
                callback();
            }
        });
    }
    /**
     * 删除md5文件
     *
     * @returns
     *
     * @memberOf Gulp
     */
    delMd5FileLoader() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            let path = file.path;
            path = path.replace(/(\.[^\.]+$)/g, `-????????$1`);
            gulp.src(path).pipe(this.delFileLoader()).on('finish', () => {
                callback(null, file);
            });
        });
    }
    /**
     * 删除文件
     *
     * @returns
     *
     * @memberOf Gulp
     */
    delFileLoader() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            fs.unlinkSync(file.path);
            callback();
        });
    }
    /**
     * 文件内 路径 md5 替换
     *
     * @returns
     *
     * @memberOf Gulp
     */
    jsPathReplaceLoader() {
        let self = this;
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            var content = file.contents.toString();
            let extname = ph.extname(file.path);
            if (extname === '.js') {
                let depObject = axiba_dependencies_1.default.dependenciesArray.find(value => value.path === axiba_dependencies_1.default.clearPath(file.path));
                let match = content.match(/^(define\("[^"]+)(\.js")/g);
                if (!match) {
                    return callback(null, file);
                }
                content = content.replace(/^(define\("[^"]+)(\.js")/g, `$1-${depObject.md5.match(/^.{8}/g)[0]}$2`);
                let defineArr = content.match(/\[.*?\]/g)[0];
                let arrObject = JSON.parse(defineArr);
                arrObject = arrObject.map(value => {
                    return self.md5Replace(file.path, value);
                });
                content = content.replace(/\[.*?\]/, JSON.stringify(arrObject));
            }
            let depConfig = axiba_dependencies_1.default.config.find(value => value.extname === extname);
            depConfig.parserRegExpList.forEach(value => {
                let match = parseInt(value.match.split('$')[1]);
                content = content.replace(value.regExp, function () {
                    //匹配的全部
                    let str = arguments[0];
                    //匹配的路径名
                    let matchStr = arguments[match];
                    str = str.replace(new RegExp(matchStr, 'g'), self.md5Replace(file.path, matchStr));
                    return str;
                });
            });
            if (extname === '.js') {
                [{
                        regExp: /requireEnsure\(["'](.+?)['"]/g,
                        match: '$1'
                    }, {
                        regExp: /require.ensure\(["'](.+?)['"]/g,
                        match: '$1'
                    }].forEach(value => {
                    let match = parseInt(value.match.split('$')[1]);
                    content = content.replace(value.regExp, function () {
                        //匹配的全部
                        let str = arguments[0];
                        //匹配的路径名
                        let matchStr = arguments[match];
                        str = str.replace(new RegExp(matchStr, 'g'), self.md5Replace(file.path, matchStr));
                        return str;
                    });
                });
                content = UglifyJS.minify(content, { fromString: true }).code;
            }
            if (extname === '.html') {
                [{
                        regExp: /run\(["'](.+?)['"]/g,
                        match: '$1'
                    }].forEach(value => {
                    let match = parseInt(value.match.split('$')[1]);
                    content = content.replace(value.regExp, function () {
                        //匹配的全部
                        let str = arguments[0];
                        //匹配的路径名
                        let matchStr = arguments[match];
                        str = str.replace(new RegExp(matchStr, 'g'), self.md5Replace(file.path, matchStr));
                        return str;
                    });
                });
            }
            file.contents = new Buffer(content);
            return callback(null, file);
        });
    }
    /**
     * 是否别名开始
     *
     * @param {string} path
     *
     * @memberOf Gulp
     */
    isAliasStart(path) {
        return !!path[0].match(/^[^\/\.]/g);
    }
    /**
     * js相对路径计算
     *
     * @param {any} path1
     * @param {any} path2
     *
     * @memberOf Gulp
     */
    pathJoin(filePath, path) {
        let newPath = '';
        let extname = ph.extname(filePath);
        if (this.isAliasStart(path)) {
            if (path[0] === '@') {
                for (var key in config_1.default.paths) {
                    if (config_1.default.paths.hasOwnProperty(key)) {
                        var element = config_1.default.paths[key];
                        path = path.replace(key, element);
                    }
                }
            }
            newPath = ph.join(config_1.default.output, path);
        }
        else {
            newPath = ph.join(ph.dirname(filePath), path);
        }
        if (fs.existsSync(newPath)) {
            return axiba_dependencies_1.default.clearPath(newPath);
        }
        else if (fs.existsSync(newPath + extname)) {
            return axiba_dependencies_1.default.clearPath(newPath + extname);
        }
        else {
            return path;
        }
    }
    /**
     * 根据文件路径 依赖路径  返回md5路径
     *
     * @param {any} filePath 文件路径
     * @param {any} path 依赖路径
     * @returns
     *
     * @memberOf Gulp
     */
    md5Replace(filePath, path) {
        let newPath = this.pathJoin(filePath, path);
        let depObject = axiba_dependencies_1.default.dependenciesArray.find(value => value.path === newPath);
        if (depObject && depObject.md5) {
            let basename = ph.basename(newPath);
            let md5 = depObject.md5.match(/^.{8}/g)[0];
            let md5Basename = basename.replace(/(\.[^\.]+$)/g, `-${md5}$1`);
            return path.replace(RegExp(`${ph.basename(path)}$`, 'g'), md5Basename);
        }
        else {
            return path;
        }
    }
    /**
     * 根据路径获取别名
     * @param  {string} path
     */
    aliasReplacePath(path) {
        let alias = '';
        if (/^[^\.\/]/g.test(path)) {
            let isAlias = !path.match(/[\/\\]/g);
            //获得别名
            if (isAlias) {
                alias = path;
                path = `node_modules/${alias}/index`;
            }
            else {
                alias = path.match(/^.+?(?=\/)/g)[0];
                path = path.replace(alias, `node_modules/${alias}`);
            }
        }
        return path;
    }
    /**
     * html根目录路径替换
     *
     * @returns
     *
     * @memberOf Gulp
     */
    htmlReplace() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            var content = file.contents.toString();
            content = this.htmlBaseReplace(content);
            file.contents = new Buffer(content);
            return callback(null, file);
        });
    }
    htmlBaseReplace(content) {
        content = content.replace(/\$\{base\}/g, config_1.default.output);
        return content;
    }
    test() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            console.log(file.path);
            return callback(null, file);
        });
    }
}
exports.Gulp = Gulp;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Gulp();
//# sourceMappingURL=gulp.js.map
