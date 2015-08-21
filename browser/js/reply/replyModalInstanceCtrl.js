app.controller('replyModalInstanceCtrl', function($scope, $modalInstance, email, $window) {

    $scope.email = email;
    // $scope.selectedUser = null;
    $scope.emailReply = {};
    console.log('email', email)
    $scope.emailReply.to = email.latestMessage.from
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