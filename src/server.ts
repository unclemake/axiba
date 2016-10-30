import * as fs from 'fs';
import * as express from 'express';
import * as http from 'http';
import * as socket from 'socket.io';
import config from './config';
import open = require("open");

export let reload = () => { };

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

    app.use(express.static('./'));


    // app.get(/.*[^(dev)]\.js$/, function (req, res) {
    //     res.redirect(req.url + '.dev.js');
    // });

    // open('http://localhost:666/', 'chrome');

    var server = http.createServer();
    var io = socket(server);
    io.on('connection', function (client) {
        reload = () => {
            client.emit('reload', {});
        }

        client.on('message', function (data) {
            console.log(data);
        });
    });
    server.listen(3000);
}

