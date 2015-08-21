app.controller('inboxCtrl', function($scope, $state, threads) {

	$scope.threads = threads;

    $scope.goToThread = function(threadId){
		console.log('going to thread', threadId)
		$state.go('home.teamId.threadId', {threadId: threadId})
	};

})
