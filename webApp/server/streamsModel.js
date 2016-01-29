var mongoose = require('mongoose');

var streamSchema = mongoose.Schema({
  name: String,
  description: String,
  heartCountNum: Number,
  listenerMaxCount: Number,
  listenerLiveCount: Number,
  playing: Boolean,
  // image: String,
  timestamp: Date,
  location: [{type: Number}],
  creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Stream', streamSchema);