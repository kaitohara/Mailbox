app.controller('inboxCtrl', function($rootScope, $scope, $state, threads, Socket, teamFactory, team, inboxFactory, userFactory, $location) {
	$scope.inboxTeam = $scope.team || team || returnOneTeamId();
	$scope.threads = threads;
	// $scope.hideGhostNavbar
	$scope.activeThread;
	$scope.teammates;
	$scope.selectedTeammate;
	// $scope.assignedColor = 'red';

	console.log('window.location.pathname',window.location.pathname)
	// $state.go('home.userId.threadId', {threadId: threads[0]._id})

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
		})
	}

	displayPersonalAssignment($scope.threads)

	$scope.assignedTo;

	$rootScope.$on('threadAssignment', function() {
		$scope.refreshThreads();
	})

	

	$scope.setActive = function(index) {
		$scope.activeThread = index;
	};

	$scope.goToTeamThread = function(threadId) {
		$state.go('home.teamId.threadId', {
				threadId: threadId
			})
			// $scope.hideGhostNavbar = true;
	};

	$scope.goToUserThread = function(threadId) {
		console.log('trying to open one thread')
		$rootScope.$emit('userInbox');
		$state.go('home.userId.threadId', {
			threadId: threadId
		})
	};

	$scope.goToTeammateThread = function(threadId) {
		$rootScope.$emit('userInbox');
		setTimeout(function(){
			$state.go('home.teammateId.threadId', {
				threadId: threadId
			}, 2000)
		})
	};

	var threadfunctions = {
		// 'myInbox': $scope.goToUserThread,
		'myInbox' : function(){console.log('dummy')},
		// 'team': $scope.goToTeamThread,
		'team': function(){console.log('dummy')},
		// 'teammate': $scope.goToTeammateThread
		'teammate' : function(){console.log('dummy')}
	}

	// var i = 0;

	// $rootScope.$on('changedInbox', function(event, info){
	// 	// console.log('this function has run', i++, 'times')
	// 	console.log('heard new inbox', info)
	// 	console.log('threads[0]._id', threads[0]._id)
	// 	threadfunctions[info](threads[0]._id);
	// })

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
				$rootScope.$emit('synced', 'sync complete')
				$scope.showLoader = false;
			})
	}
	

	function setActiveThreadOnPageLoad(reloadedThread) {
		$scope.threads.forEach(function(thread, index){
				if (thread._id === reloadedThread) {
					$scope.activeThread = index;
				}
			})
	}
	function onPageLoad() {
		
			$scope.$apply();	
		
		var path = window.location.pathname;
		console.log('load this', $location.path())
		var reloadedThread;
		if (path.indexOf('thread') === -1){
			if (path.indexOf('user') > -1 && path.indexOf('teams') > -1) {
				$state.go('home.teammateId.threadId', {threadId: threads[0]._id})
			} else if (path.indexOf('user') > -1){
				$state.go('home.userId.threadId', {threadId: threads[0]._id})
			} else {
				$state.go('home.teamId.threadId', {threadId: threads[0]._id})
			}
			$scope.setActive(0)
		} else if (path.indexOf('user') > -1 && path.indexOf('teams') > -1){
			console.log('1')
			reloadedThread = path.replace(/\/mailbox\/teams\/\w+\/user\/\w+/, '').replace(/\/thread\//,'')
			setActiveThreadOnPageLoad(reloadedThread)
		} else if (path.indexOf('user') > -1){
			console.log('2')
			reloadedThread = path.replace(/\/mailbox\/users\/\w+\/thread\//,'')
			setActiveThreadOnPageLoad(reloadedThread)
		} else if (path.indexOf('teams') > -1){
			console.log('3')
			reloadedThread = path.replace(/\/mailbox\/teams\//, '').replace(/\w+\/thread\//, '')
			setActiveThreadOnPageLoad(reloadedThread)
		} else {
			console.log('4')
			$scope.activeThread = 0;
		}
	}
	onPageLoad();

	// (function(){
	// 	console.log('woo')
	// })();

})