'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var TeamModel = mongoose.model('Team');

module.exports = function(app) {

    var googleConfig = app.getValue('env').GOOGLETEAM;

    var googleCredentials = {
        clientID: googleConfig.clientID,
        clientSecret: googleConfig.clientSecret,
        callbackURL: googleConfig.callbackURL
    };

    var verifyCallback = function(accessToken, refreshToken, profile, done) {
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
                done(null, createdTeam);
            }, function(err) {
                console.error('Error creating team from Google authentication', err);
                done(err);
            });

    };

    passport.use(new GoogleStrategy(googleCredentials, verifyCallback));

    app.get('/auth/google/team', passport.authenticate('google', {
        scope: [
            // 'https://mail.google.com',
            'https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/userinfo.profile'
        ]
    }));

    app.get('/auth/google/team/callback',
        passport.authenticate('google', {
            failureRedirect: '/login'
        }),
        function(req, res) {
            res.redirect('/');
        });
};