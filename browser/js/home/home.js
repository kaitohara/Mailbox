app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'homeCtrl'
    });
});

app.controller('homeCtrl', function ($scope, $log, userFactory, teamFactory) {

//populates $scope.teams - somehow couldn't figure out he=w to do with resolve in state
	teamFactory.getAllTeams().then(function(teams){
		$scope.teams = teams.data;
		$scope.showEmailDetails = false
	});
 //populates $scope.users - somehow couldn't figure out he=w to do with resolve in state
 	userFactory.getAllUsers().then(function(users){
		$scope.users = users.data;
	});
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