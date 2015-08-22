'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function(server) {

	if (io) return io;

	io = socketio(server);

	// console.log(io);

	// io.on('connection', function(socket) {
	// 	// Now have access to socket, wowzers!
	// 	socket.on('onlineStatus', function(status) {
	// 		console.log(status)
	// 	})

	// 	socket.on('logout', function(status) {
	// 		console.log(status)
	// 	})
	// });

	// io.on('connection', function(socket) {
	// 	socket.on('test', function(message) {
	// 		console.log(message);
	// 		socket.emit('secondTest', 'right back at ya')
	// 	})
	// })

	var nsp = '/teams/55d8d8ab3f07c7a0f67ec8d2/'

	io.of(nsp).on('connection', function(socket) {
		console.log('someone entered your namespace!');
		// socket.on('test', function(message) {
		// 	console.log('message', message)
		// 	socket.emit('testing', 'testing')
		// })
	});

	return io;

};