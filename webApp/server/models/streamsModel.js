var MongoClient = require('mongodb');
var mongoose = require('mongoose');

var streamSchema = new mongoose.Schema({
  name: String,
  description: String,
  heartCountNum: Number,
  listenerMaxCount: Number,
  listenerLiveCount: Number,
  playing: Boolean,
  // image: String,
  timestamp: Date,
  latitude: Number,
  longitude: Number,
  creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Stream', streamSchema);