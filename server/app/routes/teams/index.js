var router = require('express').Router();
module.exports = router;
var requestPromise = require('request-promise');
var mongoose = require('mongoose');
var TeamModel = mongoose.model('Team');

router.get('/', function(req, res){
	console.log('in home states resolve function team gettting router /api/teams')
	TeamModel.find({}).then(function(teams){
		console.log('got these teams', teams)
		res.send(teams)
	})
})

router.post('/', function(req, res){
	console.log('hitting the addTeam router, this is req.body: ', req.body)
	TeamModel.create(req.body)
	.then(function(createdTeam){
		res.send(createdTeam)
	})
})

///////// from the addTeam button and homeCtrl
router.post('/google', function(req, res){
	console.log('in addTeam router, about to make get request to connect/google')
	console.log('here is req.body', req.body) // { a team with name & googleId }
	requestPromise.get('http://localhost:1337/connect/google', {headers: {'Authorization': 'Bearer '+ req.user.accessToken} })
	.then(function(grantObj){
		console.log('here is the grantObj: ', grantObj)
		// huge DOM - assume this is the google sign in page
		res.send(grantObj)
	})
})

router.get('/:teamId', function(req, res){
	console.log('hitting teamId route')
	console.log('in teamId route, req is:', req)
	TeamModel.findById(req.params.teamId)
	.then(function(team){
	//we want to give the user access to that teams emails
	requestPromise.get('https://www.googleapis.com/gmail/v1/users/'+team.googleId+'/messages?maxResults=10', {headers: {'Authorization': 'Bearer '+team.accessToken} })
		.then(function(threads){
			console.log('went to google api and requested teams threads: ', threads)
			res.send(threads)
		})
	})
})



//https://www.googleapis.com/gmail/v1/users//threads?maxResults=12&key={YOUR_API_KEY}