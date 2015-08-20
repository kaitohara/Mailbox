app.factory('threadFactory', function($http) {

    return {
        assignUserToThread: function(userId, threadId) {

            return $http.post('http://localhost:1337/api/threads/assign/', {
                assignedTo: userId,
                thread: threadId
            })
        }
    };

});