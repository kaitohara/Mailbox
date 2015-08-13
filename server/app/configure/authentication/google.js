'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

module.exports = function(app) {

    var googleConfig = app.getValue('env').GOOGLE;

    var googleCredentials = {
        // clientID: googleConfig.clientID,
        // clientSecret: googleConfig.clientSecret,
        // callbackURL: googleConfig.callbackURL
        clientID: '757503849883-uh8tpifbmutaea3g1rq7bihgeret5oi4.apps.googleusercontent.com',
        clientSecret: "pCNyJ4igM-5-lSbMYzJYJ7lx",
        callbackURL: "http://localhost:1337/auth/google/callback"
    };

    var verifyCallback = function(accessToken, refreshToken, profile, done) {

        UserModel.findOne({
                'google.id': profile.id
            }).exec()
            .then(function(user) {
                console.log('logging in')
                if (user) {
                    return user;
                } else {
                    return UserModel.create({
                        google: {
                            id: profile.id
                        }
                    });
                }

            }).then(function(userToLogin) {
                done(null, userToLogin);
            }, function(err) {
                console.error('Error creating user from Google authentication', err);
                done(err);
            });

    };

    passport.use(new GoogleStrategy(googleCredentials, verifyCallback));

    app.get('/auth/google', passport.authenticate('google', {
        scope: [
            // 'https://www.googleapis.com/auth/userinfo.profile',
            // 'https://www.googleapis.com/auth/userinfo.email',
            'https://mail.google.com'
        ]
    }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/login'
        }),
        function(req, res) {
            console.log('logged in')
            res.redirect('/');
        });

};