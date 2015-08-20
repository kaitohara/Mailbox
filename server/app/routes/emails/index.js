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

router.post('/watch/', function(req, res, next) {
	var email = req.body.email
	TeamModel.findOne({'email.address': email.associatedEmail})
	.then(function(team) {
		return replyManager.sendWatch(
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