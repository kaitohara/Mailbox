app.controller('addATeamCtrl', function($window, $scope, teamFactory, $state) {

	// $scope.name = 'Mailbox Team';
	// $scope.email = 'teammailfsa@gmail.com';
	$scope.name;
	$scope.email;

	$scope.createTeam = function() {
		teamFactory.createTeam($scope.name, $scope.email).then(function() {
			$window.location.href = "/auth/google/team/" + $scope.email;
		})
	}

	$scope.skip = function(){
		console.log('user', $scope.user)
		$state.go('home.userId', {userId: $scope.user._id})
	}
})