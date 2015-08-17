/////ORIGINAL google.js

'use strict';

var passport = require('passport');

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var TeamModel = mongoose.model('Team');

module.exports = function(app) {

    var googleConfig = app.getValue('env').GOOGLE;

    var googleCredentials = {
        clientID: googleConfig.clientID,
        clientSecret: googleConfig.clientSecret,
        callbackURL: googleConfig.callbackURL,
        passReqToCallback: true
    };

    var verifyCallback = function(req, accessToken, refreshToken, profile, done) {
        if (req.user) {
            console.log('profile:', profile, 'accessToken: ', accessToken, 'refreshToken: ', refreshToken)
                // adding a team
            TeamModel
                .findOne({
                    email: {
                        $elemMatch: {
                            address: profile.emails[0].value
                        }
                    }
                })
                .exec()
                .then(function(team) {
                    console.log(team)
                    if (team) {
                        console.log('inside if statement', team.email)
                        team.email.forEach(function(email) {
                            if (email.address === profile.emails[0].value) {
                                email.accessToken = accessToken
                                email.refreshToken = refreshToken || 'hjhk'
                            }
                        })
                        return team.save(function(err, team) {
                            console.log(err, team)
                            done(err, req.user)
                        })
                    } else {
                        // throwing error will send to failure redirect
                        done(new Error('team email didn\'t match'))
                    }
                })
        } else {
            //signing up
            UserModel
                .findOne({
                    googleId: profile.id
                })
                .exec()
                .then(function(user) {
                    if (user) {
                        done(null, user)
                    } else {
                        UserModel.create({
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            email: profile.emails[0].value,
                            googleId: profile.id,
                            photo: profile._json.picture,
                            accessToken: accessToken
                        }, done)
                    }
                })
        }
    };

    function middlefunc(req, res, next) {
        passport.use(new GoogleStrategy(googleCredentials, verifyCallback));
        next();
    }

    app.get('/auth/google/user', middlefunc, passport.authenticate('google', {
        scope: [
            "https://mail.google.com",
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ],
        prompt: 'select_account'
            // loginHint: 'nyusnaps@gmail.com'
    }));

    // route that gets hit from the user login callback
    app.get('/auth/google/user/callback',
        passport.authenticate('google', {
            failureRedirect: '/login'
        }),
        function(req, res) {
            res.redirect('/');
        });
};