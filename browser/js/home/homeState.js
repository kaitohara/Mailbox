app.config(function($stateProvider) {
    $stateProvider
    .state('home', {
        url: '/',
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
        url: 'teams/:teamId',
        template: '<inbox threads="threads"></inbox><ui-view></ui-view>',
        controller: 'inboxCtrl',
        resolve: {
            threads: function(teamFactory, $stateParams){
                var teamId = $stateParams.teamId;
                return teamFactory.getThisTeamsGmailThreadsId(teamId).then(function(threads){
                    return threads
                })
            }
            /* firstThread: function(teamFactory, $stateParams){
                var teamId = $stateParams.teamId;
                return teamFactory.getThisTeamsGmailThreadsId(teamId).then(function(threads){
                    return threads[0]
                })
            } */
        }
    })
    .state('home.teamId.threadId', {
        url: 'thread/:threadId',
        templateUrl: '<fullemail thread="thread"></fullemail>',
        controller: function($scope,thread){$scope.thread = thread},
        resolve: {
            thread: function(teamFactory, $stateParams){
                return teamFactory.getThisEmailFromTheThread($stateParams.threadId)
                .then(function(thread){ return thread })
            }
        }    
    })
});