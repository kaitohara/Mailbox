app.config(function ($stateProvider) {

     $stateProvider
     .state('splashPage', {
        //THIS STATE IS NEVER ACTUALLY SEEN, PURELY FOR DETERMINING WHERE TO SEND VISITORS
        url: '/',
        templateUrl: 'js/splashPage/splashPage.html',
        resolve: {
            loggedInUser: function(userFactory, $state){
                //see if there is a logged in user
                userFactory.getCurrentUser().then(function(user){
                    //if there is a logged in user, check if he has teams
                    if(user) {
                        //if he has teams, send him to home.teamId or home.teamId.threadId
                        if(user.teams.length) $state.go('home.teamId', {teamId: user.teams[0]})
                        //if he doesn't have teams, send him to addATeam
                        else $state.go('addATeam')
                    }
                    //if there is no logged in user, send to signUp
                    else $state.go('login')
                })
            }
        }
    })
    .state('addATeam', {
        url: '/addATeam',
        templateUrl: 'js/splashPage/addATeam.html',
        controller: 'addATeamCtrl'
    })
    .state('login', {
        url: '/login',
        templateUrl: 'js/splashPage/login.html',
        controller: 'LoginCtrl'
    });
});

