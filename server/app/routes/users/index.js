var router = require('express').Router();
module.exports = router;

var requestPromise = require('request-promise');
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

router.get('/', function(req, res) {
	UserModel.find().exec()
		.then(function(allUsers) {
			res.send(allUsers)
		})
})

router.get('/teamMembers/:teamId', function(req, res, next) {
	console.log('hitting backend route', req.params.teamId)
	UserModel.find({
			teams: {
				$in: [req.params.teamId]
			}
		})
		.select('firstName')
		.exec()
		.then(function(user) {
			res.json(user)
		})
})

router.get('/:userId', function(req, res, next) {
	UserModel.findById(req.params.userId)
		.populate('teams')
		.populate('myInbox')
		.then(function(user) {
			res.send(user)
		})
		.then(null, next)
})

router.put('/:userId', function(req, res) {
	UserModel.findByIdAndUpdate(req.params.userId, {
			$addToSet: {
				teams: req.body._id
			}
		})
		.exec()
		.then(function(updatedUser) {
			res.send(updatedUser)
		}, function(err) {
			console.log(err)
		})
})