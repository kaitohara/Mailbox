var router = require('express').Router();
module.exports = router;

var mongoose = require('mongoose');
var TeamModel = mongoose.model('Team');
var ThreadModel = mongoose.model('Thread');

var Gmail = require('node-gmail-api');
var emailUrl, latestEmailIndex;
var Utils = require('../../configure/utilityFunctions')

var googleConfig = require('../../../env').GOOGLE;

var requestTeam;

router.get('/getAllEmails/:id', function(req, res) {
	TeamModel.findById(req.params.id)
		.populate('threads')
		.exec()
		.then(function(team) {
			res.send(team.threads)
		})
})

router.get('/syncInbox/:teamId', function(req, res) {
	TeamModel.findById(req.params.teamId)
		.then(function(team) {
			// console.log('found this team in database', team)
			Utils.syncInbox(team)
			.then(function(googleResp) {
				console.log('RETRIEVED NEW EMAILS', googleResp)
				res.sendStatus(200)
			})
		})
})

// PUT EVERYTHING ABOVE THIS WEIRD ROUTE
router.get('/:teamId/:threadId', function(req, res) {
	console.log(req.params.teamId, req.params.threadId)
	ThreadModel.findById(req.params.threadId)
		.populate('messages')
		.exec()
		.then(function(thread) {
				console.log(thread)
			thread.messages.forEach(function(message){
				Utils.decode(message)
			})
			// console.log('the googleObj', thread.messages[0].googleObj.payload.parts)
			res.send(thread)
		})
})

