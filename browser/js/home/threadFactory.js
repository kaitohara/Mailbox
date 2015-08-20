app.factory('threadFactory', function($http) {

	return {
		assignUserToThread: function(victimId, threadId, culpritId) {

			return $http.post('http://localhost:1337/api/threads/assign', {
				assignedTo: victimId,
				assignedBy: culpritId,
				threadId: threadId
			})
		}
	};

});