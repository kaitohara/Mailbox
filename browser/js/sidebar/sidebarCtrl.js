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
		return new Promise(function(resolve, reject){
			userFactory.getTeamMembers(teamId)
				.then(function(teammates) {
					if (teammates){
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


	$scope.clearTeamMembers = function() {
		$scope.teammates = []
	}

	$scope.showOnlineStatus();

	// Socket.on('offlineUser', function(userId) {
	// 	console.log('someone logged off!')
	// 	$scope.$apply(function() {
	// 		if ($scope.onlineUsers.indexOf(userId) > -1) {
	// 			$scope.teammates.forEach(function(teammate) {
	// 				if (teammate._id === userId) teammate.isOnline = false;
	// 			})
	// 		}
	// 	})
	// })
	$rootScope.$on('addedTeamMember', function() {
		console.log('i added a team member from the sidebar!', $scope.team._id)
		$scope.getTeamMembers($scope.team._id);
	})

	$scope.setTeamActive = function(index) {
		if (index !== $scope.activeTeam[0]){
			console.log('setTeamActive')	
			$rootScope.$emit('changedInbox', 'team')
		}
		$scope.activeTeam = [index, 'active'];
		$scope.myInboxActive = false;
		$scope.activeTeammate = -1;
	}
	$scope.setMyInboxActive = function() {
		if (!$scope.myInboxActive){
			console.log('Setmyinbox')	
			$rootScope.$emit('changedInbox', 'myInbox')
		}
		$scope.myInboxActive = true;
		$scope.activeTeam = [-1, 'inactive'];
		$scope.activeTeammate = -1;
	}
	$scope.setTeammateActive = function(index) {
		if (index !== $scope.activeTeammate[1]){
			console.log('set teammate')	
			$rootScope.$emit('changedInbox', 'teammate')
		}
		$scope.activeTeammate = [$scope.activeTeam[0],index];
		$scope.activeTeam[1] = ['inactive'];
		$scope.myInboxActive = false;
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

	// $scope.broadcastInboxClick = function(index){
	// 	// console.log($scope.activeTeam, index)
	// 	// if (index !== $scope.activeTeam[0]) {
	// 		$rootScope.$emit('clicked')
	// 		console.log('broadcasting')
	// 	// };
	// };

	(function(){
		var path = window.location.pathname;
		if (path.indexOf('user') > -1 && path.indexOf('teams') > -1){
			reloadedTeam = path.replace('/mailbox/teams/','')
			reloadedTeam = reloadedTeam.replace(/\/user\/\w+/, '').replace(/\/thread\/\w+/, '')
			reloadedUser = path.replace(/\/mailbox\/teams\/\w+\/user\//,'').replace(/\/thread\/\w+/, '')

			var teamindex;
			$scope.activeTeamId = reloadedTeam;
			$scope.teams.forEach(function(team, index){
				if (team._id === reloadedTeam) {
					teamindex = index;
					$scope.activeTeam = [index, 'active'];
				}
			});
			$scope.getTeamMembers(reloadedTeam).then(function(){
				$scope.teammates.forEach(function(teammate, index){
					if (teammate._id === reloadedUser) $scope.activeTeammate = [teamindex, index]
				});
			}, function(){console.log('promise rejected :(')})
		} else if (path.indexOf('user') > -1){
			$scope.setMyInboxActive()
		} else if (path.indexOf('teams') > -1){
			reloadedTeam = path.replace('/mailbox/teams/','').replace(/\/thread\/\w+/,'');
			$scope.activeTeamId = reloadedTeam;
			$scope.getTeamMembers(reloadedTeam)
			$scope.teams.forEach(function(team, index){
				if (team._id === reloadedTeam) {
					$scope.activeTeam = [index, 'active'];
				}
			})
		}
	})()

})