app.factory('teamFactory', function ($http) {

    return {
         getAllTeams: function () {
            return $http.get('http://localhost:1337/api/teams')
	  	},
	  	getThisTeamsGmailThreads: function (team) {
    		return $http.get('http://localhost:1337/api/google/getAllEmails/'+team._id)
    		.then(function(threads){
    			return threads.data
    		})
    	},
    	getThisEmailFromTheTread: function(threadId, activeTeamId){
    	return $http.get('http://localhost:1337/api/google/'+activeTeamId+'/'+threadId)
    		.then(function(fullEmail){
    			return fullEmail.data
    		})
    	},
    };

});