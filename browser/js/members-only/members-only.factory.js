app.factory('membersOnlyFactory', function($http) {
	return {
		createTeam: function(name, email) {
			console.log('teamfactory', name, email)
			return $http.post('/api/teams/createTeam', {
				name: name,
				email: email
			});
		}
	}
})