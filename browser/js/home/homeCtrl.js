app.controller('homeCtrl', function ($scope, $log, userFactory, teamFactory, teams, users) {
    
    $scope.teams = teams
    $scope.users = users
    $scope.showEmailDetails = false

    $scope.toggleShowEmail = function(){
        $scope.showEmailDetails = !$scope.showEmailDetails
    }

    $scope.getThisTeamsGmailThreads = function (team) {
    	return teamFactory.getThisTeamsGmailThreads(team)
    	.then(function(threads){
    		$scope.activeTeam = team;
    		$scope.threads = threads.threads;
    	})
    };
    
    $scope.getThisEmailFromTheTread = function(threadId){
    	teamFactory.getThisEmailFromTheTread(threadId, $scope.activeTeam._id)
    	.then(function(fullEmail){
			$scope.email = fullEmail;
    	})
    }

});