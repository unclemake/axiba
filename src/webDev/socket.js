"use strict";
const config_1 = require('../config');
const io = require('socket.io-client');
function run() {
    var socket = io.connect(`http://localhost:${config_1.default.devPort}/`);
    socket.on('reload', function (msg) {
        window.location.reload();
    });
    socket.emit('message', '连接成功！');
}
exports.run = run;

//# sourceMappingURL=socket.js.map
