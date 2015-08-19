/////ORIGINAL google.js

'use strict';

var passport = require('passport');

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var TeamModel = mongoose.model('Team');
var EmailModel = mongoose.model('Email');
var ThreadModel = mongoose.model('Thread');

var requestPromise = require('request-promise');
var base64 = require('js-base64').Base64;

var latestEmailIndex, emailUrl;

var TokenManager = require('../../routes/tokenManager');

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

                        TokenManager.getThreads(team)
                        .then(function(threads) {
                            threads = JSON.parse(threads)
                            // console.log('threads: ', threads)
                            threads.threads.forEach(function(thread) {
                                //Fetch each thread from GMail API using thread IDs
                                TokenManager.getThreads(team, thread.id)
                                .then(function(thread) {
                                    // console.log('thread: ', thread)
                                    thread = JSON.parse(thread);
                                    //Save individual thread to DB
                                    console.log('is snippet in here??', thread)
                                    var newThread = new ThreadModel({
                                            associatedEmail: team.email[team.email.length - 1].address,
                                            googleThreadId: thread.id,
                                            snippet: thread.messages[0].snippet,
                                            historyId: thread.historyId
                                        })
                                    newThread.save()
                                    .then(function(createdThread) {
                                        TeamModel.findOneAndUpdate({_id: team._id}, {
                                            $addToSet: { threads: createdThread }
                                        })
                                        .exec()
                                        .then(function() {
                                            thread.messages.forEach(function(message) {
                                                //WE DON'T ACTUALLY DECODE HERE
                                                saveDecodedEmail(message)
                                            .then(function(newEmail) {
                                                //store email refs in Thread messages array
                                                ThreadModel.findOneAndUpdate({ googleThreadId: thread.id }, {
                                                    $push: {
                                                        messages: newEmail
                                                    }
                                                }).exec()
                                            })
                                            }) // END OF forEach message
                                        })
                                    })
                                })
                            }) // END OF forEach thread.threads
                        })
                        .then(function() {
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
            'https://www.googleapis.com/auth/userinfo.email'
        ],
        prompt: 'select_account'
    }));

    app.get('/auth/google/team/:email', middlefunc, function(req, res, next) {
        passport.authenticate('google', {
            scope: [
                "https://mail.google.com",
                'https://www.googleapis.com/auth/userinfo.email'
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

function saveDecodedEmail(message) {
    // NOT DECODING BEFORE BACKEND FOR NOW
    // message = TokenManager.decode(message)
    //Save each message as 'email' to our DB
    var newEmail = new EmailModel({
        googleObj: message
    })
    return newEmail.save()
}