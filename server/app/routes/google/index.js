var router = require('express').Router();
module.exports = router;

var mongoose = require('mongoose');
var TeamModel = mongoose.model('Team');
var ThreadModel = mongoose.model('Thread');

var Gmail = require('node-gmail-api');
var emailUrl, latestEmailIndex;

var googleConfig = require('../../../env').GOOGLE;

var requestTeam;

var TokenManager = require('../tokenManager.js');

router.get('/getAllEmails/:id', function(req, res) {
	TeamModel.findById(req.params.id)
		.populate('threads')
		.exec()
		.then(function(team) {
			res.send(team.threads)
		})
})

router.get('/:teamId/:threadId', function(req, res) {
	ThreadModel.findById(req.params.threadId)
		.populate('messages')
		.exec()
		.then(function(thread) {
			thread.messages.forEach(function(message){
				TokenManager.decode(message)
			})
			// console.log('the googleObj', thread.messages[0].googleObj.payload.parts)
			res.send(thread)
		})
})

// router.get('/getAllEmails/:id', function(req, res) {
// 	TeamModel.findById(req.params.id)
// 		.then(function(team) {
// 			requestTeam = team
// 			return TokenManager.getThreads(team)
// 		})
// 		.then(function(threads) {
// 			return threads
// 		}, function(err) {
// 			return TokenManager.useNewToken(requestTeam);
// 		})
// 		.then(function(threads) {
// 			res.send(threads);
// 		})
// })

// router.get('/:teamId/:threadId', function(req, res) {
// 	TeamModel.findById(req.params.teamId)
// 		.then(function(team) {
// 			requestTeam = team
// 			return TokenManager.getThreads(team, req.params.threadId)
// 		})
// 		.then(function(thread) {
// 			thread = JSON.parse(thread)
// 			if (!Array.isArray(thread.messages)) thread.messages = [thread.messages];
// 			thread.messages.forEach(function(message) {
// 				TokenManager.decode(message)
// 				return message
// 			})
// 			return thread
// 		}, function(err) {
// 			return TokenManager.useNewToken(requestTeam, req.params.threadId);
// 		})
// 		.then(function(thread) {
// 			res.send(thread)
// 		})
// })