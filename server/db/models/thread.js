'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Email'
    }],
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
    },
    snippet: {
        type: String
    },
    historyId: {
        type: Number
    },
    latestMessage: {
        date: String,
        from: String,
        subject: String
    }
});

function decode(message) {
    message.payload.parts.forEach(function(part) {
        part.body.data = base64.decode(part.body.data).replace("==", "").replace("==", "")
        return part
    })
    return message;
}

schema.methods.decrypt = function() {
    this.messages = this.messages.forEach(function(message) {
        decode(message);
    })
    console.log('messages', this.messages)
}

mongoose.model('Thread', schema);