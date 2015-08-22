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

	$scope.testNameSpace = function() {
		console.log('testing...')
		Socket.emit('test', 'whats uppp');
	}

	$scope.showOnlineStatus = function() {
		Socket.emit('onlineStatus', `${$scope.name} is online`);
	}

	$scope.showOnlineStatus();

	$scope.goToTeam = function(team) {
		$scope.team = team;
		console.log('going to team', team._id)
		$state.go('home.teamId', {
				teamId: team._id
			}).then(function() {
				window.history.replaceState({}, 'nameSpace', '/teams/55d8d8ab3f07c7a0f67ec8d2/');
				// Socket.nsp = window.location.pathname;
				console.log('printing using promises', window.location.pathname)
			})
			// $scope.testNameSpace();
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
})