"use strict";
var log = console.log;
var plog = (log) => {
    try {
        return log.then((value) => {
            console.log(value);
            return value;
        });
    }
    catch (e) {
        console.log(e);
    }
};
//plog(uglify.concatByArr());
//git.pull();
//git.push();
//git.add();
//git.commit();
//uglify.uglify('assets/**/*.js');
//uglify.uglify('assets/**/*.less');
//uglify.watch();
