'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    inbound: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Inbound'
    },
    outbound: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Outbound'
    }
});


mongoose.model('Conversation', schema);