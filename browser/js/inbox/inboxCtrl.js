app.controller('inboxCtrl', function($scope, $state, threads, Socket) {

	$scope.threads = threads;

	$scope.goToThread = function(threadId) {
		console.log('going to thread', threadId)
		$state.go('home.teamId.threadId', {
			threadId: threadId
		})
	};

	$scope.pathname = window.location.pathname;

	$scope.getPath = function() {
		$scope.pathname = window.location.pathname;
	}

	$scope.test = function() {
		Socket = io('/teams/55d8d8ab3f07c7a0f67ec8d2/');
		console.log(Socket)
		console.log('testing from frontend', window.location.pathname)
			// Socket.nsp = window.location.pathname;
			// var socket = io('/my-namespace');

		// Socket.emit('test', 'whats uppp');
		// Socket.on('secondTest', function(returnMessage) {
		// 	console.log(returnMessage);
		// })
	}

})