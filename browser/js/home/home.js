app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'homeCtrl'
        // resolve: {
        // 	teams: function($http){
	       //  	return $http.get('http://localhost:1337/api/teams')
        // 	}
        // }
    });
});

app.controller('homeCtrl', function ($scope, $http) {

	(function(){
	  	return $http.get('http://localhost:1337/api/teams')
	  	.then(function(allTeams){
	  		$scope.teams = allTeams.data;
	  	})
 	})()

    $scope.getUsersGmailThreads = function () {
    	return $http.post('http://localhost:1337/api/google/getAllEmails')
    	.then(function(threads){
    		$scope.threads = threads.data;
    	})

    };

    $scope.addTeam = function(team){
    	// add the team to the database with the name and googleId
    	// both are provided by the user inputs
    	return $http.post('http://localhost:1337/api/teams', team)
    	.then(function(createdTeam){
    		console.log('in addTeam ctrl func, createdTeam.data:', createdTeam.data)
    		// make the get request to connect/google in here somehow?????
    		// so that grant will be used to get the account's information
    		// issue is that this get request does not do the same thing as a href
    		// in fact it does nothing from what I can tell
    		// $http.post('http://localhost:1337/api/teams/google', createdTeam.data)
    	})
    	// .then(function(teamFromGrantWithAccessToken){
    	// 	// add the team to the teams array on the home states scope
    	// 	$scope.teams.push(teamFromGrantWithAccessToken)
    	// })
    }

     $scope.getThisTeamsGmailThreads = function (teamAccessToken) {
    	return $http.get('http://localhost:1337/api/google/getAllEmails/'+teamAccessToken)
    	.then(function(threads){
    		$scope.threads = threads.data;
    	})
    };

});