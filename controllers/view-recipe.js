const Recipe = require('../models/recipe-model');
const sanitize = require('sanitize-html');

const viewRecipeController = {
  getRecipe: function(req, res, next){
    Recipe.findOne({ _id: req.params.id })
    .populate("author").exec(function(err, recipe) {
      if (err) return next(err);
      if (!recipe) return next({ status: 404, message: 'Recipe not found' });

      var params = {
        layout: 'with-nav',
        registered: false,
        class: 'bg-cstm-yellow-lightest',
        title: recipe.name.trim() + ' - Cooker',
        recipe: recipe.toObject(),
        recipeId: req.params.id,
        owned: req.session && req.session.loggedIn && recipe.author._id == req.session.user.id,
        author: recipe.author.toObject(),
        url: sanitize("/recipe/" + req.params.id)
      };

      params.author.display_name = recipe.author.display_name;
        
      if (req.session && req.session.loggedIn) {
        params.registered = true;
        params.is_admin = req.session.isAdmin;
        params.user = req.session.user;
      }
      
      res.render('view-recipe', params);
    });
  }
}

module.exports = viewRecipeController;
