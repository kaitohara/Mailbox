app.controller('addATeamCtrl', function($window, $scope, teamFactory) {
	
	$scope.name = 'Mailbox Team';
	$scope.email = 'teammailfsa@gmail.com';

	$scope.createTeam = function() {
		teamFactory.createTeam($scope.name, $scope.email).then(function() {
			$window.location.href = "/auth/google/team/" + $scope.email;
		})
	}
})