'use strict';
var socketio = require('socket.io');
var io = null;
var onlineUserIds = [];

module.exports = function(server) {

	if (io) return io;

	io = socketio(server);

	io.on('connection', function(socket) {
		// 2) receive logged in user from frontend
		socket.on('justCameOnline', function(userId) {

			// 3) push user into array of online users
			// provided that the id isn't already listed
			if (onlineUserIds.indexOf(userId) === -1) onlineUserIds.push(userId);

			// 4) supply frontend with updated 
			// array of online users 
			// [go to /sidebarCtrl.js line 14]
			socket.emit('onlineUsers', onlineUserIds);
		})

		// 13) receive logged out user from frontend
		socket.on('logout', function(userId) {
			var userIndex = onlineUserIds.indexOf(userId);
			// 14) if the user exists in the array of currently
			// online users, splice it out
			if (userIndex > -1) onlineUserIds.splice(userIndex, 1);

			// 15) send the offline user to frontend
			// [go to /sidebarCtrl.js line 22]
			socket.emit('offlineUser', userId);
		})
	})

	return io;

};