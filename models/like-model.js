var mongoose = require('mongoose');

var LikeSchema = new mongoose.Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  timestamp: {
    type : Date, 
    default: Date.now,
    required: true
  }
})

module.exports = mongoose.model('Like', LikeSchema)