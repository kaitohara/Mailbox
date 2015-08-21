app.controller('teamCtrl', function($scope, teamFactory, userFactory) {
	$scope.team;
	$scope.activeTeam;

	$scope.getTeamMembers = function() {
		userFactory.getTeamMembers($scope.activeTeam._id)
			.then(function(teammates) {
				$scope.teammates = teammates;
			})
	}

	$scope.getThisTeamsGmailThreads = function(team) {
		console.log(team)
		return teamFactory.getThisTeamsGmailThreads(team)
			.then(function(threads) {
				$scope.activeTeam = team;
				$scope.threads = threads;
			})
			.then(function() {
				$scope.getTeamMembers();
			})
	};

	$scope.getThisEmailFromTheThread = function(threadId) {
		console.log('hit this')
        teamFactory.getThisEmailFromTheThread(threadId, $scope.activeTeam._id)
            .then(function(fullEmail) {
                $scope.thread = fullEmail;
            })
    };
    $scope.syncInbox = function(){
    	console.log('hit this')
    	
    }
})