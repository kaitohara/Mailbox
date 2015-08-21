app.controller('homeCtrl', function($scope, userFactory, teamFactory, threadFactory, teams, users, $rootScope) {

    $scope.teams = teams;
    $scope.users = users;

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