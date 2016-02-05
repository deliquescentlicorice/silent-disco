var request = require('supertest');
var express = require('express');
var chai = require('chai');
var expect = chai.expect;
//we have to turn the server off before testing
var app = require('../server/server.js');
var mongoose = require('mongoose');
var User = require('../server/models/usersModel');
var controller = require('../server/controllers/usersController');
var bodyParser = require('body-parser');

var dbURI = 'mongodb://localhost:27017/silentdisco';

// The `clearDB` helper function, when invoked, will clear the database
var clearDB = function(done) {
  mongoose.connection.collections['users'].remove(done);
};

describe('User Controller', function() {

  // Connect to database before any tests
  before(function(done) {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(dbURI, done)
  });

  beforeEach(function(done) {

    var dummy = {
      id: 1,
      first_name: 'John',
      last_name: 'Doe'
    };

    clearDB(function() {
      var streams = [
        ['muzak', {
          name: 'muzak',
          desc: 'what you hear in elevators',
          lat: 40,
          lng: 2,
          creator: dummy
        }],
        ['simon', {
          name: 'simon',
          desc: 'after he left Garfunkel',
          lat: 40,
          lng: 2,
          creator: dummy
        }],
        ['electronica', {
          name: 'electronica',
          desc: 'something to dance to with a pacifier in your mouth',
          lat: 40,
          lng: 2,
          creator: dummy
        }],
        ['roommatetunes', {
          name: 'roommatetunes',
          desc: 'not a roommate for long',
          lat: 40,
          lng: 2,
          creator: dummy
        }],
        ['baroqueopera', {
          name: 'baroqueopera',
          desc: 'for the kind of people who like that sort of thing',
          lat: 40,
          lng: 2,
          creator: dummy
        }]
      ];

      for (var i = 0; i < streams.length; i++) {
        request(app)
          .post('/api/stream')
          .send(streams[i][1])
          .end(function(err, res) {
            if (err) {
              throw err;
            }
          });
      }
      done();
    });
  });

  it('should have a method that given a request to a name path, finds that user and all associated streams in the database', function(done) {

    expect(controller.getUserWithStreams).to.exist;

    var dummy = {
      id: 1,
      first_name: 'John',
      last_name: 'Doe'
    };

    var muzak = {
      name: 'muzak',
      desc: 'what you hear in elevators',
      lat: 40,
      lng: 2,
      creator: dummy
    };

    controller.createUser(dummy, function(user) {
      request(app)
        .get('/api/user/' + user._id)
        .set('Accept', 'application/json')
        .expect(200)
        .expect(function(res) {
          expect(res.body.user.first_name).to.equal('John');
          expect(res.body.user.last_name).to.equal('Doe');
          expect(Array.isArray(res.body.streams)).to.be.true;
          expect(res.body.streams.length).to.be.above(0);
        })
        .end(done);
    });

  });

  it("should have a method that given a request to a name path, modifies that user's data", function(done) {

    expect(controller.modifyUser).to.exist;

    var dummy = {
      id: 1,
      first_name: 'John',
      last_name: 'Doe'
    };

    var muzak = {
      name: 'muzak',
      desc: 'what you hear in elevators',
      lat: 40,
      lng: 2,
      creator: dummy
    };

    controller.createUser(dummy, function(user) {
      request(app)
        .get('/api/user/' + user._id)
        .set('Accept', 'application/json')
        .expect(200)
        .expect(function(res) {
          expect(res.body.user.first_name).to.equal('John');
          expect(res.body.user.last_name).to.equal('Doe');
        })
        .end(function(err, res) {
          request(app)
          .put('/api/user/' + user._id)
          .set('Accept', 'application/json')
          .send({last_name: 'Smith'})
          .expect(200)
          .expect(function(res) {
            expect(res.body.first_name).to.equal('John');
            expect(res.body.last_name).to.equal('Smith');
          })
          .end(done);
        });
    });

  });

});