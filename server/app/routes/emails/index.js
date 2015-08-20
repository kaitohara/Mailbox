'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var TeamModel = mongoose.model('Team');

var requestPromise = require('request-promise');
var base64 = require('js-base64').Base64;

var googleConfig = require('../../../env').GOOGLE;

var sendEmail = function(team, encodedString) {
	console.log(team)
	var latestEmailIndex = team.email.length - 1;
	var emailUrl = team.email[latestEmailIndex].address.replace('@', '%40')
	// update this to get correct token, not necessarily most recent
	var aToken = team.email[latestEmailIndex].accessToken;
	var options = {
		'headers':{'Authorization': 'Bearer ' + aToken},
		'message':{'raw': encodedString}
	}
	var urlHead = 'https://www.googleapis.com/gmail/v1/users/'
	var urlTail = '/messages/send'
	var fullUrl = urlHead + emailUrl + urlTail
	console.log(' fullurl ', fullUrl)
	return requestPromise.post(fullUrl, options)
}

router.post('/sendemail/:threadId', function(req, res, next) {
	var email = req.body.email
	var associatedEmail = email.associatedEmail
	TeamModel.findOne({'email.address': associatedEmail})
	.then(function(team) {
		var unencodedString = "From: <"+email.emailReply.from+"> To: <" + email.emailReply.to+ "> Subject: " + email.emailReply.subject + " Date: Fri, 21 Nov 1997 09:55:06 -0600 " + " Message-ID: <random Id> " + email.emailReply.body
		var encodedString = base64.encode(unencodedString).replace("==","")
		while ((encodedString.indexOf("+")>-1) || (encodedString.indexOf("/")>-1)){
			encodedString = encodedString.replace("+","-")
			encodedString = encodedString.replace("/","_")
		}
		console.log(' encoded string: ', encodedString)
		return sendEmail(team, encodedString)
	}, function(err){
		// mongoose error:
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