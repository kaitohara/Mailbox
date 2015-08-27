'use strict';
var socketio = require('socket.io');
var io = null;
var onlineUserIds = [];

module.exports = function(server) {

	if (io) return io;

	io = socketio(server);

	io.on('connection', function(socket) {
		socket.on('justCameOnline', function(userId) {
			console.log('someone came online!', userId)
			if (onlineUserIds.indexOf(userId) === -1) onlineUserIds.push(userId);
			socket.broadcast.emit('onlineUsers', onlineUserIds);
		})

		socket.on('logout', function(userId) {
			console.log('this user is logging out', userId)
			var userIndex = onlineUserIds.indexOf(userId);
			if (userIndex > -1) onlineUserIds.splice(userIndex, 1);
			socket.broadcast.emit('offlineUser', userId);
		})
	})

	return io;

};