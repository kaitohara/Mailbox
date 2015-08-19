var router = require('express').Router();
module.exports = router;

var requestPromise = require('request-promise');
var mongoose = require('mongoose');
var TeamModel = mongoose.model('Team');

var base64 = require('js-base64').Base64;

var Gmail = require('node-gmail-api');
var emailUrl, latestEmailIndex;

var googleConfig = require('../../../env').GOOGLE;

var requestTeam;

var TokenManager = require('../tokenManager.js');

router.get('/getAllEmails/:id', function(req, res) {
	TeamModel.findById(req.params.id)
		.then(function(team) {
			requestTeam = team
			return TokenManager.getThreads(team)
		})
		.then(function(threads) {
			return threads
		}, function(err) {
			return TokenManager.useNewToken(requestTeam);
		})
		.then(function(threads) {
			res.send(threads);
		})
})

router.get('/:teamId/:threadId', function(req, res) {
	TeamModel.findById(req.params.teamId)
		.then(function(team) {
			requestTeam = team
			return TokenManager.getThreads(team, req.params.threadId)
		})
		.then(function(thread) {
			thread = JSON.parse(thread)
			if (!Array.isArray(thread.messages)) thread.messages = [thread.messages];
			thread.messages.forEach(function(message) {
				message.payload.parts.forEach(function(part) {
					part.body.data = base64.decode(part.body.data).replace("==", "").replace("==", "")
					return part
				})
				return message
			})
			return thread
		}, function(err) {
			return TokenManager.useNewToken(requestTeam, req.params.threadId);
		})
		.then(function(thread) {
			res.send(thread)
		})
})