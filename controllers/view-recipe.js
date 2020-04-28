const Recipe = require('../models/recipe-model');
const Like = require('../models/like-model');
const Comment = require('../models/comment-model');

const viewRecipeController = {
  getRecipe: function(req, res, next){
    Recipe.findOne({ _id: req.params.id }).populate("author").exec(function(err, recipe) {
      if (err) return next(err);
      if (!recipe) return next({ status: 404, message: 'Recipe not found' });

      var params = {
        layout: 'with-nav',
        registered: false,
        class: 'bg-cstm-yellow-lightest',
        title: recipe.name,
        recipe: recipe.toObject(),
        recipeId: req.params.id,
        author: recipe.author.toObject()
      };

      params.author.display_name = recipe.author.display_name;
        
      if (req.session && req.session.loggedIn) {
        params.registered = true;
        params.is_admin = req.session.isAdmin;
        params.user = req.session.username;
      }

      Like.find({ recipe: req.params.id }).populate('sender').exec(function(err, likes) {
        if (err) return next(err);

        params.like_count = likes.length;

        var liked = false;
        if (params.registered) {
          for (var i = 0; i < likes.length; i++) {
            if (likes[i].sender.username === params.user) {
              liked = true;
              break;
            }
          }
        }
        params.liked = liked;

        Comment.find({ recipe: req.params.id }).populate('author').exec(function(err, comments) {
          if (err) return next(err);

          params.comments = comments.map(d => {
            var o = d.toObject();
            o.author.display_name = d.author.display_name;
            o.owned = d.author._id == req.session.userId;
            return o;
          });

          res.render('view-recipe', params);
        });
      });
    });
  }
}

module.exports = viewRecipeController;