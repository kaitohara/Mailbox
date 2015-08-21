app.controller('sidebarCtrl', function($scope, teamFactory, userFactory, $state, inboxFactory, Socket, $rootScope) {
	// $scope.team;
	$scope.activeTeam;
	$scope.team;
	$scope.user = $rootScope.user || 'Nobody'
	$scope.name = $scope.user.firstName ? $scope.user.firstName : 'Nobody'

	$scope.getTeamMembers = function(team) {
		userFactory.getTeamMembers(team._id)
			.then(function(teammates) {
				$scope.teammates = teammates;
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
	}

	$scope.showOnlineStatus = function() {
		Socket.emit('onlineStatus', `${$scope.name} is online`);
	}

	$scope.showOnlineStatus();
})