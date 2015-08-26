app.factory('userFactory', function($http, AuthService) {

    return {
        getAllUsers: function() {
            return $http.get('/api/users')
        },
        setUserTeam: function(user, team) {
            console.log(
                'backend receiving:', user,
                'backend receiving team:', team
                )
            return $http.put('/api/users/' + user._id, team)
                .then(function(user) {
                    console.log('backend returning:', user.data)
                    return user.data
                })
        },
        getCurrentUser: function() {
            return AuthService.getLoggedInUser().then(function(user) {
                return user;
            })
        },
        getUser: function(userId) {
            return $http.get('/api/users/' + userId)
        },
        getTeamMembers: function(teamId) {
            return $http.get('/api/users/teamMembers/' + teamId)
                .then(function(teammates) {
                    return teammates.data
                })
        }
    }
})