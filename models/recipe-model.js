var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = require('./comment-model');
var Like = require('./like-model');

var RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  picture_link: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: false
  },
  servings: {
    type: Number,
    required: true
  },
  ingredients: {
    type: [String],
    required: true,
  },
  steps: {
    type: [String],
    required: true,
  },
  keywords: {
    type: [String],
    required: false
  },
  time_upload: {
    type: Date,
    default: Date.now,
    required: true
  }
})

// RecipeSchema.pre('remove', function(next) {
//   Comment.deleteMany({recipe: this._id}).exec();
//   Like.deleteMany({recipe: this._id}).exec();
//   next();
// });

module.exports = mongoose.model('Recipe', RecipeSchema);
