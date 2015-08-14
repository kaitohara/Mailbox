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
                    console.log('this is the access token: ', accessToken)
                    console.log('this is the refresh token: ', refreshToken)
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
                console.log('now this user is created and will be logged in: ', userToLogin)
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

// why do we have this route?
    app.get('/connect/google', function(req, res){
        console.log('in /connect/google route req.query: ', req.query)
        //find a team based on user input to form and add the token
        res.end(JSON.stringify(req.query, null, 2))
    })

// route that gets hit from the add team callback
    app.get('/callback', function(req, res){
        console.log('hit the add team callback req: ', req)
        console.log('hit the add team callback res: ', res)
        res.redirect('/')
    })

// route that gets hit from the user login callback
    app.get('/auth/google/user/callback',
        passport.authenticate('google', {
            failureRedirect: '/login'
        }),
        function(req, res) {
            res.redirect('/');
        });
};