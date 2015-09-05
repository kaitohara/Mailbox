var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');

var expect = require('chai').expect;

var dbURI= 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

var agent = supertest.agent(app);

var User = mongoose.model('User');
var Team = mongoose.model('Team');

describe('Users Route', function() {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test databse', function (done){
		clearDB(done);
	});
	var user1, user2, team1, team2;
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
			googleId: '22222222',
			name: "Test Team Two"
		}, function(err, t){
			if (err) return done(err);
			team2 = t;
			done();
		});
	});
	beforeEach(function (done){
		console.log('user1');
		User.create({
			firstName: 'Posta',
			lastName: 'TestUser',
			email: 'testUser@posta.com',
			password: 'password',
			admin: false,
			teams: team1
		}, function(err, u){
			if (err) return done(err);
			user1 = u;
			done();
		});
	});
	beforeEach(function (done){
		console.log('user2');
		User.create({
			firstName: 'Posta',
			lastName: 'TestUser',
			email: 'testUser2@posta.com',
			password: 'password',
			admin: false,
			teams: team1
		}, function(err, u){
			if (err) return done(err);
			user2 = u;
			done();
		});
	});
	it('returns all users', function (done){
		agent.get('/api/users')
			.expect(200)
			.end(function (err, res){
				if (err) return done(err);
				expect(res.body).to.be.instanceof(Array);
				expect(res.body.length).to.equal(2);
				expect(res.body[0].email).to.equal('testUser@posta.com');
				expect(res.body[0].firstName).to.equal('Posta');
				expect(res.body[0].admin).to.equal(false);
				done();
			});
	});
	it('returns a single user', function (done){
		agent.get('/api/users/'+ user2._id)
			.expect(200)
			.end(function (err, res){
				if (err) return done(err);
				expect(res.body.email).to.equal('testUser2@posta.com')
				done();
			});
	});
	it('GET a user that doesn\'t exist', function (done){
		agent.get('/api/users/notauser')
			.expect(404)
			done();
	})
	it('returns a user\'s teammates', function (done){
		agent.get('/api/users/teamMembers/'+ team1._id)
			.expect(200)
			.end(function (err, res){
				if (err) return done(err);
				expect(res.body).to.be.instanceof(Array);
				expect(res.body.length).to.equal(2);
				expect(res.body[1]._id).to.equal(user2._id+'');
				done();
			});
	});
	it('updates a user to a team', function (done){
		agent.put('/api/users/' + user1._id)
			.expect(200)
			.send({_id: team2._id})
			.end(function(err, res){
				if (err) return done(err);
				expect(res.body.teams.length).to.equal(2);
				User.findById(user1._id).exec()
					.then(function(u){
						expect(u.teams.length).to.equal(2);
						done();
					});
			});
	});
});