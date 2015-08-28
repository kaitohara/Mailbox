app.controller('inboxCtrl', function($rootScope, $scope, $state, threads, Socket, teamFactory, team, inboxFactory, userFactory) {
	$scope.inboxTeam = $scope.team || team || returnOneTeamId();
	$scope.threads = threads;
	// $scope.hideGhostNavbar
	$scope.active;

	$scope.teammates;

	$scope.getTeamMembers = function(teamId) {
		userFactory.getTeamMembers(teamId)
			.then(function(teammates) {
				console.log('inboxCtrl teammates', teammates)
				$scope.teammates = teammates;
				// $scope.teammates.forEach(function(teammate) {
				// 	if ($scope.onlineUsers && $scope.onlineUsers.indexOf(teammate._id) > -1) {
				// 		teammate.isOnline = true;
				// 	}
				// })
			})
	}

	function returnOneTeamId() {
		userFactory.getUser($rootScope.user._id).then(function(user) {
			console.log('first team', user.data.teams[0]._id);
			$scope.getTeamMembers(user.data.teams[0]._id);
		})
	}

	returnOneTeamId();

	function shortenSubject(thread, shortenTo) {
		var subject = thread.latestMessage.subject
		if (subject.length > shortenTo) {
			thread.latestMessage.subject = subject.slice(0, shortenTo) + '...'
		}
	}

	function displayPersonalAssignment(threadsArray) {
		threadsArray.forEach(function(thread) {
			shortenSubject(thread, 25);
			if (thread.assignedTo && thread.assignedTo._id === $rootScope.user._id) {
				thread.assignedTo.firstName = "You"
			}
		})
	}

	displayPersonalAssignment($scope.threads)

	$scope.assignedTo;

	$rootScope.$on('threadAssignment', function() {
		$scope.refreshThreads();
	})

	$scope.setActive = function(index) {
		$scope.active = index;
	};

	$scope.goToTeamThread = function(threadId) {
		$state.go('home.teamId.threadId', {
				threadId: threadId
			})
			// $scope.hideGhostNavbar = true;
	};

	$scope.goToUserThread = function(threadId) {
		$rootScope.$emit('userInbox');
		$state.go('home.userId.threadId', {
			threadId: threadId
		})

		// $scope.hideGhostNavbar = true;
	};

	$rootScope.$on('synced', function() {
		console.log('syncing, heard it')
		$scope.refreshThreads();
	})

	$scope.refreshThreads = function() {
		if ($scope.inboxTeam) {
			teamFactory.getThisTeamsGmailThreadsId($scope.inboxTeam._id)
				.then(function(threads) {
					$scope.threads = threads;
					displayPersonalAssignment($scope.threads);
				})
		} else {
			console.log('user assignments')
		}
	};

	$scope.cleanName = function(name) {
		var regex = / <.+>/
		return name.replace(regex, '')
	}

	$scope.simplifyDate = function(date) {
		return moment(date * 1).format("MMM DD h:mm a")
	}

	$scope.syncInbox = function() {
		$scope.showLoader = true;
		inboxFactory.syncInbox($scope.inboxTeam._id)
			.then(function() {
				console.log('emitting')
				$rootScope.$emit('synced', 'sync complete')
				$scope.showLoader = false;
			})
	}
})