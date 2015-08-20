app.controller('teamCtrl', function($scope, teamFactory) {
	$scope.team;

	$scope.getThisTeamsGmailThreads = function(team) {
		return teamFactory.getThisTeamsGmailThreads(team)
			.then(function(threads) {
				console.log('team controller')
				$scope.activeTeam = team;
				$scope.threads = threads;
			})
	};
})