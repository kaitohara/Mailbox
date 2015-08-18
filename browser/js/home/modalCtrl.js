app.controller('ModalCtrl', function ($scope, $modal, $log, $http) {

  $scope.animationsEnabled = true;

  $scope.open = function () {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        team: function () {
          return $scope.team;
        },
        users: function () {
            return $scope.users;
        }
      }
    });

    modalInstance.result.then(function (selectedUser) {
      $scope.selectedUser = selectedUser;
      // $scope.setUserTeam(chosenUser, team)
      $scope.setUserTeam(selectedUser, $scope.team)

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

  $scope.setTeam = function (team) {
    $scope.team = team
  };

  $scope.setUserTeam = function (user, team) {
        console.log(' user, team combo: ', user, team)
        return $http.put('http://localhost:1337/api/users/'+user._id, team)
        .then(function(user){
            $scope.user = user.data;
            console.log($scope.user)
        })
    };

})


app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, team, users) {
  
  $scope.team = team;
  $scope.users = users;
  $scope.selectedUser
   = null;

  $scope.chooseUser = function (user) {
    $scope.selectedUser = user
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selectedUser);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});