var User = require('../models/usersModel');
var Stream = require('../models/streamsModel');

var copyObj = function(obj) {
  var result = {};
  for (var key in obj) {
    result[key] = obj[key];
  }
  return result;
};

module.exports = {
  createUser: function(user, callback) {
    User.findOneAndUpdate({
        scId: user.id.toString()
      }, {
        $set: {
          scUsername: user.username,
          scUri: user.uri,
          scPermalink: user.permalink_url,
          scAvatarUri: user.avatar_url,
          first_name: user.first_name,
          last_name: user.last_name,
          full_name: user.full_name,
          scDesc: user.description,
          website: user.website,
          websiteTitle: user.website_title
        }
      },
      //returns modified user, not original
      {
        new: true
      },
      function(err, doc) {
        if (doc) {
          console.log('user already exists');
          throw err;
        } else {
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
            } else {
              callback(doc);
            }
          });
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
            var bloatedUser = copyObj(doc);
            console.log('streams are: ', docs);
            bloatedUser.streams = docs;
            //user object (row) with an additional field 'streams', value of streams is docs
            res.status(200).send(bloatedUser);
          }
        });
      }
    });
  }
}