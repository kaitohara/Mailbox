app.controller('sidebarCtrl', function($scope, teamFactory, userFactory, $state) {
	// $scope.team;
	$scope.activeTeam;

	$scope.getTeamMembers = function(team) {
		userFactory.getTeamMembers(team._id)
			.then(function(teammates) {
				$scope.teammates = teammates;
			})
	}
/////added for child states
	$scope.goToTeam = function(team){
		console.log('going to team', team._id)
		$state.go('home.teamId', {teamId: team._id})
	}

////////////////////////
	// $scope.getThisTeamsGmailThreads = function(team) {
	// 	console.log(team)
	// 	return teamFactory.getThisTeamsGmailThreads(team)
	// 		.then(function(threads) {
	// 			$scope.activeTeam = team;
	// 			$scope.threads = threads;
	// 		})
	// 		.then(function() {
	// 			$scope.getTeamMembers();
	// 		})
	// };

	$scope.getThisEmailFromTheThread = function(threadId) {
		console.log('hit this')
        teamFactory.getThisEmailFromTheThread(threadId, $scope.activeTeam._id)
            .then(function(fullEmail) {
                $scope.thread = fullEmail;
            })
    };
})