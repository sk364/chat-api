var fs = require('fs');
var express = require('express');
var app = express();
var socket = require('./public/socketRoutes.js');

var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname));

var port = process.env.PORT || 8081;
server.listen(port);

exports = module.exports = server;

fs.closeSync(fs.openSync('./usersData.json', 'w'));
io.on('connection', socket);

console.log('Use port ' + port + ' to connect to this server');
