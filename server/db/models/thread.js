'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    messages: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Email'
    },
    associatedEmail: {
        type: String
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    googleThreadId: {
        type: String
    },
    archived: {
        type: Boolean
    }
});


mongoose.model('Thread', schema);