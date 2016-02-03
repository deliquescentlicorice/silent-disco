var MongoClient = require('mongodb');
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  scId: String,
  scUsername: String,
  scUri: String,
  scPermalink: String,
  scAvatarUri: String,
  first_name: String,
  last_name: String,
  full_name: String,
  scDesc: String,
  website: String,
  websiteTitle: String,
});

module.exports = mongoose.model('User', userSchema);