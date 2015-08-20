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

// var sendEmail = function(team, encodedString) {
// 	var latestEmailIndex = team.email.length - 1;
// 	var emailUrl = team.email[latestEmailIndex].address.replace('@', '%40')
// 	// update this to get correct token, not necessarily most recent
// 	var aToken = team.email[latestEmailIndex].accessToken;
// 	var options = {
// 		headers:{'Authorization': 'Bearer ' + aToken},
// 		resource:{'raw': encodedString + ""} 
// 	}
// 	var urlHead = 'https://www.googleapis.com/gmail/v1/users/'
// 	var urlTail = '/messages/send'
// 	var fullUrl = urlHead + emailUrl + urlTail
// 	console.log('here is the full url', fullUrl)
// 	console.log('here is the options', options)
// 	return requestPromise.post(fullUrl, options)
// }

function sendMessage(to, subj, body, team) {
    //gapi.client.load('gmail', 'v1', function() {
    var gmailClass = gapi.gmail('v1');

    var latestEmailIndex = team.email.length - 1;
    var emailUrl = team.email[latestEmailIndex].address.replace('@', '%40')
    var aToken = team.email[latestEmailIndex].accessToken;

    var base64EncodedEmail = btoa(
        "Content-Type:  text/plain; charset=\"UTF-8\"\n" +
        "Content-length: 5000\n" +
        "Content-Transfer-Encoding: message/rfc2822\n" +
        "to: " + to + "\n" +
        "from: \"test\" <teammailfsa@gmail.com>\n" +
        "subject: " + subj + "\n\n" +

        "The actual message text goes here (whatever that means)"
    ).replace(/\+/g, '-').replace(/\//g, '_');

    var mail = base64EncodedEmail;

    var request = gmailClass.users.messages.send({
        // 'headers':{'Authorization': 'Bearer ' + aToken},
        'auth': {
            'Authorization': 'Bearer ' + aToken
        },
        'userId': emailUrl,
        'resource': {
            'raw': mail
        }
    });
    
    request.execute(function(response) {
        console.log('the responds to sendMessage: ', response);
    });

    // });        
}

router.post('/sendemail/:threadId', function(req, res, next) {
	var email = req.body.email;
	var associatedEmail = email.associatedEmail;
	TeamModel.findOne({'email.address': associatedEmail})
	.then(function(team) {
		var unencodedString = "From: <"+email.emailReply.from+"> To: <" + email.emailReply.to+ "> Subject: " + email.emailReply.subject + " Date: Fri, 14 Aug 2015 09:55:06 -0600 " + " Message-ID: <random Id> " + email.emailReply.body
		var encodedString = base64.encode(unencodedString).replace("==","")
														.replace(/[\+]/g,"-")
														.replace(/[\/]/g,"_");
		// return sendEmail(team, 'abc')
		return sendMessage(email.emailReply.to, email.emailReply.subject, email.emailReply.body, team)

	}, function(err){ console.log('mongoose err:', err) })
	.then(function(googleResponse){ console.log('googleResponse: ', googleResponse)
		res.send(googleResponse) }
		, function(err){ console.log('google err:', err) })
	.then(null, next)
})