"use strict";
const fs = require('fs');
const express = require('express');
const http = require('http');
const socket = require('socket.io');
const config_1 = require('./config');
const open = require("open");
var record = require('./record.json');
exports.reload = () => { };
function run() {
    var app = express();
    app.get('/', function (req, res) {
        res.sendfile(config_1.default.assetsBulid + '/index.html');
    });
    //监听 666
    var server = app.listen(config_1.default.webPort, function () {
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
        open(`http://localhost:${config_1.default.webPort}/`, 'chrome');
    }
    var server = http.createServer();
    var io = socket(server);
    io.on('connection', function (client) {
        exports.reload = () => {
            client.emit('reload', {});
        };
        client.on('message', function (data) {
            console.log(data);
        });
    });
    server.listen(config_1.default.devPort);
}
exports.run = run;

//# sourceMappingURL=server.js.map
