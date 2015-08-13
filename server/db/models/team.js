'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {
        type: String
    },
    messages: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Conversation'
    }
});


mongoose.model('Team', schema);