app.directive('inboxthread', function($rootScope, AuthService, AUTH_EVENTS, $state) {

	return {
		restrict: 'E',
		templateUrl: 'js/inboxthread/inboxthread.html'
		// scope: {team: '='} //fucks everything up
	};

});