app.directive('fullemail', function($rootScope, AuthService, AUTH_EVENTS, $state) {

	return {
		restrict: 'E',
		templateUrl: 'js/fullemail/fullemail.html',
		controller: 'fullemailCtrl',
		scope: {
			thread: '='
		}
	};

});