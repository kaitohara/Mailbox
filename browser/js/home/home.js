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
            $scope.showEmailDetails = false
	  	})
 	})()

    $scope.getAllUsers = function () {
    	return $http.get('http://localhost:1337/api/users')
    	.then(function(users){
    		$scope.users = users.data;
    	})
    };

    $scope.getThisTeamsGmailThreads = function (team) {
    	return $http.get('http://localhost:1337/api/google/getAllEmails/'+team._id)
    	.then(function(threads){
    		$scope.activeTeam = team;
    		$scope.threads = threads.data.threads;
    	})
    };

    $scope.getThisEmailFromTheTread = function(threadId){
    	return $http.get('http://localhost:1337/api/google/'+$scope.activeTeam._id+'/'+threadId)
    	.then(function(fullEmail){
    		$scope.email = fullEmail.data;
    	})
    }

    $scope.toggleShowEmail = function(){
        $scope.showEmailDetails = !$scope.showEmailDetails
    }

    $scope.getAllUsers()

});