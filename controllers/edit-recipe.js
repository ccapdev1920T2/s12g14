const Recipe = require('../models/recipe-model');

const editRecipeController = {
  getEdit: function(req, res){
    if (req.session && req.session.loggedIn) {
      Recipe.findOne({ _id: req.params.id, author: req.session.userId }).populate("author").exec(function(err, recipe) {
      if (err) return next(err);
      if (!recipe) return next({ status: 404, message: 'Recipe not found' });
  
      var params = {
        layout: 'with-nav',
        registered: true,
        is_admin: req.session.isAdmin,
        user: req.session.username,
        class: 'bg-cstm-yellow-lightest',
        title: recipe.name,
        recipe: recipe.toObject(),
        author: recipe.author.toObject()
      };
  
      params.author.display_name = recipe.author.display_name;
  
      res.render('edit-recipe', params);
    });
    } else {
      res.redirect('/login');
    }
  },
  
  postEdit: function(req, res) {
    if (req.session && req.session.loggedIn) {
      var recipeId = req.body.id;
      
      var delta = {};
  
      Recipe.updateOne({ _id: recipeId, author: req.session.userId }, delta, function(err) {
        if (err)  return next(err);
        else      return res.redirect('/profile');
      });
    } else {
      res.redirect('/login');
    }
  }
}

module.exports = editRecipeController;