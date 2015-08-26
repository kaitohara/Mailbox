app.directive('inbox', function() {

	return {
		restrict: 'E',
		templateUrl: 'js/inbox/inbox.html'
		// controller: 'inboxCtrl',
		// scope: {
		// 	threads: '='
		// }
		// dont need controlelr here because we set controller in the state
		// dont need scope here because we set scope via resolve in fullemailCtrl
	};

});