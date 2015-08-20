var router = require('express').Router();
module.exports = router;

var mongoose = require('mongoose');
var ThreadModel = mongoose.model('Thread');
var UserModel = mongoose.model('User');

router.post('/assign/', function(req, res) {
	var foundThread;

	ThreadModel.findById(req.body.threadId)
		.then(function(thread) {
			foundThread = thread;
		})
		.then(function() {
			UserModel.findById(req.body.assignedTo)
				.then(function(user) {
					foundThread.assignedTo = user;

					UserModel.findById(req.body.assignedBy)
						.then(function(user) {
							foundThread.assignedBy = user;
							foundThread.save();
							console.log(foundThread)
						})
				})
		})
		.then(function() {
			res.sendStatus(200);
		})
})