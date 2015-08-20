app.controller('homeCtrl', function($scope, $log, userFactory, teamFactory, threadFactory, teams, users, $rootScope) {

    $scope.teams = teams;
    $scope.users = users;
    $scope.thread;

    $scope.user = $rootScope.user;
    $scope.showEmailDetails = false

    $scope.toggleShowEmail = function() {
        $scope.showEmailDetails = !$scope.showEmailDetails
    }

    $scope.getThisTeamsGmailThreads = function(team) {
        console.log('hit this')
        return teamFactory.getThisTeamsGmailThreads(team)
            .then(function(threads) {
                console.log('contrller threadds', threads)
                $scope.activeTeam = team;
                $scope.threads = threads;
            })
    };

    $scope.getThisEmailFromTheThread = function(threadId) {
        teamFactory.getThisEmailFromTheThread(threadId, $scope.activeTeam._id)
            .then(function(fullEmail) {
                console.log('got this thread', fullEmail)
                $scope.thread = fullEmail;
            })
    }

    $scope.extractField = function(messageObj, fieldName) {
        return messageObj.googleObj.payload.headers.filter(function(header) {
            return header.name === fieldName;
        })[0];
    };

    // dropdown
    $scope.status = {
        isopen: false
    };

    $scope.toggled = function(open) {
        $log.log('Dropdown is now: ', open);
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