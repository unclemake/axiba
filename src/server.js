"use strict";
const express = require('express');
const http = require('http');
const socket = require('socket.io');
const config_1 = require('./config');
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
    // open('http://localhost:666/', 'chrome');
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
