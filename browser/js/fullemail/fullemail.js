app.directive('fullemail', function($rootScope, AuthService, AUTH_EVENTS, $state) {

	return {
		restrict: 'E',
		templateUrl: 'js/fullemail/fullemail.html'
		// controller: 'fullemailCtrl',
		// scope: {
		// 	thread: '='
		// }
		// dont need controlelr here because we set controller in the state
		// dont need scope here because we set scope via resolve in fullemailCtrl
	};

});