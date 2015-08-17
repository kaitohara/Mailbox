var router = require('express').Router();
module.exports = router;

var requestPromise = require('request-promise');


router.post('/getAllEmails', function(req, res){
	console.log('hitting getAllEmails route')
	console.log('in getAllEmails route, req.user is:', req.user.accessToken)
	requestPromise.get('https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=10', {headers: {'Authorization': 'Bearer '+req.user.accessToken} })
		.then(function(threads){
			console.log('went to google api and requested req.users threads: ', threads)
			res.send(threads)
	})
})


//https://www.googleapis.com/gmail/v1/users//threads?maxResults=12&key={YOUR_API_KEY}