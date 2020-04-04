var mongoose=require('mongoose');

var CommentSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
    unique:true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type : Date, 
    default: Date.now ,
    required: true
  },
  author: {
    type: ProfileSchema,
    required: true
  },
  recipe: {
    type: RecipeSchema,
    required: true
  }
})

module.exports = mongoose.model('Comment',CommentSchema)