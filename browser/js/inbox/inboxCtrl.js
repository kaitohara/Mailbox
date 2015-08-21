app.controller('inboxCtrl', function($scope, teamFactory, userFactory, $state, threads) {

	$scope.threads = threads;
	// $scope.getThisEmailFromTheThread = function(threadId) {
	// 	console.log('hit the inbox ctrl')
 //        teamFactory.getThisEmailFromTheThread(threadId, $scope.activeTeam._id)
 //            .then(function(fullEmail) {
 //                $scope.thread = fullEmail;
 //            })
 //    };
 	console.log('in inboxCtrl');
    $scope.goToThread = function(){
		console.log('going to thread')
		// $state.go('home.teamId.threadId', {threadId: threadId})
	};

})