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

// https://accounts.google.com/AccountChooser?

// continue=https%3A%2F%2Faccounts.google.com%2Fo%2Foauth2%2Fauth%3Fprompt%3Dselect_account%26response_type%3Dcode%26redirect_uri%3Dhttp%3A%2F%2Flocalhost%3A1337%2Fauth%2Fgoogle%2Fuser%2Fcallback%26scope%3Dhttps%3A%2F%2Fmail.google.com%2Bhttps%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%2Bhttps%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%26client_id%3D757503849883-uh8tpifbmutaea3g1rq7bihgeret5oi4.apps.googleusercontent.com%26hl%3Den%26from_login%3D1%26as%3D4527529633a5b918&btmpl=authsub&hl=en

// https://accounts.google.com/AddSession?sacu=1&btmpl=authsub&

// continue=https%3A%2F%2Faccounts.google.com%2Fo%2Foauth2%2Fauth%3Fprompt%3Dselect_account%26response_type%3Dcode%26redirect_uri%3Dhttp%3A%2F%2Flocalhost%3A1337%2Fauth%2Fgoogle%2Fuser%2Fcallback%26scope%3Dhttps%3A%2F%2Fmail.google.com%2Bhttps%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%2Bhttps%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%26client_id%3D757503849883-uh8tpifbmutaea3g1rq7bihgeret5oi4.apps.googleusercontent.com%26hl%3Den%26from_login%3D1%26as%3D4527529633a5b918&hl=en#identifier