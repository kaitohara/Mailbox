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
                                    .then(function(user) {
                                        console.log(user.data)
                                        return user.data.teams;
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
            templateUrl: 'js/inbox/teamInbox.html',
            controller: 'inboxCtrl',
            resolve: {
                threads: function(teamFactory, $stateParams) {
                    var teamId = $stateParams.teamId;
                    return teamFactory.getThisTeamsGmailThreadsId(teamId).then(function(threads) {
                        return threads;
                    })
                }
                // teammates: function(userFactory, $stateParams){
                //     var teamId = $stateParams.teamId;
                //     return userFactory.getTeamMembers(team._id).then(function(teammates){
                //         return teammates;
                //     })
                // }
            }
        })
        .state('home.userId', {
            url: '/users/:userId',
            templateUrl: 'js/inbox/userInbox.html',
            controller: 'inboxCtrl',
            resolve: {
                threads: function(userFactory, $stateParams) {
                    var userId = $stateParams.userId;
                    return userFactory.getUser(userId).then(function(user) {
                        console.log('child state resolve - users myInbox:', user.data.myInbox)
                        return user.data.myInbox;
                    })
                }
            }
        })
        .state('home.teamId.threadId', {
            url: '/thread/:threadId',
            templateUrl: 'js/fullemail/fullemail.html',
            controller: 'fullemailCtrl',
            resolve: {
                thread: function(teamFactory, $stateParams) {
                    var threadId = $stateParams.threadId
                    return teamFactory.getThisEmailFromTheThread(threadId).then(function(thread) {
                        return thread
                    })
                }
            }
        })
        .state('home.userId.threadId', {
            url: '/thread/:threadId',
            templateUrl: 'js/fullemail/fullemail.html',
            controller: 'fullemailCtrl',
            resolve: {
                thread: function(teamFactory, $stateParams) {
                    var threadId = $stateParams.threadId
                    return teamFactory.getThisEmailFromTheThread(threadId).then(function(thread) {
                        return thread
                    })
                }
            }
        })
});