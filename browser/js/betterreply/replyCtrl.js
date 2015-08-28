app.controller('replyCtrl', function($scope, replyFactory) {

	// need to revise replyFactory so that we can send reply without needing access to parent scopes
	$scope.extractField = function(messageObj, fieldName) {
		return messageObj.googleObj.payload.headers.filter(function(header) {
			return header.name.toLowerCase() === fieldName.toLowerCase();
		})[0];
	};
	console.log('4 parents', $scope.$parent.$parent.$parent.$parent)
	var message = $scope.$parent.$parent.$parent.message;

	$scope.emailReply = {};
	// $scope.emailReply.to = $scope.extractField(message, 'To').value
	// $scope.emailReply.from = $scope.extractField(message, 'From').value

	// console.log('6 parents:', $scope.$parent.$parent.$parent.$parent.$parent.$parent.threads[0].associatedEmail)
	$scope.emailReply.to = $scope.extractField(message, 'From').value.split("<").pop().split(">")[0]
	$scope.emailReply.from = $scope.$parent.$parent.$parent.$parent.$parent.$parent.threads[0].associatedEmail

	// $scope.emailReply.from = $scope.extractField(message, 'To').value.split("<").pop().split(">")[0]
	$scope.emailReply.subject = $scope.extractField(message, 'Subject').value

	// prepend Re: to subject if existing thread doesn't already have it (meaning this is the first reply to a thread)
	if ($scope.emailReply.subject.indexOf("Re:")<0) {
		$scope.emailReply.subject = "Re: " + $scope.emailReply.subject
	}

	// currently the replyFactory requires the original .thread with all messages. it uses the associatedEmail property on the original .thread in order to send the email reply to the correct email address. this could be optimized
	$scope.sendReply = function() {

		// console.log('$scope.$parent.$parent.$parent', $scope.$parent.$parent.$parent)
		// we have to dig through like 5 scopes to get to the thread ID
		var googleThreadId = $scope.$parent.$parent.$parent.message.googleObj.threadId
		console.log('googleThreadId within sendReply:', googleThreadId)
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

	$scope.cancel = function() {
		$scope.$parent.message.showReply = false
	}

})