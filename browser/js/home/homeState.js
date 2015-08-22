app.config(function($stateProvider) {
    $stateProvider
    .state('home', {
        url: '/mailbox',
        templateUrl: 'js/home/home.html',
        controller: 'homeCtrl',
        resolve: {
            teams: function(teamFactory, userFactory) {
                return userFactory.getCurrentUser()
                    .then(function(user) {
                        if (user) {
                            return teamFactory
                                .getUserTeams(user._id)
                                .then(function(teams) {
                                    return teams.data;
                                })
                        }
                    })
            },
            users: function(userFactory) {
                    return userFactory
                        .getAllUsers()
                        .then(function(users) {
                            return users.data
                        })
            }
        }
    })
    .state('home.teamId', {
        url: '/teams/:teamId',
        templateUrl: 'js/inbox/inbox.html',
        controller: 'inboxCtrl',
        resolve: {
            threads: function(teamFactory, $stateParams){
                var teamId = $stateParams.teamId;
                return teamFactory.getThisTeamsGmailThreadsId(teamId).then(function(threads){
                    return threads
                })
            }
        }
    })
    .state('home.teamId.threadId', {
        url: '/thread/:threadId',
        templateUrl: 'js/fullemail/fullemail.html',
        controller: 'fullemailCtrl',
        resolve: {
            thread: function(teamFactory, $stateParams){
                var threadId = $stateParams.threadId
                return teamFactory.getThisEmailFromTheThread(threadId).then(function(thread){ 
                    return thread 
                })
            }
        }    
    })
});




















