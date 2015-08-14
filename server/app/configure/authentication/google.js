/////ORIGINAL google.js

'use strict';

var passportUser = require('passport');
var passportTeam = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var TeamModel = mongoose.model('Team');


module.exports = function(app) {

    var googleConfigUser = app.getValue('env').GOOGLEUSER;
    var googleConfigTeam = app.getValue('env').GOOGLETEAM;

    var googleCredentialsUser = {
        clientID: googleConfigUser.clientID,
        clientSecret: googleConfigUser.clientSecret,
        callbackURL: googleConfigUser.callbackURL
    };

    var googleCredentialsTeam = {
        clientID: googleConfigUser.clientID,
        clientSecret: googleConfigUser.clientSecret,
        callbackURL: googleConfigUser.callbackURL
    };

    var verifyCallbackUser = function(accessToken, refreshToken, profile, done) {
        console.log(profile)
        UserModel.findOne({
                'googleId': profile.id
            }).exec()
            .then(function(user) {
                if (user) {
                    console.log("found User", user)
                    return user;
                } else {
                    console.log("didn't find user!")
                    return UserModel.create({
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        photo: profile._json.picture
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

    var verifyCallbackTeam = function(accessToken, refreshToken, profile, done) {
        console.log('profile:', profile)
        TeamModel.findOne({
                'googleId': profile.id
            }).exec()
            .then(function(team) {
                if (team) {
                    return team;
                } else {
                    // console.log(profile)
                    return TeamModel.create({
                        googleId: profile.id,
                    });
                }
            }).then(function(createdTeam) {
                // console.log(createdTeam)
                // request.get('https://www.googleapis.com/gmail/v1/users/'+profile.id+'/messages?maxResults=10&key='+APIKEY, function(error, response, body){
                //     console.log(body)
                // })
                done(null, createdTeam);
            }, function(err) {
                console.error('Error creating team from Google authentication', err);
                done(err);
            });

    };

    function middlefunc(req, res, next){
        passportUser.use(new GoogleStrategy(googleCredentialsUser, verifyCallbackUser));
        next();
    }

    function middlefunc2(req, res, next){
        passportTeam.use(new GoogleStrategy(googleCredentialsTeam, verifyCallbackTeam));
        next();
    }




    app.get('/auth/google/user', middlefunc, passportUser.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));

    app.get('/auth/google/team', middlefunc2, passportTeam.authenticate('google', {
        scope: [
            // 'https://mail.google.com',
            'https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/userinfo.profile'
        ]
    }));

    app.get('/auth/google/user/callback',
        passportUser.authenticate('google', {
            failureRedirect: '/login'
        }),
        function(req, res) {
            res.redirect('/');
        });

    app.get('/auth/google/team/callback',
        passportTeam.authenticate('google', {
            failureRedirect: '/login'
        }),
        function(req, res) {
            res.redirect('/');
        });
};