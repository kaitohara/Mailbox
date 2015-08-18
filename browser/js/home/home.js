app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'homeCtrl',
        resolve: {
            teams: function(teamFactory){
                return teamFactory
                    .getAllTeams()
                    .then(function(teams){
                        return teams.data;
                })
            },
            users: function(userFactory){
                return userFactory
                    .getAllUsers()
                    .then(function(users){
                        return users.data
                    })

            }
        }
    });
});