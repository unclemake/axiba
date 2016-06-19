"use strict"
/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="axiba.ts" />
/// <type="system" />
import * as uglify from '../lib/uglify';



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

//plog(uglify.concatByArr());


//git.pull();

//git.push();

//git.add();

//git.commit();

//uglify.uglify('assets/**/*.js');

uglify.uglify();

//uglify.watch();

