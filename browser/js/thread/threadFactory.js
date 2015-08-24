app.factory('threadFactory', function($http) {

	return {
		assignUserToThread: function(victimId, threadId, culpritId) {
			return $http.post('/api/threads/assign', {
				assignedTo: victimId,
				assignedBy: culpritId,
				threadId: threadId
			})
		}
	};

});