app.controller('inboxCtrl', function($rootScope, $scope, $state, threads, Socket, teamFactory) {

	$scope.threads = threads;

	$scope.goToThread = function(threadId) {
		$state.go('home.teamId.threadId', {
			threadId: threadId
		})
	};
	$rootScope.$on('synced', function(){
		console.log('heard it')
		$scope.refreshThreads();
	})

	$scope.refreshThreads = function(){
		console.log('log this');
		teamFactory.getThisTeamsGmailThreadsId($scope.team._id)
		.then(function(threads){
			$scope.threads = threads;
		})
	};
})