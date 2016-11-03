import * as fs from 'fs';
import * as express from 'express';
import * as http from 'http';
import * as socket from 'socket.io';
import config from './config';
import open = require("open");

var record = require('./record.json');


export let reload = () => { };

export function run() {
    var app = express();

    app.get('/', function (req, res) {
        res.sendfile(config.assetsBulid + '/index.html');
    });

    //监听 666
    var server = app.listen(config.webPort, function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Example app listening at http://%s:%s', host, port);
    });

    //静态文件访问
    app.use(express.static('./'));


    // app.get(/.*[^(dev)]\.js$/, function (req, res) {
    //     res.redirect(req.url + '.dev.js');
    // });
    let day = new Date().getDay();
    if (record.openTime != day) {
        record.openTime = day;
        fs.writeFileSync(`${__dirname}/record.json`, JSON.stringify(record));
        open(`http://localhost:${config.webPort}/`, 'chrome');
    }

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
    server.listen(config.devPort);
}

