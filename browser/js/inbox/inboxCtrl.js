app.controller('inboxCtrl', function($rootScope, $scope, $state, threads, Socket, teamFactory) {

	$scope.threads = threads;
	$scope.assignedTo;

	console.log('threads', threads)

	$rootScope.$on('threadAssignment', function(event, assignedThread) {
		// console.log('the assigned thread is:', assignedThread)
		console.log('all the threads', threads)
		$scope.threads.forEach(function(thread) {
			// console.log('threadId', thread._id)
			// console.log('assignedThreadId', assignedThread._id)
			if (thread._id === assignedThread._id) {
				console.log('individual thread', thread)
					// console.log('middle column thread assignment', thread.assignedTo)
					// console.log('right column thread assignment', assignedThread.assignedTo.firstName)
					// thread.assignedTo = assignedThread.assignedTo.firstName;
					// $scope.threads[0].assignedTo = 'please work';
					// $scope.$digest()
					// console.log($scope.threads)
					// $scope.$apply(function() {
					// 	thread.assignedTo = assignedThread.assignedTo.firstName;
					// })
			}

			// thread.assignedTo = assignedThread.assignedTo.firstName
			// console.log(thread.assignedTo, assignedThread.assignedTo.firstName)
			// console.log('potentially altered thread', $scope.threads)
		})
	})


	$scope.goToTeamThread = function(threadId) {
		console.log('still hitting this')
		$state.go('home.teamId.threadId', {
			threadId: threadId
		})
	};

	$scope.goToUserThread = function(threadId) {
		$state.go('home.userId.threadId', {
			threadId: threadId
		})
	};

	$rootScope.$on('synced', function() {
		console.log('heard it')
		$scope.refreshThreads();
	})

	$scope.refreshThreads = function() {
		console.log('log this');
		teamFactory.getThisTeamsGmailThreadsId($scope.team._id)
			.then(function(threads) {
				$scope.threads = threads;
			})
	};

	$scope.cleanName = function(name) {
		var regex = / <.+>/
		return name.replace(regex, '')
	}

	$scope.simplifyDate = function(date) {
		return moment(date * 1).format("MMM DD h:mm a")
	}
})