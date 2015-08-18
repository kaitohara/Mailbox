app.controller('ModalInstanceCtrl', function($scope, $modalInstance, team, users, teamFactory, $window) {

    $scope.team = team;
    $scope.users = users;
    // $scope.selectedUser = null;

    $scope.chooseUser = function(user) {
        $scope.selectedUser = user
    };

    $scope.ok = function() {
        $modalInstance.close($scope.selectedUser);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };


    $scope.createTeam = function() {
        teamFactory.createTeam($scope.name, $scope.email).then(function() {
            $window.location.href = "/auth/google/team/" + $scope.email;
        })
    }

});