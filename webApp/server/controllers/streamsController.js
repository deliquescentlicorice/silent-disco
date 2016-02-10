var Stream = require('../models/streamsModel');
var User = require('../models/usersModel');
var usersController = require('./usersController');

module.exports = {
  createStream: function(req, res, next) {
    var streamName = req.body.name;
    var streamDesc = req.body.desc;
    //to make location into array
    var streamLongitude = req.body.lng;
    var streamLatitude = req.body.lat;
    var streamCreator = req.body.creator;

    User.findOne({
      scId: streamCreator.id
    }, function(err, user) {
      if (user) {
        console.log('creator found');
        console.log(user)
        var newStream = new Stream({
          name: streamName,
          broadcaster: user.scUsername,
          description: streamDesc,
          heartCountNum: 0,
          listenerMaxCount: 0,
          listenerTotalCount: 0,
          listenerLiveCount: 0,
          timestamp: Date.now(),
          playing: false,
          latitude: streamLatitude,
          longitude: streamLongitude,
          creator: user._id
        });
        newStream.save(function(err, stream) {
          if (err) {
            throw err;
          }
          else {
            res.status(201).send(stream);
          }
        });
      }
      else {
        usersController.createUser(streamCreator, function(user) {
          var newStream = new Stream({
            name: streamName,
            broadcaster: user.scUsername,
            description: streamDesc,
            heartCountNum: 0,
            listenerMaxCount: 0,
            listenerTotalCount: 0,
            listenerLiveCount: 0,
            timestamp: Date.now(),
            playing: false,
            latitude: streamLatitude,
            longitude: streamLongitude,
            creator: user._id
          });
          newStream.save(function(err, stream) {
            if (err) {
              throw err
            }
            else {
              res.status(201).send(stream);
            }
          });
        });
      }
    });
  },

  getStream: function(req, res, next) {
    var streamId = req.params.stream;
    Stream.findById(streamId, function(err, stream) {
      if (stream) {
        res.status(200).send(stream);
      }
      else {
        res.status(404).send('stream not found');
      }
      // if (err) {
      //   throw err;
      // }
      // else {
      //   res.status(200).send(stream);
      // }
    });
  },

  upHeart: function(req, res, next) {
    var streamId = req.params.stream;
    Stream.findById(streamId, function(err, stream) {
      stream.heartCountNum++;
      console.log('updated the heartCount');
      stream.save(function(err, doc) {
        if (err) {
          return err;
        }
        else {
          res.status(200).send(doc);
        }
      });
    });
  },

  toggleStream: function(req, res, next) {
    var streamId = req.params.stream;
    Stream.findById(streamId, function(err, stream) {
      stream.playing = !stream.playing;
      console.log('updated stream status');
      stream.save(function(err, doc) {
        if (err) {
          return err;
        }
        else {
          res.status(200).send(doc);
        }
      });
    });
  },

  streamWasStartedOrStopped: function(streamId, status, callback) {
    Stream.findById(streamId, function(err, stream) {
      stream.playing = status === "started";
      console.log('updated stream status');
      stream.save(function(err, doc) {
        if (err) {
          callback(err);
        }
        else {
          callback(doc);
        }
      });
    });
  },

  addListener: function(req, res, next) {
    var streamId = req.params.stream;
    Stream.findById(streamId, function(err, stream) {
      stream.listenerLiveCount++;
      stream.listenerTotalCount++;
      stream.listenerMaxCount = Math.max(stream.listenerMaxCount, stream.listenerLiveCount);
      stream.save(function(err, doc) {
        if (err) {
          return err;
        }
        else {
          res.status(200).send(doc);
        }
      });
    });
  },

  removeListener: function(req, res, next) {
    var streamId = req.params.stream;
    Stream.findById(streamId, function(err, stream) {
      stream.listenerLiveCount--;
      stream.save(function(err, doc) {
        if (err) {
          return err;
        }
        else {
          res.status(200).send(doc);
        }
      });
    });
  },

  modifyStreamDetails: function(req, res, next) {
    var streamId = req.params.stream;
    var streamName = req.body.name;
    var streamDesc = req.body.desc;
    var streamLocation = req.body.loc;
    Stream.findOneAndUpdate({_id: streamId}, {description: streamDesc, location: streamLocation}, 
      function(err, doc) {
        if (err) {
          throw err;
        }
        else {
          res.status(200).send(doc);
        }
      });
  },

  getAllStreams: function(req, res, next) {
    Stream.find({playing: true}, function(err, docs) {
      if (err) {
        throw err;
      }
      else {
        res.send(docs);
      }
    });
  }

};
