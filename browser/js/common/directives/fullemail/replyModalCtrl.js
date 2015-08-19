app.controller('ModalCtrl', function($scope, $modal, $log, userFactory) {

    $scope.animationsEnabled = true;

    $scope.openReply = function() {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'js/common/directives/fullemail/replyModalTemplate.html',
            controller: 'replyModalInstanceCtrl',
            resolve: {
                email: function() {
                    return $scope.email;
                }
            }
        });

        modalInstance.result.then(function(emailReply) {
            $scope.emailReply = emailReply;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggleAnimation = function() {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };
})
