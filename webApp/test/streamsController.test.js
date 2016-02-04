var request = require('supertest');
var express = require('express');
var chai = require('chai');
var expect = chai.expect;
//we have to turn the server off before testing
var app = require('../server/server.js');
var mongoose = require('mongoose');
var Stream = require('../server/models/streamsModel');
var User = require('../server/models/usersModel');
var controller = require('../server/controllers/streamsController');
var usersController = require('../server/controllers/usersController');
var bodyParser = require('body-parser');

var dbURI = 'mongodb://localhost:27017/silentdisco';

// The `clearDB` helper function, when invoked, will clear the database
var clearDB = function (done) {
  mongoose.connection.collections['streams', 'users'].remove(done);
};

describe('Stream Controller', function() {

  // Connect to database before any tests
  before(function(done) {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(dbURI, done)
  });

  beforeEach(function(done) {

    //let me think through this: I need a user in the database, or at least a user entry to post to the database
    //but I search on a couple fields, so I can post a 'dummy' user who has only an id field, for example
    //then search for that

    var dummy = {
      id: 1
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

  it('should have a method that given a request to a name path, finds that stream in the database', function(done) {

    expect(controller.getStream).to.exist;

    var dummy = {
      id: 1
    };

    var muzak = {
      name: 'muzak',
      desc: 'what you hear in elevators',
      lat: 40,
      lng: 2,
      creator: dummy
    };

    request(app)
      .post('/api/stream')
      .send(muzak)
      .end(function(err, res) {
        expect(res.status).to.equal(201);
        request(app)
          .get('/api/stream/' + res.body._id)
          .set('Accept', 'application/json')
          .expect(function(res) {})
          .expect(200)
          .expect(function(res) {
            expect(res.body.name).to.equal('muzak');
            expect(res.body.description).to.equal('what you hear in elevators');
            expect(res.body.latitude).to.equal(40);
            expect(res.body.longitude).to.equal(2);

            expect(res.body.heartCountNum).to.equal(0);
            expect(res.body.listenerLiveCount).to.equal(0);
            expect(res.body.listenerMaxCount).to.equal(0);
            expect(res.body.playing).to.equal(true);
          })
          .end(done);
      });

    //add functionality to check that I'm getting the right creator



    // request(app)
    //   .get('/api/listen/arglebargle')
    //   .set('Accept', 'application/json')
    //   .expect(404, done);

  });

  it('should have a method that given a stream object, adds that record to the database', function(done) {
    expect(controller.createStream).to.exist;

    var dummy = {
      id: 1
    };

    var gospel = {
      name: 'gospel',
      desc: 'played twice-weekly in church',
      lat: 40,
      lng: 2,
      creator: dummy
    };

    request(app)
      .post('/api/stream')
      .send(gospel)
      .end(function(err, res) {
        expect(res.status).to.equal(201);
        request(app)
          .get('/api/stream/' + res.body._id)
          .set('Accept', 'application/json')
          .expect(200)
          .expect(function(res) {
            expect(res.body.name).to.equal('gospel');
          })
          .end(done);
      });



  });

  // });

  it('should have a method that adds one heart to a given stream', function(done) {

    expect(controller.upHeart).to.exist;

    var dummy = {
      id: 1
    };

    var muzak = {
      name: 'muzak',
      desc: 'what you hear in elevators',
      lat: 40,
      lng: 2,
      creator: dummy
    };

    request(app)
      .post('/api/stream')
      .send(muzak)
      .end(function(err, res) {
        request(app)
          //so now that I've changed the route, I need to change the path -> has to go to an id
          .put('/api/stream/' + res.body._id)
          .expect(200)
          .end(function(err, res) {
            if (err) {
              throw err;
            } else {
              request(app)
                .get('/api/stream/' + res.body._id)
                .expect(200)
                .expect(function(res) {
                  expect(res.body.heartCountNum).to.be.above(0)
                })
                .end(done);
            }
          });
      });



  });

  it('should have a method that modifies the details of a given stream', function(done) {

    expect(controller.modifyStreamDetails).to.exist;

    var dummy = {
      id: 1
    };

    var muzak = {
      desc: 'what you hear in elevators',
      lat: 40,
      lng: 2,
      creator: dummy
    };

    request(app)
      .post('/api/stream')
      .send(muzak)
      .end(function(err, res) {
        request(app)
          .put('/api/broadcast/muzak')
          .send({
            desc: 'best music ever'
          })
          .expect(200)
          .end(function(err, res) {
            request(app)
              .get('/api/stream/' + res.body._id)
              .expect(200)
              .expect(function(res) {
                expect(res.body.description).to.equal('best music ever');
              })
              .end(done);
          });
      });

  });

  it('should have a method that responds to a GET request with all streams in the database', function(done) {

    expect(controller.getAllStreams).to.exist;

    request(app)
      .get('/api/streams')
      .set('Accept', 'application/json')
      .expect(200)
      .end(done);

  });

});
