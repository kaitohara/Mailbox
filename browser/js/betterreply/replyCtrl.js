app.controller('replyCtrl', function($scope, replyFactory) {

	// need to revise replyFactory so that we can send reply without needing access to parent scopes

	// currently the replyFactory requires the original .thread with all messages. it uses the associatedEmail property on the original .thread in order to send the email reply to the correct email address. this could be optimized
	$scope.sendReply = function() {
		console.log('scope parent', $scope.$parent)
		console.log('google thread id', $scope.$parent.$parent.thread.googleThreadId)
		$scope.$parent.$parent.thread.emailReply = $scope.emailReply
		console.log('parent scope emailyreply', $scope.$parent.$parent.thread.emailReply, $scope.emailReply)
		replyFactory.sendEmail($scope.$parent.$parent.thread)
		$scope.$parent.message.showReply = false
	}

	$scope.cancel = function() {
		$scope.$parent.message.showReply = false
	}
})