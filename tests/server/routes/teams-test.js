var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

var agent = supertest.agent(app);

var Team = mongoose.model('Team');

describe('Teams Route', function() {

	beforeEach('Establish DB connection', function (done){
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done){
		clearDB(done);
	});

	//make dummy data
	var team1, team2;
	beforeEach(function (done){
		console.log('team1');
		Team.create({
			googleId: '111111111',
			name: "Test Team One"
		}, function(err, t){
			if (err) return done(err);
			team1 = t;
			done();
		});
	});
	beforeEach(function (done){
		console.log('team2');
		Team.create({
			googleId:'222222222',
			name: "Test Team Two"
		}, function(err, t){
			if (err) return done(err);
			team2 = t;
			done()
		});
	});
	it('returns all teams', function (done){
		agent.get('/api/teams')
			.expect(200)
			.end(function(err, res){
				if (err) return done(err);
				expect(res.body).to.be.instanceof(Array);
				expect(res.body.length).to.equal(2);
				expect(res.body[0].name).to.equal('Test Team One');
				done();
			})
	});
	it('returns one team', function (done){
		agent.get('/api/teams/' + team1._id)
			.expect(200)
			.end(function(err, res){
				if (err) return done(err);
				expect(res.body.name).to.equal('Test Team One');
				done();
			})
	});
	it('GET one that doesn\'t exist', function (done){
		agent.get('/api/teams/notamongoid123123')
			.expect(404)
			.end(done);
	});
	it('creates a new team', function (done){
		agent.post('/api/teams/createTeam')
			.send({
				email: 'newteam@test.com',
				name: 'New Team'
			})
			.expect(201)
			.end(function(err, res) {
				if (err) return done(err);
				expect(res.body.name).to.equal('New Team')
				done();
			});
	});
});