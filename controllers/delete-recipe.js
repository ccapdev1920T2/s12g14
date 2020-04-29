const Recipe = require('../models/recipe-model');
const Like = require('../models/like-model');
const Comment = require('../models/comment-model');

const deleteRecipeController = {
  postDelete: function(req, res, next){
    if (req.session && req.session.loggedIn) {
      var recipeId = req.body.id;
      
      Recipe.deleteOne({ _id: recipeId, author: req.session.userId }, function(err) {
        if (err)  return next(err);
        else {
          res.redirect('/')
        }
      });
    } else {
      res.redirect('/login');
    }
  }
}

module.exports = deleteRecipeController;