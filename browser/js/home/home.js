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

app.controller('homeCtrl', function ($scope, $http, $modal, $log) {

//populates $scope.teams
	(function(){
        $scope.showEmailDetails = false
	  	return $http.get('http://localhost:1337/api/teams')
	  	.then(function(allTeams){
	  		$scope.teams = allTeams.data;
	  	})
 	})();
 //populates $scope.users
 	(function(){
	  	return $http.get('http://localhost:1337/api/users')
	  	.then(function(allUsers){
	  		$scope.users = allUsers.data;
	  	})
 	})();
////////// MODAL ///////
   $scope.animationsEnabled = true;

   $scope.settingsModal = function(size) {
   var modalInstance = $modal.open({
       	animation: $scope.animationsEnabled,
       	templateUrl: 'js/home/settingsModal.html',
      	controller: 'ModalInstanceCtrl',
       	// size: size,
       	resolve: {
           	teams: function() {
               return $scope.teams;
           	},
           	users: function() {
               return $scope.users;
           	}
       	}
   	});
    modalInstance.result.then(function(selectedTeam) {
	    $scope.selected = selectedTeam;
	}, function() {
	    	$log.info('Modal dismissed at: ' + new Date());
		});
   	};
   	$scope.toggleAnimation = function() {
       $scope.animationsEnabled = !$scope.animationsEnabled;
   	};
////////// END MODAL ///////////
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
});