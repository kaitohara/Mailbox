app.controller('fullemailCtrl', function($scope, thread) {

	$scope.thread = thread;
	
	$scope.extractField = function(messageObj, fieldName) {
		return messageObj.googleObj.payload.headers.filter(function(header) {
			return header.name === fieldName;
		})[0];
	};

	$scope.parseBody = function(body){
		var regex = /On [A-z]{3}, [A-z]{3} [0-9]{1,2}, [0-9]{4} at [0-9]{1,2}:[0-9]{1,2} [A,P]M, /;
		// $scope.myHTML = body;
		if (body) return (body.split(regex))[0];
		return body;
	};

	$scope.assign = function(userChoice, thread, user) {
        $scope.assignedUser = userChoice.firstName;
        console.log('this is the thread that got passed to assign: ', thread)
        threadFactory.assignUserToThread(userChoice._id, thread._id, user._id);
    };

	// $scope.html = $sce.trustAsHtml($scope.someHtml);
})