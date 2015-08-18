app.controller('ModalCtrl', function($scope, $modal, $log, userFactory) {

    $scope.animationsEnabled = true;

    $scope.open = function() {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'js/home/settingsModal.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                team: function() {
                    return $scope.team;
                },
                users: function() {
                    return $scope.users;
                }
            }
        });

        modalInstance.result.then(function(selectedUser) {
            $scope.selectedUser = selectedUser;
            $scope.setUserTeam(selectedUser, $scope.team)
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggleAnimation = function() {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };
    $scope.setTeam = function(team) {
        $scope.team = team
    };
    $scope.setUserTeam = function(user, team) {
        return userFactory.setUserTeam(user, team)
            .then(function(user) {
                $scope.user = user;
            })
    };
})
