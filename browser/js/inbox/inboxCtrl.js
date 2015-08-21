app.controller('inboxCtrl', function($scope, $state, threads) {

	$scope.threads = threads;

 	// WHY WON"T THIS RUN FROM THE NG_CLICK ON A THREAD?
    $scope.goToThread = function(threadId){
		console.log('going to thread', threadId)
		$state.go('home.teamId.threadId', {threadId: threadId})
	};

})


//SOLUTION - ADD ANOTHER CONTROLLER AND ng-controller on the each thread


// app.controller('threadCtrl', function($scope, $state, thread, teamId) {

// 	$scope.thread = thread;
// 	$scope.teamId = teamId;

//  	console.log('in threadCtrl');
//  	$scope.goToThread = function(threadId){
// 		console.log('going to thread')
// 		$state.go('home.teamId.threadId', {threadId: threadId, teamId: $scope.teamId})
// 	};

// })