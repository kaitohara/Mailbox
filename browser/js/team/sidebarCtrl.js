app.controller('sidebarCtrl', function($scope, teamFactory, userFactory, $state, inboxFactory) {
	// $scope.team;
	$scope.activeTeam;
	$scope.team;

	$scope.getTeamMembers = function(team) {
		userFactory.getTeamMembers(team._id)
			.then(function(teammates) {
				$scope.teammates = teammates;
			})
	}
	
	$scope.goToTeam = function(team){
		$scope.team = team;
		console.log('going to team', team._id)
		$state.go('home.teamId', {teamId: team._id})
	}

	$scope.getThisEmailFromTheThread = function(threadId) {
		console.log('hit this')
        teamFactory.getThisEmailFromTheThread(threadId, $scope.activeTeam._id)
            .then(function(fullEmail) {
                $scope.thread = fullEmail;
            })
    };
    $scope.syncInbox = function(){
    	console.log('hit this', $scope.team._id)
    	inboxFactory.syncInbox($scope.team._id)
    }
})