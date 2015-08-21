app.directive('inbox', function($rootScope, AuthService, AUTH_EVENTS, $state) {

	return {
		restrict: 'E',
		templateUrl: 'js/inbox/inbox.html',
		scope: {threads: '='}
	};

});