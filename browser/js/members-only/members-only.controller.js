app.controller('membersOnlyController', function($window, $scope, membersOnlyFactory) {
	$scope.name = 'Mailbox Team';
	$scope.email = 'teammailfsa@gmail.com';

	$scope.createTeam = function() {
		membersOnlyFactory.createTeam($scope.name, $scope.email).then(function() {
			$window.location.href = "/auth/google/team/" + $scope.email;
		})
	}
})