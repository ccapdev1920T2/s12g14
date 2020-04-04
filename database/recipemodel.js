var mongoose=require('mongoose');

var RecipeSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
    unique:true
  },
  name: {
    type: String,
    required: true,
  },
  picture_link: {
    type: String,
    required: true
  },
  author: {
    type: UserSchema,
    required: true
  },
  description: {
    type: [String],
    required: true
  },
  ingredients: {
    type: [String],
    required: true
  },
  steps: {
    type: [String],
    required: true
  },
  keywords: {
    type: [String],
    required: true
  },
  time_upload: {
    type: Date,
    required: true
  }
})

module.exports = mongoose.model('Recipe',RecipeSchema);