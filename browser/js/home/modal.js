app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, teams, users, $http) {

    $scope.teams = teams;
    $scope.users = users;
    $scope.selected = {
        team: $scope.teams[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.team);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addToSelectedTeam(user){
        $http.get('/api/teams/'+user._id)
    };

});