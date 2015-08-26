app.factory('inboxFactory', function($http){
	return {
		syncInbox: function(teamId){
			return $http.get('/api/google/syncInbox/'+teamId)
			.then(function(data){
				console.log('made it', data)
				return data;
			})
		}
	}
})