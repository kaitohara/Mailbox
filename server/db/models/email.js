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
schema.methods.getThread = function(){
    return this.googleObj.threadId;
}


mongoose.model('Email', schema);