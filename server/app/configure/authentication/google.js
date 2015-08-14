/////ORIGINAL google.js

'use strict';

var passport = require('passport');

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var TeamModel = mongoose.model('Team');

var Grant = require('grant-express');
var grant = new Grant(require('./config.json'));


module.exports = function(app) {

    app.use(grant)
    var googleConfig = app.getValue('env').GOOGLE;

    var googleCredentials = {
        clientID: googleConfig.clientID,
        clientSecret: googleConfig.clientSecret,
        callbackURL: googleConfig.callbackURL
    };

    var verifyCallback = function(accessToken, refreshToken, profile, done) {
        console.log('accessToken is:' + accessToken, "refreshToken is:" + refreshToken)
        UserModel.findOne({
                'googleId': profile.id
            }).exec()
            .then(function(user) {
                if (user) {
                    console.log("found User", user)
                    return user;
                } else {
                    console.log("didn't find user! gonna make one for ya")
                    console.log(accessToken, refreshToken)
                    return UserModel.create({
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        photo: profile._json.picture,
                        accessToken: accessToken
                    });
                }
            }).then(function(userToLogin) {
                console.log(userToLogin)
                done(null, userToLogin);
            }, function(err) {
                console.error('Error creating user from Google authentication', err);
                done(err);
            });
    };

    function middlefunc(req, res, next){
        passport.use(new GoogleStrategy(googleCredentials, verifyCallback));
        next();
    }

    app.get('/auth/google/user', middlefunc, passport.authenticate('google', {
        scope: [
            "https://mail.google.com",
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));

    app.get('/connect/google', function(req, res){
        console.log(req.query)
        //find a team based on user input to form and add the token
        res.end(JSON.stringify(req.query, null, 2))
    })

    app.get('/callback', function(req, res){
        console.log('hit this')
        res.redirect('/')
    })

    app.get('/auth/google/user/callback',
        passport.authenticate('google', {
            failureRedirect: '/login'
        }),
        function(req, res) {
            res.redirect('/');
        });
};