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
	console.log('hitting getAllEmails route in teams')
	console.log('the id: ', req.params.id)
	TeamModel.findById(req.params.id)
	.then(function(team){
		console.log('got this team: ', team)
		var gmail = new Gmail(team.accessToken, 'teammailfsa')
		var allMessages = gmail.messages('label: inbox', {max: 2})
		allMessages.on('data', function(d){
			d.payload.parts.forEach(function(email){
				console.log(base64.decode( email.body.data ))
			})
		})
		//return requestPromise.get('https://www.googleapis.com/gmail/v1/users/teammailfsa%40gmail.com/threads?maxResults=10', {headers: {'Authorization': 'Bearer '+team.accessToken} })
	})
	// .then(function(threads){
	// 	console.log('went to google api and requested teams threads: ', threads)
	// 	res.send(threads)
	// })
	.then(function(allMessages){
		res.send(allMessages)
	})
})


//https://www.googleapis.com/gmail/v1/users//threads?maxResults=12&key={YOUR_API_KEY}