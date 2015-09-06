var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Team = mongoose.model('Team');

describe('Team model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Team).to.be.a('function');
    });

    describe('on creation', function () {

        var createTeam = function () {
            return Team.create({ name: 'Team1'});
        };

        it('should set team.name to the given name', function (done) {
            createTeam().then(function (team) {
                expect(team.name).to.be.equal('Team1');
                done();
            });
        });
    });
});
