var requestPromise = require('request-promise');
var base64 = require('js-base64').Base64;

// var googleConfig = require('../../../env').GOOGLE;

router.get('/sendemail/:threadId', function(req, res) {
	var urlHead = 'https://www.googleapis.com/gmail/v1/users/'
	var urlTail = threadId ? ('/threads/' + threadId) : '/threads?maxResults=10'
	var fullUrl = urlHead + emailUrl + urlTail	
})