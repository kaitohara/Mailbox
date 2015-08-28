'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	googleObj: {
		type: Object
	},
	draft: {
		type: String
	},
});

//something like this...
schema.methods.getThread = function() {
	return this.googleObj.threadId;
}

schema.methods.getDate = function() {
	return this.googleObj.payload.headers.filter(function(obj) {
		return obj.name === 'Date';
	})[0].value
}

mongoose.model('Email', schema);