"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const gulp = require('gulp');
const axiba_dependencies_1 = require('axiba-dependencies');
const through = require('through2');
/**
 * 啊洗吧
 */
class Axiba {
    constructor() {
        this.config = {
            assets: 'assets',
            assetsBulid: 'assetsBulid',
            glob: ['/**/*.less', '/**/*.js'],
            mainPath: 'index.js',
            mainModules: ['react']
        };
    }
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
    deleted(path) {
    }
    changed(path) {
        let th = through.obj.bind(through);
        gulp.src(path)
            .pipe(axiba_dependencies_1.default.getReadWriteStream.bind(axiba_dependencies_1.default))
            .pipe(th((file, enc, cb) => __awaiter(this, void 0, void 0, function* () {
        })));
    }
}
exports.Axiba = Axiba;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Axiba();

//# sourceMappingURL=index.js.map
