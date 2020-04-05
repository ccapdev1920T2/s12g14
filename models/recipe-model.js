var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

module.exports = mongoose.model('Recipe', RecipeSchema);
