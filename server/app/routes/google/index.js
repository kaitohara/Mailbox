var router = require('express').Router();
module.exports = router;

var mongoose = require('mongoose');
var TeamModel = mongoose.model('Team');
var ThreadModel = mongoose.model('Thread');

// var requestPromise = require('request-promise');
// var base64 = require('js-base64').Base64;

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
			console.log('the googleObj', thread.messages[0].googleObj.payload.parts)
			res.send(thread)
		})
})