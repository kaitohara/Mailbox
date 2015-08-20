app.controller('replyModalCtrl', function($scope, $modal, $log, replyFactory, $http) {

    $scope.animationsEnabled = true;

    $scope.openReply = function() {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'js/common/directives/fullemail/replyModalTemplate.html',
            controller: 'replyModalInstanceCtrl',
            resolve: {
                email: function() {
                    return $scope.thread;
                }
            }
        });

        modalInstance.result.then(function(emailReply) {
            $scope.thread.emailReply = emailReply;
            replyFactory.sendEmail($scope.thread)
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        })
    };

    $scope.toggleAnimation = function() {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };
})
