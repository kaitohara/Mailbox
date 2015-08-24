app.controller('sidebarCtrl', function($scope, teamFactory, userFactory, $state, inboxFactory, Socket, $rootScope) {
	// $scope.team;
	$scope.activeTeam;
	$scope.team;
	$scope.user = $rootScope.user || 'Nobody'
	$scope.onlineUsers; // [123, 125, 126, 200, 500, 124]
	$scope.teammates; // [{_id: 123, isOnline = true}, {_id: 124, isOnline = false}]

	$scope.showOnlineStatus = function() {
		// 1) tell backend which user is online 
		// [go to /server/io/index.js line 13]
		Socket.emit('justCameOnline', $scope.user._id);

		// 5) receive array of logged in users from backend.
		// [go down to line 35]
		Socket.on('onlineUsers', function(onlineUserIds) {
			$scope.onlineUsers = onlineUserIds;
		})

		Socket.on('offlineUser', function(userId) {
			var userIndex = $scope.onlineUsers.indexOf(userId);
			// 16) if the user that supposedly logged off indeed
			// exists in the front end's "online users" array,
			// go into the user's teammates and set their
			// status to false. Upon this change, sidebar.html
			// will color the glyphicon red. the end!
			if (userIndex) {
				$scope.teammates.forEach(function(teammate) {
					if (teammate._id === userId) teammate.isOnline = false;
				})
			}
		})
	}

	// 6) function runs as soon as the user logs in,
	// which means $scope.onlineUsers exists on the scope
	// BEFORE the user clicks a specific team from the sidebar
	$scope.showOnlineStatus();

	// 7) user clicks a specific team from the sidebar
	$scope.getTeamMembers = function(team) {
		userFactory.getTeamMembers(team._id)
			.then(function(teammates) {
				// 8) angular displays teammates
				// on the sidebar
				$scope.teammates = teammates;

				// 9) look through the user's
				// teammates and then...
				$scope.teammates.forEach(function(teammate) {

					// 10) ... see if any of them have
					// the same IDs as those listed in
					// $scope.onlineUsers.

					// In other words, see if any of the
					// teammates are online. This is easy
					// to tell because the frontend had received
					// an array of all online users from the
					// backend upon login (up in line 16).
					if ($scope.onlineUsers.indexOf(teammate._id) > -1) {

						// [go to sidebar.html line 36]
						teammate.isOnline = true;
					}
				})
			})
	}

	$scope.goToTeam = function(team) {
		$scope.team = team;
		console.log('going to team', team._id)
		$state.go('home.teamId', {
			teamId: team._id
		})
	}

	$scope.getThisEmailFromTheThread = function(threadId) {
		console.log('hit this')
		teamFactory.getThisEmailFromTheThread(threadId, $scope.activeTeam._id)
			.then(function(fullEmail) {
				$scope.thread = fullEmail;
			})
	};

	$scope.syncInbox = function() {
		inboxFactory.syncInbox($scope.team._id)
		.then(function(result){
			$rootScope.$emit('synced', 'sync complete')
			console.log('result', result)
		})
	};

	
})