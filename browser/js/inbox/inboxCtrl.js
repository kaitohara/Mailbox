app.controller('inboxCtrl', function($scope, $state, threads) {

	$scope.threads = threads;

 	// WHY WON"T THIS RUN FROM THE NG_CLICK ON A THREAD?
    $scope.goToThread = function(threadId){
		console.log('going to thread', threadId)
		$state.go('home.teamId.threadId', {threadId: threadId})
	};

})
