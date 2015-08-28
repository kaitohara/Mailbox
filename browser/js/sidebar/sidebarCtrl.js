app.controller('sidebarCtrl', function($scope, teamFactory, $stateParams, userFactory, $state, inboxFactory, Socket, $rootScope) {
	$scope.activeTeam;
	$scope.team;
	$scope.user = $rootScope.user || 'Nobody'
	$scope.onlineUsers; // [123, 125, 126, 200, 500, 124]
	$scope.teammates; // [{_id: 123, isOnline = true}, {_id: 124, isOnline = false}]
	$scope.showLoader = false;
	$scope.activeTeam = [0, 'active'];
	$scope.myInboxActive = false;
	$scope.activeTeammate;
	$scope.activeTeamId;

	var reloadedTeam;
	var reloadedUser;

	$scope.getTeamMembers = function(teamId) {
		$scope.activeTeamId = teamId;
		console.log('here', $scope.activeTeamId)
		return new Promise(function(resolve, reject) {
			userFactory.getTeamMembers(teamId)
				.then(function(teammates) {
					if (teammates) {
						$scope.teammates = teammates;
						$scope.teammates.forEach(function(teammate) {
							if ($scope.onlineUsers && $scope.onlineUsers.indexOf(teammate._id) > -1) {
								teammate.isOnline = true;
							}
						})
						resolve();
					}
					reject();
				})
		})
	};

	$rootScope.$on('addedTeamMember', function() {
		$scope.getTeamMembers($scope.activeTeamId);
	})

	$scope.showOnlineStatus = function() {
		Socket.emit('justCameOnline', $scope.user._id);
		Socket.on('onlineUsers', function(onlineUserIds) {
			$scope.onlineUsers = onlineUserIds;
			$scope.getTeamMembers($stateParams.teamId)
		})

		Socket.on('offlineUser', function(userId) {
			console.log('this person logged off', userId)
			$scope.$apply(function() {
				if ($scope.onlineUsers.indexOf(userId) > -1) {
					$scope.teammates.forEach(function(teammate) {
						if (teammate._id === userId) teammate.isOnline = false;
					})
				}
			})
		})
	}


	console.log('User', $scope.team)
	console.log('teams', $scope.teams)

	$scope.clearTeamMembers = function() {
		$scope.teammates = []
	}

	$scope.showOnlineStatus();

	$scope.setTeamActive = function(index) {
		console.log('index', index)
		$scope.activeTeam = [index, 'active'];
		$scope.myInboxActive = false;
		$scope.activeTeammate = -1;
	}
	$scope.setMyInboxActive = function() {
		$scope.myInboxActive = true;
		$scope.activeTeam = [-1, 'inactive'];
		$scope.activeTeammate = -1;
	}
	$scope.setTeammateActive = function(index) {
		$scope.activeTeammate = [$scope.activeTeam[0], index];
		$scope.activeTeam[1] = ['inactive'];
		$scope.myInboxActive = false;
		console.log($scope.activeTeammate)
	}
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
		$state.go('home.teammateId', {
			teamId: $scope.activeTeamId || reloadedTeam,
			userId: teammate._id
		})
	}

	$scope.getThisEmailFromTheThread = function(threadId) {
		teamFactory.getThisEmailFromTheThread(threadId)
			.then(function(fullEmail) {
				$scope.thread = fullEmail;
			})
	};

	(function() {
		var path = window.location.pathname;
		if (path.indexOf('user') > -1 && path.indexOf('teams') > -1) {
			reloadedTeam = path.replace('/mailbox/teams/', '')
			reloadedTeam = reloadedTeam.replace(/\/user\/\w+/, '').replace(/\/thread\/\w+/, '')
			reloadedUser = path.replace(/\/mailbox\/teams\/\w+\/user\//, '').replace(/\/thread\/\w+/, '')

			var teamindex;
			$scope.activeTeamId = reloadedTeam;
			$scope.teams.forEach(function(team, index) {
				if (team._id === reloadedTeam) {
					teamindex = index;
					$scope.activeTeam = [index, 'active'];
				}
			});
			$scope.getTeamMembers(reloadedTeam).then(function() {
				$scope.teammates.forEach(function(teammate, index) {
					if (teammate._id === reloadedUser) $scope.activeTeammate = [teamindex, index]
				});
			}, function() {
				console.log('promise rejected :(')
			})
		} else if (path.indexOf('user') > -1) {
			$scope.setMyInboxActive()
		} else if (path.indexOf('teams') > -1) {
			reloadedTeam = path.replace('/mailbox/teams/', '');
			$scope.activeTeamId = reloadedTeam;
			$scope.getTeamMembers(reloadedTeam)
			$scope.teams.forEach(function(team, index) {
				if (team._id === reloadedTeam) {
					$scope.activeTeam = [index, 'active'];
				}
			})
		}
	})()

})