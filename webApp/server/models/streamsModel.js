var MongoClient = require('mongodb');
var mongoose = require('mongoose');

var streamSchema = new mongoose.Schema({
  name: String,
  broadcaster: String,
  description: String,
  heartCountNum: Number,
  listenerMaxCount: Number,
  listenerTotalCount: Number,
  listenerLiveCount: Number,
  playing: Boolean,
  broadcasterImage: String,
  streamImage: String,
  timestamp: Date,
  latitude: Number,
  longitude: Number,
  creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Stream', streamSchema);