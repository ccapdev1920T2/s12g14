var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
});

LikeSchema.index({ sender: 1, recipe: 1 }, { unique: true });

var Like = mongoose.model('Like', LikeSchema);
module.exports = Like;
