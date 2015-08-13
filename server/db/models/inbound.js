'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    emailObj: {
        type: Object
    },
    archived: {
        type: Boolean
    },
    draft: {
        type: String
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});


mongoose.model('Inbound', schema);