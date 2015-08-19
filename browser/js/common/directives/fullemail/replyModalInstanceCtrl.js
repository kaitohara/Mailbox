app.controller('replyModalInstanceCtrl', function($scope, $modalInstance, email, $window) {

    $scope.email = email;
    // $scope.selectedUser = null;

    $scope.sendReply = function() {
        $modalInstance.close($scope.emailReply);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };


    // $scope.createTeam = function() {
    //     teamFactory.createTeam($scope.name, $scope.email).then(function() {
    //         $window.location.href = "/auth/google/team/" + $scope.email;
    //     })
    // }

});