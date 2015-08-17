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

    }

     $scope.getThisTeamsGmailThreads = function (teamAccessToken) {
    	return $http.get('http://localhost:1337/api/google/getAllEmails/'+teamAccessToken)
    	.then(function(threads){
    		$scope.threads = threads.data;
    	})
    };

});