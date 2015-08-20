'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var TeamModel = mongoose.model('Team');
//******************
var gapi = require('googleapis');
var btoa = require('btoa');
//******************
var requestPromise = require('request-promise');
var base64 = require('js-base64').Base64;

var googleConfig = require('../../../env').GOOGLE;

// function sendMessage(to, subj, body, team) {
//     //gapi.client.load('gmail', 'v1', function() {
//     var gmailClass = gapi.gmail('v1');

//     var latestEmailIndex = team.email.length - 1;
//     var emailUrl = team.email[latestEmailIndex].address.replace('@', '%40')
//     var aToken = team.email[latestEmailIndex].accessToken;

//     var base64EncodedEmail = btoa(
//         "Content-Type:  text/plain; charset=\"UTF-8\"\n" +
//         "Content-length: 5000\n" +
//         "Content-Transfer-Encoding: message/rfc2822\n" +
//         "to: " + to + "\n" +
//         "from: \"test\" <teammailfsa@gmail.com>\n" +
//         "subject: " + subj + "\n\n" +

//         "The actual message text goes here (whatever that means)"
//     ).replace(/\+/g, '-').replace(/\//g, '_');

//     var mail = base64EncodedEmail;

//     var request = gmailClass.users.messages.send({
//         // 'headers':{'Authorization': 'Bearer ' + aToken},
//         'auth': {
//             'Authorization': 'Bearer ' + aToken
//         },
//         'userId': emailUrl,
//         'resource': {
//             'raw': mail
//         }
//     });
    
//     request.execute(function(response) {
//         console.log('the responds to sendMessage: ', response);
//     });
// }       

var sendEmail = function(team, encodedString) {
	console.log(team)
	var latestEmailIndex = team.email.length - 1;
	var emailUrl = team.email[latestEmailIndex].address.replace('@', '%40')
	// update this to get correct token, not necessarily most recent
	var aToken = team.email[latestEmailIndex].accessToken;
	var headers = {
		'Authorization': 'Bearer ' + aToken,
		'Content-Type': 'application/json'
	}
	var options = {
	    method: "POST",
	    // contentType: "message/rfc822",
	    // callbackURL: 'http://localhost:1337/callback',
	    headers: headers,
	    body: JSON.stringify({"raw": encodedString})
	  };
	var urlHead = 'https://www.googleapis.com/gmail/v1/users/'
	var urlTail = '/messages/send'
	var fullUrl = urlHead + emailUrl + urlTail
	console.log(' fullurl ', fullUrl)
	options.url = fullUrl
	return requestPromise(fullUrl, options)
}

router.post('/sendemail/:threadId', function(req, res, next) {
	var email = req.body.email;
	var associatedEmail = email.associatedEmail;
	TeamModel.findOne({'email.address': associatedEmail})
	.then(function(team) {
		var otherUnencodedString = ""+
		"Content-Type: text/plain; charset=\"UTF-8\"\n" +
        "MIME-Version: 1.0\n" +
        "Content-Transfer-Encoding: 7bit\n" +
        "to: " + email.emailReply.to+"\n" +
        "from: " + email.emailReply.from+"\n" +
        "Reply-To: " + email.emailReply.from+"\n" +
        "subject: " + email.emailReply.subject + "\n\n" +
        email.emailReply.body
        console.log(' unencodedString ', otherUnencodedString)
        var otherEncodedString = base64.encode(otherUnencodedString).replace(/\+/g, '-').replace(/\//g, '_')
		return sendEmail(team, otherEncodedString)
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







