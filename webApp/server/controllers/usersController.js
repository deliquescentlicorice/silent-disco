var User = require('../models/usersModel');
var Stream = require('../models/streamsModel');

//userId (db) and object with updated fields and info, PUT request, send back updated object

module.exports = {
  modifyUser: function(req, res, next) {
    User.findOneAndUpdate({
      _id: req.params.user
    }, {$set: req.body}, {new: true},
    function(err, doc) {
      if (doc) {
        res.status(200).send(doc);
      }
      else if (err) {
        throw err;
      }
      else {
        res.status(404).send('no such user found');
      }
    }
    );
  },

  createUser: function(user, callback) {
    User.findOne({scId: user.id.toString()}, function(err, doc) {
      if (doc) {
        console.log('user already exists');
        callback(doc);
      }
      else {
                  var newUser = new User({
            scId: user.id.toString(),
            scUsername: user.username,
            scUri: user.uri,
            scPermalink: user.permalink_url,
            scAvatarUri: user.avatar_url,
            first_name: user.first_name,
            last_name: user.last_name,
            full_name: user.full_name,
            scDesc: user.description,
            website: user.website,
            websiteTitle: user.website_title,
          });
                  newUser.save(function(err, doc) {
                    if (err) {
                      throw err;
                    }
                    else {
                      callback(doc);
                    }
                  });
    }
  });
  },

  //   User.findOneAndUpdate({
  //       scId: user.id.toString()
  //     }, {
  //       $set: {
  //         scUsername: user.username,
  //         scUri: user.uri,
  //         scPermalink: user.permalink_url,
  //         scAvatarUri: user.avatar_url,
  //         first_name: user.first_name,
  //         last_name: user.last_name,
  //         full_name: user.full_name,
  //         scDesc: user.description,
  //         website: user.website,
  //         websiteTitle: user.website_title
  //       }
  //     },
  //     //returns modified user, not original
  //     {
  //       new: true
  //     },
  //     function(err, doc) {
  //       if (doc) {
  //         console.log('user already exists');
  //         callback(doc);
  //       } else {
  //         var newUser = new User({
  //           scId: user.id.toString(),
  //           scUsername: user.username,
  //           scUri: user.uri,
  //           scPermalink: user.permalink_url,
  //           scAvatarUri: user.avatar_url,
  //           first_name: user.first_name,
  //           last_name: user.last_name,
  //           full_name: user.full_name,
  //           scDesc: user.description,
  //           website: user.website,
  //           websiteTitle: user.website_title,
  //         });
  //         newUser.save(function(err, doc) {
  //           if (err) {
  //             throw err;
  //           } else {
  //             callback(doc);
  //           }
  //         });
  //       }
  //     });
  // },

  getUserSoundcloudID: function(req, res, next) {
    var userId = req.params.user;
    User.findOne({ scId: userId}, function(err, doc) {
      if (err) {
        throw err;
      } else {
        res.status(200).send(doc);
      }
    });
  },

  getUserWithStreams: function(req, res, next) {
    var userId = req.params.user;
    User.findById(userId, function(err, doc) {
      if (err) {
        throw err;
      } else {
        Stream.find({
          creator: userId
        }, function(err, docs) {
          if (err) {
            throw err;
          } else {
            res.status(200).send({user: doc, streams: docs});
          }
        });
      }
    });
  }
}