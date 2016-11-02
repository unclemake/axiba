import config from '../config';
import * as io from 'socket.io-client';

export function run() {
    var socket = io.connect(`http://localhost:${config.devPort}/`);
    socket.on('reload', function (msg) {
        window.location.reload();
    });
    socket.emit('message', '连接成功！');
}


