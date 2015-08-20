'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var TeamModel = mongoose.model('Team');

var requestPromise = require('request-promise');
var base64 = require('js-base64').Base64;

var googleConfig = require('../../../env').GOOGLE;

var sendEmail = function(team, options) {
	console.log(team)
	var latestEmailIndex = team.email.length - 1;
	var emailUrl = "me"
	// team.email[latestEmailIndex].address.replace('@', '%40')
	var aToken = team.email[latestEmailIndex].accessToken;
	options.headers = {
			'Authorization': 'Bearer ' + aToken
		}
	var urlHead = 'https://www.googleapis.com/gmail/v1/users/'
	var urlTail = '/messages/send'
	var fullUrl = urlHead + emailUrl + urlTail
	console.log(' fullurl ', fullUrl)
	return requestPromise.post(fullUrl, options)
}

router.post('/sendemail/:threadId', function(req, res, next) {
	var email = req.body.email
	var team
	var associatedEmail = email.associatedEmail
	TeamModel.findOne({'email.address': associatedEmail})
		.then(function(team) {
			console.log(team)
			var team = team
			var unencodedString = "From: <"+email.emailReply.from+"> To: <" + email.emailReply.to+ "> Subject: " + email.emailReply.subject + " Date: Fri, 21 Nov 1997 09:55:06 -0600 " + " Message-ID: <random Id> " + email.emailReply.body
			var encodedString = base64.encode(unencodedString).replace("==","")
			while ((encodedString.indexOf("+")>-1) || (encodedString.indexOf("/")>-1)){
				encodedString = encodedString.replace("+","-")
				encodedString = encodedString.replace("/","_")
			}
			console.log(encodedString)

			return sendEmail(team, {'message': {'raw': encodedString}})
		}, function(err){
			console.log(err)
		})
		.then(function(googleResponse){
			console.log(googleResponse)
			res.send(googleResponse)
		})
		.then(null, next)

})


