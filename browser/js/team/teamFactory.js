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
                    return threads.data
                })
        },
        getThisEmailFromTheThread: function(threadId) {
            return $http.get('/api/google/'+ threadId)
                .then(function(fullEmail) {
                    return fullEmail.data
                })
        },
        createTeam: function(name, email) {
            return $http.post('/api/teams/createTeam', {
                name: name,
                email: email
            });
        }
    };

});