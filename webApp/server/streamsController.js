var Stream = require('./streamsModel');
var User = require('./usersModel');

module.exports = {
  createStream: function(req, res, next) {
    var streamName = req.params.stream;
    var streamDesc = req.body.desc;
    var streamLocation = req.body.loc;
    var streamCreator = req.body.creator;

    User.findOne({name: streamCreator}, function(err, doc) {
      if (doc) {
        var creatorId = doc._id;
        var newStream = new Stream({name: streamName, 
          description: streamDesc,
          heartCountNum: 0,
          listenerMaxCount: 0,
          listenerLiveCount: 0,
          timestamp: Date.now(),
          playing: true,
          // location: streamLocation,
          creator: creatorId
        });
        newStream.save(function(err) {
          if (err) {
            throw err;
          }
          else {
            res.status(201).send('stream saved to db');
          }
        });
      }
      else {
        res.status(500).send('user not found');
      }
    });
  },

  getStream: function(req, res, next) {
    var streamName = req.params.stream;
    Stream.findOne({name: streamName}, function(err, doc) {
      if (err) {
        throw err;
      }
      else {
        console.log(doc);
        res.status(200).send(doc);
      }
    });
  },

  upHeart: function(req, res, next) {
    var streamName = req.params.stream;
    Stream.findOne({name: streamName}, function(err, stream) {
      stream.heartCountNum++;
      stream.save(function(err) {
        if (err) {
          return err;
        }
        else {
          res.status(200).send({heartCount: stream.heartCountNum});
        }
      });
    });
  },

  modifyStreamDetails: function(req, res, next) {
    var streamName = req.params.stream;
    var streamDesc = req.body.desc;
    var streamLocation = req.body.loc;
    Stream.findOneAndUpdate({name: streamName}, {description: streamDesc, location: streamLocation}, 
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
    Stream.find({}, function(err, docs) {
      if (err) {
        throw err;
      }
      else {
        res.send(docs);
      }
    });
  }

};