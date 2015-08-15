app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'homeCtrl'
    });
});

app.controller('homeCtrl', function ($scope, $http) {

    $scope.getUsersGmailThreads = function () {
    	return $http.post('http://localhost:1337/api/google/getAllEmails')
    	.then(function(threads){
    		$scope.threads = threads.data;
    	})

    };
    // we need to pass the teams access token to the back end so it can be used in the gmail api get request
     $scope.getThisTeamsGmailThreads = function (teamAccessToken) {
    	return $http.post('http://localhost:1337/api/google/getAllEmails', {accessToken: teamAccessToken})
    	.then(function(threads){
    		$scope.threads = threads.data;
    	})

    };

});