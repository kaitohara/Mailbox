var router = require('express').Router();
module.exports = router;

var requestPromise = require('request-promise');
var mongoose = require('mongoose');
var TeamModel = mongoose.model('Team');

var base64 = require('js-base64').Base64;

var Gmail = require('node-gmail-api');
var emailUrl, latestEmailIndex;
router.get('/getAllEmails/:id', function(req, res){
	TeamModel.findById(req.params.id)
	.then(function(team){
		latestEmailIndex = team.email.length-1;
		emailUrl = team.email[latestEmailIndex].address.replace('@', '%40')
		return requestPromise.get('https://www.googleapis.com/gmail/v1/users/'+emailUrl+'/threads?maxResults=10', {headers: {'Authorization': 'Bearer '+team.email[latestEmailIndex].refreshToken} })
	})
	.then(function(threads){
		res.send(threads)
	})
})

router.get('/:teamId/:threadId', function(req, res){
	TeamModel.findById(req.params.teamId)
	.then(function(team){
		return requestPromise.get('https://www.googleapis.com/gmail/v1/users/'+emailUrl+'/threads/'+req.params.threadId, {headers: {'Authorization': 'Bearer '+team.email[latestEmailIndex].refreshToken} })
	})
	.then(function(thread){
		thread = JSON.parse(thread)
		thread.messages.forEach(function(message){
			message.payload.parts.forEach(function(part){
				part.body.data = base64.decode(part.body.data).replace("==","").replace("==","")
				return part
			})
			return message
		})
		return thread
	})
	.then(function(thread){
		res.send(thread)
	})
})

// router.post('/:teamId/:threadId', function(req, res){
// 	TeamModel.findById(req.params.teamId)
// 	.then(function(team){
// 		return requestPromise.get('https://www.googleapis.com/gmail/v1/users/teammailfsa%40gmail.com/threads/'+req.params.threadId, {headers: {'Authorization': 'Bearer '+team.accessToken} })
// 	})
// 	// .then(function(thread){
// 	// 	thread.messages.forEach(function(message){
// 	// 		message.payload.body.data = base64.decode(message.payload.body.data)
// 	// 	})
// 	// 	return thread
// 	// })
// 	.then(function(thread){
// 		console.log('went to google api and got this thread: ', thread)
// 		res.send(thread)
// 	})
// })

//https://www.googleapis.com/gmail/v1/users//threads?maxResults=12&key={YOUR_API_KEY}