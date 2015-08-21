var router = require('express').Router();
module.exports = router;

var requestPromise = require('request-promise');
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

router.get('/', function(req, res) {
	UserModel.find().exec()
		.then(function(allUsers) {
			console.log('all users', allUsers)
			res.send(allUsers)
		})
})


router.get('/:userId', function(req, res, next) {
	UserModel.findById(req.params.userId)
		.populate('teams')
		// .exec()
		.then(function(user) {
			console.log(user)
			res.send(user.teams)
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