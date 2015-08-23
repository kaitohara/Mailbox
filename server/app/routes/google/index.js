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
	var globalTeam;
	TeamModel.findById(req.params.teamId)
		.then(function(team) {
			// console.log('found this team in database', team)
			globalTeam = team;
			return Utils.syncInbox(globalTeam)
		})
		.then(function(googleResp) {
			googleResp = JSON.parse(googleResp)
			// console.log('googleResp', googleResp)
			Utils.saveSync(googleResp, globalTeam)
			globalTeam.historyId = googleResp.historyId;
			return globalTeam.save()
		})
		.then(function(thing){
			// console.log('THE THING: ', thing)
			res.sendStatus(200)
		})
})

// PUT EVERYTHING ABOVE THIS WEIRD ROUTE
router.get('/:threadId', function(req, res) {
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

