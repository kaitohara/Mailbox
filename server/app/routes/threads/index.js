var router = require('express').Router();
module.exports = router;

var mongoose = require('mongoose');
var ThreadModel = mongoose.model('Thread');
var UserModel = mongoose.model('User');
// var ObjectId = require('mongoose').Types.ObjectId;

router.post('/assign', function(req, res) {
	var foundThread;

	ThreadModel.findById(req.body.threadId)
		.then(function(thread) {
			foundThread = thread;
			if (foundThread.assignedTo){
				return UserModel.findOneAndUpdate({
					_id: foundThread.assignedTo
				},{
					$pull: {myInbox: foundThread._id}
				},{
					'new': true
				})
				.exec()
			}
		})
		.then(function() {
			return UserModel.findOneAndUpdate({
				_id: req.body.assignedTo
			}, {
				$addToSet: {myInbox: foundThread._id}
			})
		})
		.then(function(user){
			foundThread.assignedTo = user;
			return UserModel.findById(req.body.assignedBy)
		})
		.then(function(user) {
			foundThread.assignedBy = user;
			return foundThread.save();
		})
		.then(function(thread) {
			res.send(thread);
		})
		.catch(function(err) {
			console.log(err);
			res.send(400);
		})
})