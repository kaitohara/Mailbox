app.controller('ModalInstanceCtrl', function($scope, $modalInstance, team, users, user, teamFactory, userFactory, $window, $rootScope) {

    $scope.team = team;
    $scope.selectedTeam = team;

    $scope.users = users;
    $scope.user = user;
    console.log(user)
    teamFactory.getUserTeams(user._id)
        .then(function(user) {
            $scope.teams = user.data.teams
            console.log($scope.teams)
        }, function(err) {
            console.log(err)
        })
        // $scope.selectedUser = null;

    // close with newUser passed to the parent scope
    $scope.ok = function() {
        $modalInstance.close($scope.selectedUser);
    };

    // dismiss modal (X and cancel buttons)
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };


    $scope.showTeamMembers = true

    // three functions that control html shown in the modal
    $scope.openMyProfile = function() {
        $scope.showMyProfile = true
        $scope.showTeamMembers = false
        $scope.showTeamForm = false
    }

    $scope.openTeamMembers = function() {
        $scope.showMyProfile = false
        $scope.showTeamMembers = true
        $scope.showTeamForm = false
    }

    $scope.openTeamForm = function() {
        $scope.showMyProfile = false
        $scope.showTeamMembers = false
        $scope.showTeamForm = true
    }

    // showing team and available users

    $scope.chooseTeam = function(team) {
        $scope.selectedTeam = team
            // fetch users on this team
        $scope.availableUsers = []
        $scope.users.forEach(function(user) {
            if (user.teams.indexOf($scope.selectedTeam._id) < 0) {
                $scope.availableUsers.push(user)
            }
        })
        console.log('scope.availableUsers for team selection:', $scope.availableUsers)
    }

    $scope.chooseUser = function(user) {
        $scope.selectedUser = user
    };

    $scope.addUserToTeam = function() {
        userFactory.setUserTeam($scope.selectedUser, $scope.selectedTeam)
            .then(function(updatedUser) {
                $scope.users.forEach(function(user) {
                    if (user.firstName == updatedUser.firstName) {
                        user.teams = updatedUser.teams
                    }
                })
                $scope.chooseTeam($scope.selectedTeam)
                $scope.selectedUser = null
                console.log('adding a team member from the modal')
                $rootScope.$emit('addedTeamMember')
            }, function(err) {
                console.log(err)
            })
    }


    // creating a new team with newTeam binding
    $scope.createTeam = function() {
        teamFactory.createTeam($scope.newTeam.name, $scope.newTeam.email).then(function() {
            $window.location.href = "/auth/google/team/" + $scope.newTeam.email;
        })
    }
    
    // $scope.chooseTeam($scope.selectedTeam)
});