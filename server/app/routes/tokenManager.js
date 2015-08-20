var requestPromise = require('request-promise');
var base64 = require('js-base64').Base64;

function TokenManager() {};

TokenManager.prototype.getThreads = function(team, threadId) {
	var latestEmailIndex = team.email.length - 1;
	var emailUrl = team.email[latestEmailIndex].address.replace('@', '%40')
	// update this to get correct token, not necessarily most recent
	var aToken = team.email[latestEmailIndex].accessToken;
	var options = {
		headers: {
			'Authorization': 'Bearer ' + aToken
		}
	}
	var urlHead = 'https://www.googleapis.com/gmail/v1/users/'
	var urlTail = threadId ? ('/threads/' + threadId) : '/threads?maxResults=10'
	var fullUrl = urlHead + emailUrl + urlTail
	return requestPromise.get(fullUrl, options)
}

TokenManager.prototype.getFreshToken = function(team) {
	var latestEmailIndex = team.email.length - 1;
	var email = team.email[latestEmailIndex];
	// update this to get correct token, not necessarily most recent
	var rToken = email.refreshToken;
	var url = 'https://www.googleapis.com/oauth2/v3/token'
	var options = {
		form: {
			grant_type: 'refresh_token',
			client_id: googleConfig.clientID,
			client_secret: googleConfig.clientSecret,
			refresh_token: rToken
		}
	}

	return requestPromise.post(url, options)
		.then(function(googleResponse) {
			var parsedResult = JSON.parse(googleResponse)
			return parsedResult.access_token
		})
		.then(function(aToken) {
			team.email[latestEmailIndex].accessToken = aToken;
			return team.save()
		})
}

TokenManager.prototype.useNewToken = function(team, threadId) {
	return this.getFreshToken(team).then(function(newTeam) {
		return threadId ? this.getThreads(newTeam, threadId) : this.getThreads(newTeam)
	})
}

TokenManager.prototype.decode = function(message) {
	message.payload.parts.forEach(function(part) {
		part.body.data = base64.decode(part.body.data).replace("==", "").replace("==", "")
		return part
	})
	return message;
}

module.exports = new TokenManager();