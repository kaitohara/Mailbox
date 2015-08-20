'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var TeamModel = mongoose.model('Team');

var replyManager = require('../replyManager.js');

router.post('/sendemail/:threadId', function(req, res, next) {
	var email = req.body.email
	TeamModel.findOne({'email.address': email.associatedEmail})
	.then(function(team) {
		return replyManager.sendEmail(
			team, replyManager.encodeEmail(email)
			)
	}, function(err){
		console.log('mongoose err:', err)
	})
	.then(function(googleResponse){
		console.log('googleResponse', googleResponse)
		res.send(googleResponse)
	}, function(err){
		console.log('google err:', err)
	})
	.then(null, next)
})

