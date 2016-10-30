var socket = io.connect('http://localhost:3000/');
socket.on('reload', function (msg) {
    window.location.reload();
});
socket.emit('message', '连接成功！');

//# sourceMappingURL=socket.js.map
