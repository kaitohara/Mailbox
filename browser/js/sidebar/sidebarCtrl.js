app.controller('sidebarCtrl', function($scope, teamFactory, $stateParams, userFactory, $state, inboxFactory, Socket, $rootScope) {
	$scope.activeTeam;
	$scope.team;
	$scope.user = $rootScope.user || 'Nobody'
	$scope.onlineUsers; // [123, 125, 126, 200, 500, 124]
	$scope.teammates; // [{_id: 123, isOnline = true}, {_id: 124, isOnline = false}]
	$scope.showLoader = false;
	$scope.activeTeam = 0;
	$scope.myInboxActive = false;
	$scope.activeTeammate;

	$scope.clearTeamMembers = function() {
		$scope.teammates = []
	}

	// 7) user clicks a specific team from the sidebar
	$scope.getTeamMembers = function(teamId) {
		userFactory.getTeamMembers(teamId)
			.then(function(teammates) {
				$scope.teammates = teammates;
				$scope.teammates.forEach(function(teammate) {
					if ($scope.onlineUsers.indexOf(teammate._id) > -1) {
						teammate.isOnline = true;
					}
				})
			})
	}

	$scope.showOnlineStatus = function() {
		Socket.emit('justCameOnline', $scope.user._id);
		Socket.on('onlineUsers', function(onlineUserIds) {
			$scope.onlineUsers = onlineUserIds;
			$scope.getTeamMembers($stateParams.teamId)
		})

		// Socket.on('offlineUser', function(userId) {
		// 	$scope.$apply(function() {
		// 		if ($scope.onlineUsers.indexOf(userId) > -1) {
		// 			$scope.teammates.forEach(function(teammate) {
		// 				if (teammate._id === userId) teammate.isOnline = false;
		// 			})
		// 		}
		// 	})

		// })
	}

	Socket.on('offlineUser', function(userId) {
		console.log('someone logged off!')
		$scope.$apply(function() {
			if ($scope.onlineUsers.indexOf(userId) > -1) {
				$scope.teammates.forEach(function(teammate) {
					if (teammate._id === userId) teammate.isOnline = false;
				})
			}
		})
	})

	$scope.setTeamActive = function(index) {
		console.log('index', index)
		$scope.activeTeam = index;
		$scope.myInboxActive = false;
		$scope.activeTeammate = -1;
	}
	$scope.setMyInboxActive = function() {
		$scope.myInboxActive = true;
		$scope.activeTeam = -1;
		$scope.activeTeammate = -1;
	}
	$scope.setTeammateActive = function(index) {
		console.log(index)
		$scope.activeTeammate = index;
		$scope.activeTeam = -1;
		$scope.myInboxActive = false;
	}


	$scope.showOnlineStatus();

	$scope.goToTeam = function(team) {
		$scope.team = team;
		$state.go('home.teamId', {
			teamId: team._id
		})
	}

	$scope.goToUser = function() {
		$scope.teammates = []
		$state.go('home.userId', {
			userId: $scope.user._id
		})
	}

	$scope.seeUserAssignments = function(teammate) {
		$state.go('home.userId', {
			userId: teammate._id
		})
	}

	$scope.getThisEmailFromTheThread = function(threadId) {
		teamFactory.getThisEmailFromTheThread(threadId)
			.then(function(fullEmail) {
				$scope.thread = fullEmail;
			})
	};


})