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