var router = require('express').Router();
module.exports = router;

var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

router.get('/', function(req, res) {
	UserModel.find().exec()
		.then(function(allUsers) {
			res.send(allUsers)
		})
})

router.get('/teamMembers/:teamId', function(req, res) {
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
			if (!user) throw Error('Not Found');
			res.send(user)
		})
		.then(null, function(e){
			if (e.name === "CastError" || e.message === "Not Found") e.status = 404;
			next(e);
		})
})

router.put('/:userId', function(req, res) {
	UserModel.findByIdAndUpdate(req.params.userId, {
			$addToSet: {
				teams: req.body._id
				}
			},
			{ new: true }
		)
		.exec()
		.then(function(updatedUser) {
			res.send(updatedUser)
		}, function(err) {
			console.log(err)
		})
})