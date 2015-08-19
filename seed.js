/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var chance = require('chance')(123);
var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Team = Promise.promisifyAll(mongoose.model('Team'));
var Email = Promise.promisifyAll(mongoose.model('Email'));
var Thread = Promise.promisifyAll(mongoose.model('Thread'));

var wipeDB = function() {

    var models = [User, Team, Email, Thread];
    var promiseArr = [];
    models.forEach(function(model) {
        promiseArr.push(model.find({}).remove().exec());
    });

    return Promise.all(promiseArr);

};

var seedUsers = function() {

    var users = [{
        email: 'testing@fsa.com',
        password: 'password'
    }, {
        email: 'obama@gmail.com',
        password: 'potus'
    }, {
        email: 'mailbox@gmail.com',
        password: 'mailbox'
    }];

    return User.createAsync(users);

};

var seedTeams = function() {

    var teams = [{
        name: 'Fullstack'
    }, {
        name: 'Flatiron'
    }, {
        name: 'East Village'
    }];

    return Team.createAsync(teams);

};

connectToDb
    .then(function() {
        console.log(chalk.blue('Wiping database...!'));
        wipeDB();
    })
    .then(function() {
        console.log(chalk.blue('Seeding users......!'));
        return seedUsers();
    })
    .then(function() {
        console.log(chalk.blue('Seeding teams.........!'));
        return seedTeams();
    })
    .then(function() {
        console.log(chalk.green('SEED SUCCESSFUL! CONGRATS!!!!!!'));
        process.kill(0);
    })
    .catch(function(err) {
        console.error(err);
        process.kill(1);
    });