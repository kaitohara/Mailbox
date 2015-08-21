app.factory('teamFactory', function($http) {

    return {
        getAllTeams: function() {
            return $http.get('/api/teams')
        },
        getUserTeams: function(userId) {
            console.log('getting User Teams', userId)
            return $http.get('/api/users/' + userId)
        },
        getThisTeamsGmailThreads: function(team) {
            return $http.get('/api/google/getAllEmails/' + team._id)
                .then(function(threads) {
                    console.log('the threads: ', threads.data)
                    return threads.data
                })
        },
        getThisEmailFromTheThread: function(threadId, activeTeamId) {
            console.log('threadId', threadId, 'activeTeamId', activeTeamId)
            return $http.get('/api/google/' + activeTeamId + '/' + threadId)
                .then(function(fullEmail) {
                    console.log('emails' , fullEmail)
                    return fullEmail.data
                })
        },
        createTeam: function(name, email) {
            console.log('teamfactory', name, email)
            return $http.post('/api/teams/createTeam', {
                name: name,
                email: email
            });
        }
    };

});