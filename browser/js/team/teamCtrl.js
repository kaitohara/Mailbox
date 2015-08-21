app.controller('sidebarCtrl', function($scope, teamFactory, userFactory, $state) {
	$scope.team;
	$scope.activeTeam;

	$scope.getTeamMembers = function() {
		userFactory.getTeamMembers($scope.activeTeam._id)
			.then(function(teammates) {
				$scope.teammates = teammates;
			})
	}
/////added for child states
	$scope.goToTeam = function(team){
		console.log('gooing to team', team)
		$state.go('home.teamId', {teamId: team._id})
	}
	$scope.goToThread = function(team, threadId){
		console.log('gooing to thread', threadId)
		$state.go('home.teamId.threadId', {teamId: team._id, threadId: threadId})
	}
////////////////////////
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
})