var supertest = require('supertest');
var api = supertest('http://localhost:3000');
var express = require('express');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var Stream = require('../server/streamsModel');
var User = require('../server/usersModel');
var controller = require('../server/streamsController');

var dbURI = 'mongodb://localhost/silentdisco';

// The `clearDB` helper function, when invoked, will clear the database
var clearDB = function (done) {
  mongoose.connection.collections['streams'].remove(done);
};

// var app = express();

describe('Stream Controller', function () {

  // Connect to database before any tests
  before(function (done) {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(dbURI, done);
  });

  beforeEach(function (done) {
    clearDB(function () {
      var streams = [
      ['muzak', {
        description: 'what you hear in elevators',
        location: [40, 2],
        creator: 'John Doe'
      }],
      ['simon', {
        description: 'after he left Garfunkel',
        location: [40, 2],
        creator: 'John Doe'
      }],
      ['electronica', {
        description: 'something to dance to with a pacifier in your mouth',
        location: [40, 2],
        creator: 'John Doe'
      }],
      ['roommatetunes', {
        description: 'not a roommate for long',
        location: [40, 2],
        creator: 'John Doe'
      }],
      ['baroqueopera', {
        description: 'for the kind of people who like that sort of thing',
        location: [40, 2],
        creator: 'John Doe'
      }]
      ];

      for (var i = 0; i < streams.length; i++) {
        api.post('/api/' + streams[i][0])
        .set('Accept', 'application/json')
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

it('should have a method that given a request to a name path, finds that stream in the database', function (done) {

    //I added this method for testing purposes, so I could test createJob.
    //but it's useful functionality on its own
    // expect(controller.getStream).to.exist;

    // var muzak = {
    //   description: 'what you hear in elevators',
    //   location: [40, 2],
    //   creator: 'John Doe'
    // };

    // api.post('/api/muzak')
    // .send(muzak)
    // .end(function(err, res) {
    //   expect(res.status).to.equal(200);
    // });

    api
    .get('/api/listen/muzak')
    .set('Accept', 'application/json')
    .expect(function(res) {
      console.log(res.text);
    })
    .expect(200, done);
    // .end(function(err, res) {
    //   console.log(Object.keys(res));
    //   console.log(res.headers);
    //   expect(res.status).to.equal(200);
      // expect(res.body.name).to.equal('muzak');
      // expect(res.body.description).to.equal('what you hear in elevators');
      // expect(res.body.location).to.deep.equal([40, 2]);
      // expect(res.body.heartCountNum).to.equal(0);
      // expect(res.body.listenerLiveCount).to.equal(0);
      // expect(res.body.listenerMaxCount).to.equal(0);
      // expect(res.body.creator).to.equal('56abed8eb64080841ec81823');
      // expect(res.body.playing).to.equal(true);
      // done();


    // api.get('/api/listen/arglebargle')
    // .set('Accept', 'application/json')
    // .end(function(err, res) {
    //   expect(res.status).to.equal(404);
    // }, done);
    
  });

it('should have a method that given a stream object, adds that record to the database', function (done) {
  expect(controller.createStream).to.exist;


  // var gospel = {
  //   description: 'played twice-weekly in church',
  //   location: [40, 2],
  //   creator: 'John Doe'
  // };

  // request(app)
  // .post('/api/gospel')
  // .send(gospel)
  // .expect(200);

  request(app)
  .get('/api/listen/muzak')
  .expect(200, done);

});

  // });

it('should have a method that adds one heart to a given stream', function (done) {

  expect(controller.upHeart).to.exist;

  request(app)
  .put('/api/listen/muzak')
  //this is actually *not* what I expect: I expect ids and foreign keys on these objects
  .expect(200, streams)
  .end(function(err, res) {
    if (err) {
      throw err;
    }
  });

  request(app)
  .get('/api/listen/muzak')
  .expect(200, {
    name: 'muzak',
    description: 'what you hear in elevators',
    heartCountNum: 1,
    listenerLiveCount: 10000,
    listenerMaxCount: 30000,
    playing: true,
    timestamp: new Date(1995, 7, 3),
    location: [40, 2],
    creator: '56abed8eb64080841ec81823'
  })
  .end(function(err, res) {
    if (err) {
      throw err;
    }
  });
});

it('should have a method that modifies the details of a given stream', function (done) {

  expect(controller.modifyStreamDetails).to.exist;

  request(app)
  .put('/api/broadcast/muzak')
  .send({desc: 'best music ever'})
  .expect(200, done)

  request(app)
  .get('/api/listen/muzak')
  .expect(200, {
    name: 'muzak',
    description: 'best music ever',
    heartCountNum: 0,
    listenerLiveCount: 10000,
    listenerMaxCount: 30000,
    playing: true,
    timestamp: new Date(1995, 7, 3),
    location: [40, 2],
    creator: '56abed8eb64080841ec81823'
  })
  .end(function(err, res) {
    if (err) {
      throw err;
    }
  });

});

it('should have a method that responds to a GET request with all streams in the database', function (done) {

  expect(controller.getAllStreams).to.exist;

  request(app)
  .get('/api/streams')
  .expect(200, done)
  .end(function(err, res) {
    if (err) {
      throw err;
    }
  });

});

});
