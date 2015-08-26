/////ORIGINAL google.js

'use strict';

var passport = require('passport');

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var TeamModel = mongoose.model('Team');

var Utils = require('../utilityFunctions');
var Promise = require('bluebird');

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
                // find a team that matches inputted email
            TeamModel.findOne({
                    email: {
                        $elemMatch: {
                            address: profile.emails[0].value
                        }
                    }
                })
                .exec()
                .then(function(team) {
                    if (team) {
                        // update tokens in correct e-mail sub-document in e-mails array
                        team.email.forEach(function(email) {
                            if (email.address === profile.emails[0].value) {
                                email.accessToken = accessToken
                                email.refreshToken = refreshToken
                            }
                        })
                        Utils.getRecentThreads(team, 10)
                            .then(function(googleThreads) {
                                googleThreads = JSON.parse(googleThreads);
                                var threads = googleThreads.threads;

                                // find most recent historyId
                                var historyId = 0;
                                threads.forEach(function(thread) {
                                    if (thread.historyId*1 > historyId) historyId = thread.historyId*1
                                })

                                team.historyId = historyId+"";

                                var promisesForAddingToTeam = threads.map(function(thread) {
                                    return Utils.getThreadContentsAndAddToTeam(team, thread);
                                })
                                console.log('promisesForAddingToTeam',promisesForAddingToTeam)
                                return Promise.all(promisesForAddingToTeam);
                            })
                            .then(function(result) {
                                console.log('callback result', result)
                                team.save(function(err, team) {
                                    console.log('error in team save: ', err, 'team in team save: ', team)
                                    done(err, req.user)
                                })
                            })
                    } else {
                        // throwing error will send to failure redirect
                        done(new Error('team email didnt match'))
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

    app.param('email', function(req, res, next, email) {
        req.teamEmail = email;
        next();
    })

    app.get('/auth/google/user', middlefunc, passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/gmail.compose'
        ],
        prompt: 'select_account'
    }));

    app.get('/auth/google/team/:email', middlefunc, function(req, res, next) {
        passport.authenticate('google', {
            scope: [
                "https://mail.google.com",
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/gmail.compose'
            ],
            loginHint: req.teamEmail,
            approvalPrompt: 'force',
            accessType: 'offline'
        })(req, res, next)
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
