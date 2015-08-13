'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

module.exports = function(app) {

    var googleConfig = app.getValue('env').GOOGLE;

    var googleCredentials = {
        clientID: googleConfig.clientID,
        clientSecret: googleConfig.clientSecret,
        callbackURL: googleConfig.callbackURL
    };

    var verifyCallback = function(accessToken, refreshToken, profile, done) {
        console.log('verifying')
        UserModel.findOne({
                'google.id': profile.id
            }).exec()
            .then(function(user) {
                console.log('trying to log in')
                if (user) {
                    return user;
                } else {
                    console.log(profile)
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

    app.get('/auth/google/user', passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
            // 'https://mail.google.com'
        ]
    }));

    app.get('/auth/google/user/callback',
        passport.authenticate('google', {
            failureRedirect: '/login'
        }),
        function(req, res) {
            console.log('logged in')
            res.redirect('/');
        });

};