var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Thread = mongoose.model('Thread');

describe('Thread model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Thread).to.be.a('function');
    });

        describe('on creation', function () {

            var createThread = function () {
                return Thread.create({ associatedEmail: 'team@gmail.com'});
            };

            it('should set Thread.name to the given name', function (done) {
                createThread().then(function (Thread) {
                    expect(Thread.associatedEmail).to.be.equal('team@gmail.com');
                    done();
                });
            });
        });

    });

});