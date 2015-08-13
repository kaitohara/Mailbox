'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    email: {
        type: [String]
    },
    twitter: {
        type: [String]
    },
    sms: {
        type: [String]
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    }

});


mongoose.model('Handle', schema);