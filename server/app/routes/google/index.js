var router = require('express').Router();
module.exports = router;

var mongoose = require('mongoose');
var TeamModel = mongoose.model('Team');
var ThreadModel = mongoose.model('Thread');

var Gmail = require('node-gmail-api');
var emailUrl, latestEmailIndex;

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
