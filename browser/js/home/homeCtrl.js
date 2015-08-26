app.controller('homeCtrl', function($scope, $state, teams, users, $rootScope) {

    $scope.teams = teams;
    $scope.users = users;
    // $state.go('home.teamId', {teamId: $scope.teams[0]._id})

    $scope.user = $rootScope.user;
    ///////modal stuff, leave here //////////
    $scope.status = {
        isopen: false
    };


    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.assignedUser = 'Assign';
    ///////////////////////////////////////////

});