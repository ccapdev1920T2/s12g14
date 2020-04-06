var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type : Date, 
    default: Date.now,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  }
})

module.exports = mongoose.model('Comment', CommentSchema)
