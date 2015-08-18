app.controller('membersOnlyController', function($window, $scope, membersOnlyFactory) {
	$scope.name = 'faux team';
	$scope.email = 'nyusnaps@gmail.com';

	$scope.createTeam = function() {
		membersOnlyFactory.createTeam($scope.name, $scope.email).then(function() {
			$window.location.href = "/auth/google/team";
		})
	}
})