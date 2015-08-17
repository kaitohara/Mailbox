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
        callbackURL: googleConfig.callbackURL,
        passReqToCallback: true
    };

    var verifyCallback = function(req, accessToken, refreshToken, profile, done) {
        if (req.user) {
            console.log('profile:', profile)
                // adding a team
            TeamModel
                .findOne({
                    email: profile.emails[0].value
                })
                .exec()
                .then(function(team) {
                    console.log('team:', team)
                    if (team) {
                        team.accessToken = accessToken
                        return team.save(function(err, team) {
                            console.log(team)
                            done(err, req.user)
                        })
                    } else {
                        console.log('trying to create a team')
                        TeamModel.create({
                            accessToken: accessToken
                        }, function(err, team) {
                            done(err, req.user)
                        })
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

        // look up team by profile.email
        // if you find a team, go down team branch
        // if you don't look up in users table


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
    }));

    // why do we have this route? seems to work without it...
    // app.get('/connect/google', function(req, res){
    //     console.log('in /connect/google route req.query: ', req.query)
    //     //find a team based on user input to form and add the token
    //     res.end(JSON.stringify(req.query, null, 2))
    // })

    // route that gets hit from the add team callback
    app.get('/callback', function(req, res) {
        //console.log('hit the add team callback req: ', req)
        console.log('hit the add team callback "/callback" res.req.query: ', res.req.query)
            // res.req.query.access_token is the access token
            // we probably want to create a team and give it the access token
        TeamModel.create({
                accessToken: res.req.query.access_token
            })
            .then(function(createdTeam) {
                res.redirect('/')
            })
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