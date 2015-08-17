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




//https://www.googleapis.com/gmail/v1/users//threads?maxResults=12&key={YOUR_API_KEY}