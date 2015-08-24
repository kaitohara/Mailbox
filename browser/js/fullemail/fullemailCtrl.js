app.controller('fullemailCtrl', function($scope, thread, threadFactory, $location, $anchorScroll) {

	// $scope.thread = thread;

	$scope.gotoBottom = function() {
		$scope.thread = thread;
		// // set the location.hash to the id of the element
		// $location.hash('bottom');
		// // call $anchorScroll()
		// $anchorScroll();

		setTimeout(function(){
    	$location.hash('bottom');
      	$anchorScroll();
  	} , 10);

    };

    $scope.gotoBottom()

   //  setTimeout(function(){
   //  	$location.hash('bottom');
   //    	$anchorScroll();
  	// } , 500);

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
		$scope.thread.messages[index].showReply = !$scope.thread.messages[index].showReply
	}

	$scope.oneAtATime = false;

	$scope.status = {
    	isFirstOpen: true,
    	isFirstDisabled: false
	};
})

 