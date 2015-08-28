app.controller('inboxCtrl', function($rootScope, $scope, $state, threads, Socket, teamFactory, team, inboxFactory, userFactory) {
	$scope.inboxTeam = $scope.team || team || returnOneTeamId();
	$scope.threads = threads;
	// $scope.hideGhostNavbar
	$scope.active;
	$scope.teammates;
	$scope.selectedTeammate;
	// $scope.assignedColor = 'red';

	$scope.getTeamMembers = function(teamId) {
		userFactory.getTeamMembers(teamId)
			.then(function(teammates) {
				$scope.teammates = teammates;
			})
	}

	// ensures that the assignment dropdown updates
	// with new team member
	$rootScope.$on('addedTeamMember', function() {
		$scope.getTeamMembers($scope.inboxTeam._id);
	})

	function returnOneTeamId() {
		return userFactory.getUser($rootScope.user._id).then(function(user) {
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

	var colors = ['orange', 'blue', 'green', 'purple']

	function sumAsciiValues(str) {
		var sum = 0;
		for (var c in str) {
			sum += str[c].charCodeAt()
		}
		return sum;
	}

	function randomColorPicker(userId) {
		if (userId) {
			var color = colors[sumAsciiValues(userId.slice(userId)) % colors.length]
			return color;
		}
	}

	function displayPersonalAssignment(threadsArray) {
		threadsArray.forEach(function(thread) {
			shortenSubject(thread, 25);
			if (thread.assignedTo && thread.assignedTo._id) {
				if (thread.assignedTo._id === $rootScope.user._id) {
					thread.assignedTo.firstName = "You"
					thread.color = 'red'
				} else {
					thread.color = randomColorPicker(thread.assignedTo._id)
				}
				// for choosing a teammate from the sidebar
			} else {
				userFactory.getUser(thread.assignedTo).then(function(user) {
					$scope.selectedTeammate = user.data.firstName;
				})
				thread.color = randomColorPicker(thread.assignedTo);
				console.log('the color is', thread.color)
			}
			// else if (thread.assignedTo && !thread.assignedTo._id)
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

	$scope.goToTeammateThread = function(threadId) {
		$rootScope.$emit('userInbox');
		$state.go('home.teammateId.threadId', {
			threadId: threadId
		})

		// $scope.hideGhostNavbar = true;
	};

	$rootScope.$on('synced', function() {
		$scope.refreshThreads();
	})

	console.log('threads', $scope)

	$scope.refreshThreads = function() {
		if ($scope.inboxTeam) {
			teamFactory.getThisTeamsGmailThreadsId($scope.inboxTeam._id)
				.then(function(threadsFound) {
					$scope.threads = threadsFound;
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