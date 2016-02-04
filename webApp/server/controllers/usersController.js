var User = require('../models/usersModel');

module.exports = {
  createUser: function(user, callback) {
    console.log('controller', user);
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
        console.log(typeof callback);
        callback(doc);
      }
    });
  },

  getUser: function(req, res, next) {
    var userId = req.params.user;
    User.findById(userId, function(err, doc) {
      if (err) {
        throw err;
      }
      else {
        res.status(200).send(doc);
      }
    });
  }
  
};