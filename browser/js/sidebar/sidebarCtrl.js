app.controller('sidebarCtrl', function($scope, teamFactory, $stateParams, userFactory, $state, inboxFactory, Socket, $rootScope) {
	$scope.activeTeam;
	$scope.team;
	$scope.user = $rootScope.user || 'Nobody'
	$scope.onlineUsers; // [123, 125, 126, 200, 500, 124]
	$scope.teammates; // [{_id: 123, isOnline = true}, {_id: 124, isOnline = false}]
	$scope.showLoader = false;
	$scope.active = 0;
	$scope.myInboxActive = false;

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

		Socket.on('offlineUser', function(userId) {
			var userIndex = $scope.onlineUsers.indexOf(userId);
			if (userIndex > -1) {
				console.log('current teammates', $scope.teammates)
				$scope.teammates.forEach(function(teammate) {
					if (teammate._id === userId) teammate.isOnline = false;
				})
			}
		})
	}
	$scope.setActive = function(index){
		console.log('index', index)
		$scope.active = index;
		$scope.myInboxActive = false;
	}
	$scope.setMyInboxActive = function(){
		console.log('yo')
		$scope.myInboxActive = true;
		$scope.active = -1;
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

	$scope.getThisEmailFromTheThread = function(threadId) {
		teamFactory.getThisEmailFromTheThread(threadId)
			.then(function(fullEmail) {
				$scope.thread = fullEmail;
			})
	};


})