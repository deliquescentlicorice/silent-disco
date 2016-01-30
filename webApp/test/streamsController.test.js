var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var Stream = require('../server/streamsModel');
var controller = require('../server/streamsController');

var dbURI = 'mongodb://localhost/silentdisco';

// The `clearDB` helper function, when invoked, will clear the database
var clearDB = function (done) {
  mongoose.connection.collections['streams'].remove(done);
};

var app = express();

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
        {
          name: 'muzak',
          description: 'what you hear in elevators',
          heartCountNum: 0,
          listenerLiveCount: 10000,
          listenerMaxCount: 30000,
          playing: true,
          timestamp: new Date(1995, 7, 3),
          location: [40, 2],
          creator: '56abed8eb64080841ec81823'
        },
        {
          name: 'Paul Simon',
          description: 'after he left Garfunkel',
          heartCountNum: 10000,
          listenerLiveCount: 200,
          listenerMaxCount: 2000,
          playing: true,
          timestamp: new Date(1970, 1, 15),
          location: [40, 2],
          creator: '56abed8eb64080841ec81823'
        },
        {
          name: 'electronica',
          description: 'something to dance to with a pacifier in your mouth',
          heartCountNum: 100000,
          listenerLiveCount: 2000,
          listenerMaxCount: 2300,
          playing: true,
          timestamp: new Date(2003, 8, 23),
          location: [40, 2],
          creator: '56abed8eb64080841ec81823'
        },
        {
          name: 'roommate tunes',
          description: 'not a roommate for long',
          heartCountNum: 0,
          listenerLiveCount: 0,
          listenerMaxCount: 3,
          playing: true,
          timestamp: new Date(2014, 9, 3),
          location: [40, 2],
          creator: '56abed8eb64080841ec81823'
        },
        {
          name: 'baroque opera',
          description: 'for the kind of people who like that sort of thing',
          heartCountNum: 6,
          listenerLiveCount: 6,
          listenerMaxCount: 3000,
          playing: true,
          timestamp: new Date(1650, 3, 15),
          location: [40, 2],
          creator: '56abed8eb64080841ec81823'
        }
      ];

      for (var i = 0; i < streams.length; i++) {
        controller.createStream(streams[i], function(err, doc) {
          return doc;
        });
      }
      done();
    });
  });

  it('should have a method that given a request to a name path, finds that stream in the database', function (done) {

    //I added this method for testing purposes, so I could test createJob.
    //but it's useful functionality on its own
    expect(controller.getStream).to.exist;


    request(app)
      .get('localhost:3000/api/muzak')
      .expect(200, {
          name: 'muzak',
          description: 'what you hear in elevators',
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

      request(app)
        .get('localhost:3000/api/arglebargle')
        .expect(404, done);
    
  });

  it('should have a method that given a stream object, adds that record to the database', function (done) {
    expect(controller.createStream).to.exist;


    var gospel = {
          name: 'gospel',
          description: 'played twice-weekly in church',
          heartCountNum: 200,
          listenerLiveCount: 0,
          listenerMaxCount: 7000,
          playing: true,
          timestamp: new Date(1940, 6, 13),
          location: [40, 2],
          creator: '56abed8eb64080841ec81823'
        };

    request(app)
      .post('/api/gospel')
      .send(gospel)
      .expect(200, done)

      request(app)
        .get('/api/listen/gospel')
        .expect(200, gospel)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
        });
    
  // });

  it('should have a method that adds one heart to a given stream', function (done) {

    expect(controller.getHighPayingJobs).to.exist;
    controller.getHighPayingJobs(function(docs) {
      expect(docs.length).to.equal(3);
      var lucrativeJobs = [
        {
          name: 'Goldman Sachs',
          title: 'analyst',
          description: 'Excel models',
          datePosted: new Date(2008, 7, 3),
          salary: 80000
        },
        {
          name: 'BART',
          title: 'conductor',
          description: 'Bay Area commuter rail',
          datePosted: new Date(2016, 8, 5),
          salary: 60000
        },
        {
          name: 'Foreign Service',
          title: 'consular officer',
          description: 'represent America abroad',
          datePosted: new Date(2009, 4, 12),
          salary: 70000
        }
      ];
      for (var i = 0; i < 3; i++) {
        expect(docs[i].name).to.equal(lucrativeJobs[i].name);
      }
      done();
    });
  });
});
