var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var requestPromise = require('request-promise');

console.log('loading')
// console.log(req.user)

router.get('/getAllEmails', function(req, res){
	console.log('req.user is:', req.user.accessToken)
	requestPromise.get('https://www.googleapis.com/gmail/v1/users/me/messages', {headers: {'Authorization': 'Bearer '+req.user.accessToken}})
		.then(function(res){
			console.log(res)
			// res.status(200).send('I broke')
	})
})
