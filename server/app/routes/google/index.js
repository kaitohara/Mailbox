var router = require('express').Router();
module.exports = router;

var requestPromise = require('request-promise');
var mongoose = require('mongoose');
var TeamModel = mongoose.model('Team');

var base64 = require('js-base64').Base64;

var Gmail = require('node-gmail-api');
var emailUrl, latestEmailIndex;

var googleConfig = require('../../../env').GOOGLE;

var requestTeam

var getThreads = function(team, threadId){
	var latestEmailIndex = team.email.length-1;
	var emailUrl = team.email[latestEmailIndex].address.replace('@', '%40')
	var aToken = team.email[latestEmailIndex].accessToken;
	var options = { headers: { 'Authorization': 'Bearer ' + aToken} }
	var urlHead = 'https://www.googleapis.com/gmail/v1/users/'
	var urlTail = threadId ? ('/threads/' + threadId) : '/threads?maxResults=10'
	var fullUrl = urlHead + emailUrl + urlTail
	return requestPromise.get(fullUrl, options)
}

var getFreshToken = function(team){
	var latestEmailIndex = team.email.length-1;
	var email = team.email[latestEmailIndex];
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
		.then(function(googleResponse){
			var parsedResult = JSON.parse(googleResponse)
			return parsedResult.access_token
		})
		.then(function(aToken){
			team.email[latestEmailIndex].accessToken = aToken;
			return team.save()
		})
}

var useNewToken = function(team, threadId) {
	return getFreshToken(team).then(function(newTeam) {
		return threadId ? getThreads(newTeam, threadId) : getThreads(newTeam)
	})
}

router.get('/getAllEmails/:id', function(req, res){
	TeamModel.findById(req.params.id)
	.then(function(team){
		requestTeam = team
		return getThreads(team)
	})
	.then(function(threads){
		return threads
	}, function(err){
		return useNewToken(requestTeam);
	})
	.then(function(threads) {
		res.send(threads);
	})
})

router.get('/:teamId/:threadId', function(req, res){
	TeamModel.findById(req.params.teamId)
	.then(function(team){
		requestTeam = team
		return getThreads(team, req.params.threadId)
	})
	.then(function(thread){
		thread = JSON.parse(thread)
		if (!Array.isArray(thread.messages)) thread.messages = [thread.messages];
		thread.messages.forEach(function(message){
			message.payload.parts.forEach(function(part){
				part.body.data = base64.decode(part.body.data).replace("==","").replace("==","")
				return part
			})
			return message
		})
		return thread
	}, function(err){
		return useNewToken(requestTeam, req.params.threadId);
	})
	.then(function(thread){
		res.send(thread)
	})
})