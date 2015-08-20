app.factory('userFactory', function($http, AuthService) {

    return {
        getAllUsers: function() {
            return $http.get('/api/users')
        },
        setUserTeam: function(user, team) {
            return $http.put('/api/users/' + user._id, team)
                .then(function(user) {
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
        }
    };
});