app.factory('userFactory', function ($http) {

    return {
        getAllUsers: function () {
            return $http.get('http://localhost:1337/api/users')
        },
        setUserTeam: function (user, team) {
            return $http.put('http://localhost:1337/api/users/'+user._id, team)
            .then(function(user){
                return user.data
            })
        },
    };

});
