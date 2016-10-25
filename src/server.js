"use strict";
const express = require('express');
const index_1 = require('./index');
const open = require("open");
var app = express();
app.get('/', function (req, res) {
    res.sendfile(index_1.default.config.assetsBulid + '/index.html');
});
var server = app.listen(666, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
app.use(express.static(index_1.default.config.assetsBulid));
// app.get(/.*[^(dev)]\.js$/, function (req, res) {
//     res.redirect(req.url + '.dev.js');
// });
open('http://localhost:666/', 'chrome');

//# sourceMappingURL=server.js.map
