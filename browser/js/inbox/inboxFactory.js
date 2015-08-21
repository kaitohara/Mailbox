app.factory('inboxFactory', function($http){
	return {
		syncInbox: function(teamId){
			
			console.log('definitely hitting this factory', teamId)
			return $http.get('/api/google/syncInbox/'+teamId).then(function(data){
				console.log('made it', data)
				return data;
			})
		}
	}
})