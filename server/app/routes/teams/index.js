var router = require('express').Router();
module.exports = router;
var requestPromise = require('request-promise');
var mongoose = require('mongoose');
var TeamModel = mongoose.model('Team');
var UserModel = mongoose.model('User');

router.get('/', function(req, res, next) {
	TeamModel.find({}).then(function(teams) {
			res.send(teams)
		})
		.then(null, next)
})



router.post('/createTeam', function(req, res, next) {
	TeamModel.create({
			name: req.body.name,
			email: [{
				address: req.body.email,
				accessToken: 'temp'
			}]
		})
		.then(function(team) {
			return UserModel.findOneAndUpdate({
				_id: req.user._id
			}, {
				$push: {
					teams: team._id
				}
			})
		})
		.then(function(user) {
			res.json(user)
		}).then(null, next)
		// .then(function(team) {
		// 	res.json(team);
		// })
		// .then(null, next)
})


//https://www.googleapis.com/gmail/v1/users//threads?maxResults=12&key={YOUR_API_KEY}