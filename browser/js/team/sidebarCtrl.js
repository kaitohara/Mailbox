// app.controller('sidebarCtrl', function($scope, teamFactory, userFactory, $state, inboxFactory, Socket, $rootScope) {
// 	$scope.activeTeam;
// 	$scope.team;
// 	$scope.user = $rootScope.user || 'Nobody'
// 	$scope.onlineUsers;
// 	$scope.teammates;

// 	$scope.showOnlineStatus = function() {
// 		Socket.emit('justCameOnline', $scope.user._id);
// 		Socket.on('onlineUsers', function(onlineUserIds) {
// 			$scope.onlineUsers = onlineUserIds;
// 		})

// 		Socket.on('offlineUser', function(userId) {
// 			var userIndex = $scope.onlineUsers.indexOf(userId);
// 			if (userIndex) {
// 				$scope.teammates.forEach(function(teammate) {
// 					if (teammate._id === userId) teammate.isOnline = false;
// 				})
// 			}
// 		})
// 	}

// 	$scope.showOnlineStatus();

// 	$scope.getTeamMembers = function(team) {
// 		userFactory.getTeamMembers($scope.team._id)
// 			.then(function(teammates) {
// 				console.log('teammates', teammates)

// 				$scope.teammates = teammates;
// 				$scope.teammates.forEach(function(teammate) {
// 					if ($scope.onlineUsers.indexOf(teammate._id) > -1) {
// 						teammate.isOnline = true;
// 					}
// 				})
// 			})
// 	}

// 	$scope.goToTeam = function(team) {
// 		$scope.team = team;
// 		console.log('going to team', team._id)
// 		$state.go('home.teamId', {
// 			teamId: team._id
// 		})
// 	}

// 	$scope.goToUser = function() {
// 		console.log('trying to go to user')
// 		$state.go('home.userId', {
// 			userId: $scope.user._id
// 		})
// 	}

// 	$scope.getThisEmailFromTheThread = function(threadId) {
// 		console.log('hit this')
// 		teamFactory.getThisEmailFromTheThread(threadId, $scope.activeTeam._id)
// 			.then(function(fullEmail) {
// 				$scope.thread = fullEmail;
// 			})
// 	};
// })