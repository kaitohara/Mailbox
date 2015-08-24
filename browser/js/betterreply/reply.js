app.directive('replydir', function() {

	return {
		restrict: 'AE',
		templateUrl: 'js/betterreply/replyTemplate.html',
		transclude: true,
		// replace: 'true',
		controller: 'replyCtrl',
		scope: {
			message: "="
		}

	}
})