app.controller('fullemailCtrl', function($scope, thread, threadFactory) {

	$scope.thread = thread;

	$scope.extractField = function(messageObj, fieldName) {
		return messageObj.googleObj.payload.headers.filter(function(header) {
			return header.name === fieldName;
		})[0];
	};


	$scope.parseBody = function(body) {
		var regex = /On [A-z]{3}, [A-z]{3} [0-9]{1,2}, [0-9]{4} at [0-9]{1,2}:[0-9]{1,2} [A,P]M, /;
		// $scope.myHTML = body; 
		if (body) return (body.split(regex))[0];
		return body;
	};

	$scope.assign = function(userChoice, thread, user) {
		$scope.assignedUser = userChoice.firstName;
		threadFactory.assignUserToThread(userChoice._id, thread._id, user._id);
	};

	$scope.showReply = function(index){
		console.log(index)
		var length = $scope.thread.messages.length 
		// below we need to reverse the math on the index due to the sorting happening in ng-repeat
		if ($scope.thread.messages[length-1-index].showReply) {
			$scope.thread.messages[length-1-index].showReply = false
		} else {
			$scope.thread.messages[length-1-index].showReply = true
		}
	}

	// $scope.thread.messages[$scope.thread.messages.length-1] has a attribute of is-open: true

	$scope.oneAtATime = false;

	$scope.status = {
    	isFirstOpen: true,
    	isFirstDisabled: false
	};
})
 