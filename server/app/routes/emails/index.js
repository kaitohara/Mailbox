'use strict';
var router = require('express').Router();
module.exports = router;

var requestPromise = require('request-promise');
var base64 = require('js-base64').Base64;

var googleConfig = require('../../../env').GOOGLE;

router.post('/sendemail/:threadId', function(req, res, next) {
	var email = req.body.email
	console.log(email)
	var unencodedString = "From: <"+email.emailReply.from+"> To: <" + email.emailReply.to+ "> Subject: " + email.emailReply.subject + " Date: Fri, 21 Nov 1997 09:55:06 -0600 " + " Message-ID: <random Id> " + email.emailReply.body
	var encodedString = base64.encode(unencodedString).replace("==","")
	while ((encodedString.indexOf("+")>-1) || (encodedString.indexOf("/")>-1)){
		encodedString = encodedString.replace("+","-")
		encodedString = encodedString.replace("/","_")
	}
	console.log(encodedString)

	return requestPromise.post("https://www.googleapis.com/gmail/v1/users/me/messages/send",
		{raw: encodedString})
	.then(function(googleResponse) {
		console.log(googleResponse)
		res.send(googleResponse)
	}, function(err){
		console.log(err)
	})
})