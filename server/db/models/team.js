'use strict';
var mongoose = require('mongoose');

var addressSchema = new mongoose.Schema({
    address: String,
    accessToken: String,
    refreshToken: String
})

var schema = new mongoose.Schema({
    googleId: {
        type: String
    },
    name: {
        type: String
    },
    threads: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Thread'
    },
    email: [addressSchema]
});



mongoose.model('Team', schema);