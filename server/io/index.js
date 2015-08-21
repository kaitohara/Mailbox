'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function(server) {

	if (io) return io;

	io = socketio(server);

	io.on('connection', function(socket) {
		// Now have access to socket, wowzers!
		socket.on('onlineStatus', function(status) {
			console.log(status)
		})

		socket.on('logout', function(status) {
			console.log(status)
		})
	});
	return io;

};