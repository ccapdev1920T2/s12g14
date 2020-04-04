var mongoose=require('mongoose');

var LikeSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
    unique:true
  },
  sender: {
    type: UserSchema,
    required: true
  },
  recipe: {
    type: RecipeSchema,
    required: true
  },
  timestamp: {
    type : Date, 
    default: Date.now ,
    required: true
  }
})

module.exports = mongoose.model('Like',LikeSchema)