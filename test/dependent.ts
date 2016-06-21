/// <reference path="../lib/dependent/js.ts" />
"use strict"

import {default as dep}  from '../lib/dependent/index';
import jsDep  from '../lib/dependent/js';
import * as path  from 'path';
import nodeDep from '../lib/dependent/nodejs';
import * as npm from 'npm';
import * as util from '../lib/util';
import * as config from '../lib/config';

var log = console.log;
var plog = (log) => {
    try {
        return log.then((value) => {
            console.log(value);
            return value;
        });
    } catch (e) {
        console.log(e);
    }
};


//log(dep.getDep("assets/components/global/1.0/index.less"));
//log(dep.getBeDep("assets/components/global/1.0/styles/_quick.less"));

///**
// * 依赖
// */
dep.db.clear();
//plog(dep.run());
(dep.run([
    'assets/components/global/1.0/index.less',
    'assets/components/global/1.0/styles/_quick.less'
]));


//log(util.extend({
//    aaa: 1
//}, {
//        bbb: 2
//    }))

//plog(dep.getVinylByUrl('node_modules/react/lib/React.js'));
//console.log(path.normalize('./ReactComponent'))

//log(path.dirname('D:/github/axiba/node_modules/react/lib'))
//log(path.dirname('D:/github/axiba/node_modules/react/lib/'))
//log(path.join('D:/github/axiba/node_modules/react/lib', './ReactChildren'))


//log(dep.getMap('assets/components/require.js'));

/**
 * JS 依赖
 */
//根据别名获取路径
//plog(jsDep.getUrlByAlias('header'))
// 根据url 计算他的dep依赖地址
//plog(jsDep.normalize('d:/', 'header'));

//var proLog;
////dep.addDep('assets/components/require.js', [])

//proLog = dep.run('assets/components/**/*.*');


//proLog.then((value) => {
//    //console.log(value);
//})


//dep.getVinylByUrl('D:/github/axiba/assets/pages/oa/reducer.js').then(vinyl => {
//    plog(jsDep.replace(vinyl).then((vinyl) => 
//        return vinyl.contents.toString();
//    }));
//})



//dep.getVinylByUrl('D:/github/axiba/assets/components/require.js').then(vinyl => {
//    plog(jsDep.getDep(vinyl));
//})


//dep.getVinylByUrl('assets/components/test/actions.js').then(vinyl => {
//    plog(jsDep.getRelativeVinyl(vinyl));
//})




//console.log(path.extname('node_modules/core-js/modules/$.strict-new.js'));

//console.log(log);


/**
 * NodeJS 依赖
 */
var set = new Set([
    'inquirer@1.0.2']
);


var depArr: any = {
    //inquirer: {
    //    version: '1.0.2'
    //},
    //'exit-hook': {
    //    version: '1.1.1'
    //},
    'cli-cursor': {
        version: '1.0.2'
    }
};



var dependencies = {
    "cli-cursor": {
        "_args": [["cli-cursor@^1.0.1", "D:\\github\\axiba\\node_modules\\inquirer"]],
        "_from": "cli-cursor@>=1.0.1 <2.0.0",
        "_id": "cli-cursor@1.0.2",
        "_inCache": true,
        "_installable": true,
        "_location": "/cli-cursor",
        "_nodeVersion": "4.1.0",
        "_npmUser": {
            "email": "sindresorhus@gmail.com",
            "name": "sindresorhus"
        },
        "_npmVersion": "2.14.3",
        "_phantomChildren": {},
        "_requested": {
            "name": "cli-cursor",
            "raw": "cli-cursor@^1.0.1",
            "rawSpec": "^1.0.1",
            "scope": null,
            "spec": ">=1.0.1 <2.0.0",
            "type": "range"
        },
        "_requiredBy": ["/inquirer"],
        "_resolved": "https://registry.npmjs.org/cli-cursor/-/cli-cursor-1.0.2.tgz",
        "_shasum": "64da3f7d56a54412e59794bd62dc35295e8f2987",
        "_shrinkwrap": null,
        "_spec": "cli-cursor@^1.0.1",
        "_where": "D:\\github\\axiba\\node_modules\\inquirer",
        "author": {
            "name": "Sindre Sorhus",
            "email": "sindresorhus@gmail.com",
            "url": "sindresorhus.com"
        },
        "bugs": { "url": "https://github.com/sindresorhus/cli-cursor/issues" },
        "dependencies": {
            "restore-cursor": {
                "_args": [["restore-cursor@^1.0.1", "D:\\github\\axiba\\node_modules\\cli-cursor"]],
                "_from": "restore-cursor@>=1.0.1 <2.0.0",
                "_id": "restore-cursor@1.0.1",
                "_inCache": true,
                "_installable": true,
                "_location": "/restore-cursor",
                "_nodeVersion": "4.1.0",
                "_npmUser": {
                    "email": "sindresorhus@gmail.com",
                    "name": "sindresorhus"
                },
                "_npmVersion": "2.14.3",
                "_phantomChildren": {},
                "_requested": {
                    "name": "restore-cursor",
                    "raw": "restore-cursor@^1.0.1",
                    "rawSpec": "^1.0.1",
                    "scope": null,
                    "spec": ">=1.0.1 <2.0.0",
                    "type": "range"
                },
                "_requiredBy": ["/cli-cursor"],
                "_resolved": "https://registry.npmjs.org/restore-cursor/-/restore-cursor-1.0.1.tgz",
                "_shasum": "34661f46886327fed2991479152252df92daa541",
                "_shrinkwrap": null,
                "_spec": "restore-cursor@^1.0.1",
                "_where": "D:\\github\\axiba\\node_modules\\cli-cursor",
                "author": {
                    "name": "Sindre Sorhus",
                    "email": "sindresorhus@gmail.com",
                    "url": "http://sindresorhus.com"
                },
                "bugs": { "url": "https://github.com/sindresorhus/restore-cursor/issues" },
                "dependencies": {
                    "exit-hook": {
                        "_args": [["exit-hook@^1.0.0", "D:\\github\\axiba\\node_modules\\restore-cursor"]],
                        "_from": "exit-hook@>=1.0.0 <2.0.0",
                        "_id": "exit-hook@1.1.1",
                        "_inCache": true,
                        "_installable": true,
                        "_location": "/exit-hook",
                        "_npmUser": {
                            "email": "sindresorhus@gmail.com",
                            "name": "sindresorhus"
                        },
                        "_npmVersion": "1.4.9",
                        "_phantomChildren": {},
                        "_requested": {
                            "name": "exit-hook",
                            "raw": "exit-hook@^1.0.0",
                            "rawSpec": "^1.0.0",
                            "scope": null,
                            "spec": ">=1.0.0 <2.0.0",
                            "type": "range"
                        },
                        "_requiredBy": ["/restore-cursor"],
                        "_resolved": "https://registry.npmjs.org/exit-hook/-/exit-hook-1.1.1.tgz",
                        "_shasum": "f05ca233b48c05d54fff07765df8507e95c02ff8",
                        "_shrinkwrap": null,
                        "_spec": "exit-hook@^1.0.0",
                        "_where": "D:\\github\\axiba\\node_modules\\restore-cursor",
                        "author": {
                            "name": "Sindre Sorhus",
                            "email": "sindresorhus@gmail.com",
                            "url": "http://sindresorhus.com"
                        },
                        "bugs": { "url": "https://github.com/sindresorhus/exit-hook/issues" },
                        "dependencies": {},
                        "description": "Run some code when the process exits",
                        "devDependencies": { "ava": "0.0.4" },
                        "directories": {},
                        "dist": {
                            "shasum": "f05ca233b48c05d54fff07765df8507e95c02ff8",
                            "tarball": "http://registry.npmjs.org/exit-hook/-/exit-hook-1.1.1.tgz"
                        },
                        "engines": { "node": ">=0.10.0" },
                        "files": ["index.js"],
                        "homepage": "https://github.com/sindresorhus/exit-hook",
                        "keywords": ["exit", "quit", "process", "hook", "graceful", "handler", "shutdown", "sigterm", "sigint", "terminate", "kill", "stop", "event"],
                        "license": "MIT",
                        "maintainers": [
                            {
                                "name": "sindresorhus",
                                "email": "sindresorhus@gmail.com"
                            }
                        ],
                        "name": "exit-hook",
                        "optionalDependencies": {},
                        "readme": "ERROR: No README data found!",
                        "repository": {
                            "type": "git",
                            "url": "git://github.com/sindresorhus/exit-hook.git"
                        },
                        "scripts": { "test": "node test.js" },
                        "version": "1.1.1",
                        "_dependencies": {},
                        "path": "D:\\github\\axiba\\node_modules\\exit-hook",
                        "error": null,
                        "extraneous": false
                    },
                    "onetime": {
                        "_args": [["onetime@^1.0.0", "D:\\github\\axiba\\node_modules\\restore-cursor"]],
                        "_from": "onetime@>=1.0.0 <2.0.0",
                        "_id": "onetime@1.1.0",
                        "_inCache": true,
                        "_installable": true,
                        "_location": "/onetime",
                        "_nodeVersion": "4.2.1",
                        "_npmUser": {
                            "email": "sindresorhus@gmail.com",
                            "name": "sindresorhus"
                        },
                        "_npmVersion": "2.14.7",
                        "_phantomChildren": {},
                        "_requested": {
                            "name": "onetime",
                            "raw": "onetime@^1.0.0",
                            "rawSpec": "^1.0.0",
                            "scope": null,
                            "spec": ">=1.0.0 <2.0.0",
                            "type": "range"
                        },
                        "_requiredBy": ["/each-async", "/restore-cursor"],
                        "_resolved": "https://registry.npmjs.org/onetime/-/onetime-1.1.0.tgz",
                        "_shasum": "a1f7838f8314c516f05ecefcbc4ccfe04b4ed789",
                        "_shrinkwrap": null,
                        "_spec": "onetime@^1.0.0",
                        "_where": "D:\\github\\axiba\\node_modules\\restore-cursor",
                        "author": {
                            "name": "Sindre Sorhus",
                            "email": "sindresorhus@gmail.com",
                            "url": "sindresorhus.com"
                        },
                        "bugs": { "url": "https://github.com/sindresorhus/onetime/issues" },
                        "dependencies": {},
                        "description": "Only call a function once",
                        "devDependencies": {
                            "ava": "*",
                            "xo": "*"
                        },
                        "directories": {},
                        "dist": {
                            "shasum": "a1f7838f8314c516f05ecefcbc4ccfe04b4ed789",
                            "tarball": "http://registry.npmjs.org/onetime/-/onetime-1.1.0.tgz"
                        },
                        "engines": { "node": ">=0.10.0" },
                        "files": ["index.js"],
                        "gitHead": "6fae2fb77b95b49719d1c270d8ba07d9515bdfe8",
                        "homepage": "https://github.com/sindresorhus/onetime",
                        "keywords": ["once", "one", "single", "call", "function", "prevent"],
                        "license": "MIT",
                        "maintainers": [
                            {
                                "name": "sindresorhus",
                                "email": "sindresorhus@gmail.com"
                            }
                        ],
                        "name": "onetime",
                        "optionalDependencies": {},
                        "readme": "ERROR: No README data found!",
                        "repository": {
                            "type": "git",
                            "url": "git+https://github.com/sindresorhus/onetime.git"
                        },
                        "scripts": { "test": "xo && ava" },
                        "version": "1.1.0",
                        "_dependencies": {},
                        "path": "D:\\github\\axiba\\node_modules\\onetime",
                        "error": null,
                        "extraneous": false
                    }
                },
                "description": "Gracefully restore the CLI cursor on exit",
                "devDependencies": {},
                "directories": {},
                "dist": {
                    "shasum": "34661f46886327fed2991479152252df92daa541",
                    "tarball": "http://registry.npmjs.org/restore-cursor/-/restore-cursor-1.0.1.tgz"
                },
                "engines": { "node": ">=0.10.0" },
                "files": ["index.js"],
                "gitHead": "91542e5be16d7ccda8e42a63d56cc783d2cfaba2",
                "homepage": "https://github.com/sindresorhus/restore-cursor#readme",
                "keywords": ["exit", "quit", "process", "graceful", "shutdown", "sigterm", "sigint", "terminate", "kill", "stop", "cli", "cursor", "ansi", "show", "term", "terminal", "console", "tty", "shell", "command-line"],
                "license": "MIT",
                "maintainers": [
                    {
                        "name": "sindresorhus",
                        "email": "sindresorhus@gmail.com"
                    }
                ],
                "name": "restore-cursor",
                "optionalDependencies": {},
                "readme": "ERROR: No README data found!",
                "repository": {
                    "type": "git",
                    "url": "git+https://github.com/sindresorhus/restore-cursor.git"
                },
                "scripts": {},
                "version": "1.0.1",
                "_dependencies": {
                    "exit-hook": "^1.0.0",
                    "onetime": "^1.0.0"
                },
                "path": "D:\\github\\axiba\\node_modules\\restore-cursor",
                "error": null,
                "extraneous": false
            }
        },
        "description": "Toggle the CLI cursor",
        "devDependencies": {
            "ava": "*",
            "xo": "*"
        },
        "directories": {},
        "dist": {
            "shasum": "64da3f7d56a54412e59794bd62dc35295e8f2987",
            "tarball": "http://registry.npmjs.org/cli-cursor/-/cli-cursor-1.0.2.tgz"
        },
        "engines": { "node": ">=0.10.0" },
        "files": ["index.js"],
        "gitHead": "6be5a384d90278c66aa30db5ecdec8dc68f17d4f",
        "homepage": "https://github.com/sindresorhus/cli-cursor#readme",
        "keywords": ["cli", "cursor", "ansi", "toggle", "display", "show", "hide", "term", "terminal", "console", "tty", "shell", "command-line"],
        "license": "MIT",
        "maintainers": [
            {
                "name": "sindresorhus",
                "email": "sindresorhus@gmail.com"
            }
        ],
        "name": "cli-cursor",
        "optionalDependencies": {},
        "readme": "ERROR: No README data found!",
        "repository": {
            "type": "git",
            "url": "git+https://github.com/sindresorhus/cli-cursor.git"
        },
        "scripts": { "test": "xo && ava" },
        "version": "1.0.2",
        "_dependencies": { "restore-cursor": "^1.0.1" },
        "path": "D:\\github\\axiba\\node_modules\\cli-cursor",
        "error": null,
        "extraneous": false
    }
}



//根据glob 获取文件vinyl
//plog(nodeDep.getVinylByUrl('node_modules/inquirer/lib/inquirer.js'));


//根据url 获取全部依赖js (不包含别名的依赖)
//plog(nodeDep.getFileArrByUrl('node_modules/inquirer/lib/inquirer.js')).then((value) => {

//    log(value.length);
//    var setValue = new Set();
//    value.forEach((value) => {
//        setValue.add(value)
//    });
//    log(setValue.size);
//});;

//log(nodeDep.getDepSet(depArr));

//根据依赖列表获取所有 依赖js文件url
//nodeDep.getDep(dependencies).then((value) => {
//    value.forEach((value) => {
//        console.log(value.path);
//    })
//});

//plog(nodeDep.normalize('node_modules/react-router-redux/lib/index'));


//根据依赖列表获取所有 依赖js文件url
//nodeDep.getDepByName('react').then((value) => {
//    value.forEach((value) => {
//        console.log(value.path);
//    })
//});


//plog(nodeDep.getModulePath(set));
//plog(nodeDep.getVinyl(depArr));


//dep.getVinylByUrl('node_modules/loose-envify/loose-envify.js').then(vinyl => {
//    plog(nodeDep.aliasReplace(vinyl, dependencies['cli-cursor']));
//})


//var getView = async () => {
//    var lo = await nodeDep.view('gulp');
//    //var lo = await nodeDep.getView('gulp');
//    console.log(lo);
//}
//getView();



//var getLs = async () => {
//    var ls = await nodeDep.ls('gulp');
//    util.log(JSON.stringify(ls));
//    util.createLogFile();
//}
//getLs();



var rb = ['react@15.1.0',
    'fbjs@0.8.3',
    'core-js@1.2.6',
    'object-assign@4.1.0',
    'immutable@3.8.1',
    'isomorphic-fetch@2.2.1',
    'node-fetch@1.5.3',
    'encoding@0.1.12',
    'iconv-lite@0.4.13',
    'is-stream@1.1.0',
    'whatwg-fetch@1.0.0',
    'loose-envify@1.2.0',
    'promise@7.1.1',
    'ua-parser-js@0.7.10',
    'js-tokens@1.0.3'];


//var getLs = async () => {
//    var ls = await nodeDep.rb(rb);
//    console.log(ls);
//}
//getLs();






