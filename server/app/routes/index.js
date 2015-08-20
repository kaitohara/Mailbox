'use strict';
var router = require('express').Router();
module.exports = router;

// router.use('/members', require('./members'));
router.use('/google', require('./google'));
router.use('/teams', require('./teams'));
router.use('/users', require('./users'));
router.use('/threads', require('./threads'));

// Make sure this is after all of
// the registered routes!

router.get('/:userId', function(req, res, next) {
	UserModel.findOne({
			_id: req.params.userId
		})
		.populate('teams')
		.then(function(user) {
			res.send(user)
		})
		.then(null, next)
})


router.use(function(req, res) {
	res.status(404).end();
});