'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {
        type: String
    },
    threads: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Thread'
    },
    emailAddresses: {
        type: [String]
    }
});


mongoose.model('Team', schema);