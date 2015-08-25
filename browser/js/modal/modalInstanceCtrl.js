app.controller('ModalInstanceCtrl', function($scope, $modalInstance, team, users, user, teamFactory, $window) {

    $scope.team = team;
    $scope.users = users;
    $scope.user = user;
    teamFactory.getUserTeams(user._id)
        .then(function(user){
            $scope.teams = user.data.teams
            console.log($scope.teams)
        }, function(err){
            console.log(err)
        })
    // $scope.selectedUser = null;

    $scope.chooseUser = function(user) {
        $scope.selectedUser = user
    };

    $scope.ok = function() {
        $modalInstance.close($scope.selectedUser);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };


    $scope.createTeam = function() {
        teamFactory.createTeam($scope.name, $scope.email).then(function() {
            $window.location.href = "/auth/google/team/" + $scope.email;
        })
    }

    $scope.showTeamMembers = true

    $scope.openMyProfile = function(){
        $scope.showMyProfile = true
        $scope.showTeamMembers = false
        $scope.showTeamForm = false
    } 

    $scope.openTeamMembers = function(){
        $scope.showMyProfile = false
        $scope.showTeamMembers = true
        $scope.showTeamForm = false
    } 

    $scope.openTeamForm = function(){
        $scope.showMyProfile = false
        $scope.showTeamMembers = false
        $scope.showTeamForm = true
    }


});