app.directive('sidebar', function($rootScope, AuthService, AUTH_EVENTS, $state) {

	return {
		restrict: 'E',
		templateUrl: 'js/sidebar/sidebar.html',
		controller: 'teamCtrl'
	};

});