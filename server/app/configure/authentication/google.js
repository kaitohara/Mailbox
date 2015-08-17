/////ORIGINAL google.js

'use strict';

var passport = require('passport');

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
// var TeamModel = mongoose.model('Team');

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
        UserModel.findOne({
                'googleId': profile.id
            }).exec()
            .then(function(user) {
                if (user) {
                    console.log("found User", user)
                    return user;
                } else {
                    console.log("didn't find user! gonna make one for ya")
                    console.log('in verifyCallback, this is the access token: ', accessToken)
                    console.log('in verifyCallback, this is the refresh token: ', refreshToken) //undefined
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
                //done logs in the user and makes req.user
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

// why do we have this route? seems to work without it...
    // app.get('/connect/google', function(req, res){
    //     console.log('in /connect/google route req: ', req)
    //     onsole.log('in /connect/google route res: ', res)
    //     //find a team based on user input to form and add the token
    //     //res.end(JSON.stringify(req.query, null, 2))
    //     res.end()
    // })
    app.get('/connect/google', function(req, res){
        //console.log('in /connect/google route req: ', req)
        // req.query.access_token is the access token given back by grant/gmail
        //console.log('in /connect/google route res: ', res)
        //find a team based on user input to form and add the token
        res.send(JSON.stringify(req.query, null, 2))
        //res.send(req.query.access_token)
    })

// route that gets hit from the add team callback
    app.get('/callback', function(req, res){
        console.log('hit the add team callback "/callback" res.req: ', res.req)
        console.log('hit the add team callback "/callback" req: ', req)
        // res.req.query.access_token is the access token
        // add the access token to the team that was created by the post 
        // that was just made to api/teams by home.js controller
        //TeamModel.findOneAndUpdate({},{accessToken: res.req.query.access_token})
        //.then(function(){
            res.redirect('/')
        //})
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