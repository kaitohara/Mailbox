app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'homeCtrl',
        resolve: {
            teams: function(teamFactory, userFactory){
                return userFactory.getCurrentUser()
                .then(function(user){
                    return teamFactory
                    .getUserTeams(user._id)
                    .then(function(teams){
                        return teams.data;
                    })
                })
                console.log('resolving')
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