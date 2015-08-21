app.factory('inboxFactory', function($http){
	return {
		syncInbox : function(){
			return $http.get('/api/google/syncInbox').then(function(data){
				console.log('made it', data)
				return data;
			})
		}
	}
})