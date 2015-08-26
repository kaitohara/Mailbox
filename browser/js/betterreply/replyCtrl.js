app.controller('replyCtrl', function($scope, replyFactory) {

	// need to revise replyFactory so that we can send reply without needing access to parent scopes

	// currently the replyFactory requires the original .thread with all messages. it uses the associatedEmail property on the original .thread in order to send the email reply to the correct email address. this could be optimized
	$scope.sendReply = function(){
		console.log('$scope.$parent.$parent.$parent', $scope.$parent.$parent.$parent)
		// we have to dig through like 5 scopes to get to the thread ID
		var googleThreadId = $scope.$parent.$parent.$parent.message.googleObj.threadId
		// emailReply is bound to the reply form
		var emailReply = $scope.emailReply
		// hit replyFactory function
		replyFactory.sendEmail([
			googleThreadId,
			emailReply
		])
		// close reply box
		$scope.$parent.message.showReply = false
	}

	$scope.cancel = function(){
		$scope.$parent.message.showReply = false
	}
})