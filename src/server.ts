import * as fs from 'fs';
import * as express from 'express';
import config from './config';
import open = require("open");



export function run() {
    var app = express();

    app.get('/', function (req, res) {
        res.sendfile(config.assetsBulid + '/index.html');
    });

    var server = app.listen(666, function () {
        var host = server.address().address;
        var port = server.address().port;

        console.log('Example app listening at http://%s:%s', host, port);
    });

    app.use(express.static(config.assetsBulid));


    // app.get(/.*[^(dev)]\.js$/, function (req, res) {
    //     res.redirect(req.url + '.dev.js');
    // });

    open('http://localhost:666/', 'chrome');
}

