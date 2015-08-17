var router = require('express').Router();
module.exports = router;

var requestPromise = require('request-promise');
var mongoose = require('mongoose');
var TeamModel = mongoose.model('Team');

var base64 = require('js-base64').Base64;

var Gmail = require('node-gmail-api');


// router.get('/getAllEmails', function(req, res){
// 	console.log('hitting getAllEmails route')
// 	console.log('in getAllEmails route, req.user is:', req.user.accessToken)
// 	requestPromise.get('https://www.googleapis.com/gmail/v1/users/me/threads?maxResults=10', {headers: {'Authorization': 'Bearer '+req.user.accessToken} })
// 		.then(function(threads){
// 			console.log('went to google api and requested req.users threads: ', threads)
// 			res.send(threads)
// 	})
// })

router.get('/getAllEmails/:id', function(req, res){
	TeamModel.findById(req.params.id)
	.then(function(team){
		console.log('got this team: ', team)
		var gmail = new Gmail(team.accessToken, 'teammailfsa')
		var allMessages = gmail.messages('label: inbox', {max: 2})
		var whatever = []
		allMessages.on('data', function(d){
			whatever.push({
				id: d.id,
				threadId: d.threadId,
				labelIds: d.labelIds,
				snippet: d.snippet,
				subject: base64.decode(d.payload.parts[0].body.data),
				body: base64.decode(d.payload.parts[1].body.data)
			})
		})
		allMessages.on('end', function(){
			res.send(whatever)
		})
	})
})


//https://www.googleapis.com/gmail/v1/users//threads?maxResults=12&key={YOUR_API_KEY}