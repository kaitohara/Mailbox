app.factory('teamFactory', function($http) {

    return {
        getAllTeams: function() {
            return $http.get('/api/teams')
        },
        getUserTeams: function(userId) {
            return $http.get('/api/users/' + userId)
        },
        getThisTeamsGmailThreadsId: function(teamId) {
            return $http.get('/api/google/getAllEmails/' + teamId)
                .then(function(threads) {
                    function sortThreadsByDate(a,b) {
                        if (a.latestMessage.date*1 < b.latestMessage.date*1)
                            return 1;
                        if (a.latestMessage.date*1 > b.latestMessage.date*1)
                            return -1;
                        return 0;
                    }
                    threads.data.sort(sortThreadsByDate)
                    return threads.data
                })
        },
        getThisEmailFromTheThread: function(threadId) {
            return $http.get('/api/google/' + threadId)
                .then(function(fullThread) {
                    return fullThread.data
                })
        },
        createTeam: function(name, email) {
            return $http.post('/api/teams/createTeam', {
                name: name,
                email: email
            });
        },
        getOneTeam: function(teamId) {
            return $http.get('/api/teams/' + teamId)
        }
    };

});