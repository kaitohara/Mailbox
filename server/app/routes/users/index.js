var router = require('express').Router();
module.exports = router;

var requestPromise = require('request-promise');
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

router.get('/', function(req, res){
	
	UserModel.find().exec()
	.then(function(allUsers){
		res.send(allUsers)
	})
})

router.put('/:userId', function(req, res){
	UserModel.findByIdAndUpdate(req.params.userId, {$addToSet:{teams: req.body._id}})
	.exec()
	.then(function(updatedUser){
		res.send(updatedUser)
	}, function(err){
		console.log(err)
	})
})