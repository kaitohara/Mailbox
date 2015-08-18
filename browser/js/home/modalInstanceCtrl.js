app.controller('ModalInstanceCtrl', function($scope, $modalInstance, team, users) {

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
});