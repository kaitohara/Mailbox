app.controller('homeCtrl', function($scope, $log, userFactory, teamFactory, threadFactory, teams, users) {

    $scope.teams = teams;
    $scope.users = users;
    $scope.email;

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
                console.log('got this email', fullEmail)
                $scope.email = fullEmail;
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

    $scope.assign = function(user, thread) {
        $scope.assignedUser = user.firstName;
        threadFactory.assignUserToThread(user._id, thread._id);
    }

});