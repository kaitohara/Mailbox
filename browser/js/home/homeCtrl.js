app.controller('homeCtrl', function($scope, userFactory, teamFactory, threadFactory, teams, users, $rootScope) {

    $scope.teams = teams;
    $scope.users = users;
    $scope.thread;

    $scope.user = $rootScope.user;

    $scope.status = {
        isopen: false
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.assignedUser = 'Assign';

    $scope.assign = function(userChoice, thread, user) {
        $scope.assignedUser = userChoice.firstName;
        console.log('this is the thread that got passed to assign: ', thread)
        threadFactory.assignUserToThread(userChoice._id, thread._id, user._id);
    }

});