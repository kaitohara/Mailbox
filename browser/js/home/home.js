app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'homeCtrl'
    });
});

app.controller('homeCtrl', function ($scope, $http) {

    $scope.getUsersGmailThreads = function () {
    	return $http.get('http://localhost:1337/api/google/getAllEmails')
    	.then(function(threads){
    		$scope.threads = threads.data;
    	})

    };

});