const Recipe = require('../models/recipe-model');
const err = require('../errors');

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
        user: req.session.user,
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
      var errors = [];
  
      if (req.body.name === undefined) errors.push(err.missingField("name", "Recipe name is required."));
      else if (!(req.body.name instanceof String)) errors.push(err.invalidValue("name", "Recipe name must be a string."));
      else if (req.body.name.length == 0) errors.push(err.invalidValue("name", "Recipe name must have at least one character."));
      if (req.body.servings === undefined) errors.push(err.missingField("servings", "Recipe servings is required."));
      else if (!Number.isInteger(req.body.servings)) errors.push(err.invalidValue("servings", "Recipe servings must be an integer >= 1."));
      else if (req.body.servings < 1) errors.push(err.invalidValue("servings", "Recipe servings must be at least one."));
      if (req.body.ingredients === undefined) errors.push(err.missingField("ingredients", "Recipe must have ingredients."));
      else if (!(req.body.ingredients instanceof Array)) errors.push(err.invalidValue("ingredients", "Recipe ingredients must be an array."));
      else if (req.body.ingredients.length == 0) errors.push(err.invalidValue("ingredients", "Recipe must have at least one ingredient."));
      if (req.body.steps === undefined) errors.push(err.missingField("steps", "Recipe must have steps."));
      else if (!(req.body.steps instanceof Array)) errors.push(err.invalidValue("steps", "Recipe steps must be an array."));
      else if (req.body.steps.length == 0) errors.push(err.invalidValue("steps", "Recipe must have at least one step."));
  
      if (errors) {
        return res.status(400).json({ error: errors });
      }
  
      var query = {
        _id: req.params.id,
        author: req.session.userId
      };
  
      var doc = {
        name: req.body.name,
        description: req.body.description,
        servings: req.body.servings,
  
        keywords: req.body.keywords,
        ingredients: req.body.ingredients,
        steps: req.body.steps
      };
  
      if (req.file) doc.picture_link = '/uploads/' + req.file.filename;

      Recipe.findOneAndUpdate(query, doc).exec()
      .then(function(recipe) {
        res.json({ id: recipe._id });
      })
      .catch(function(reason) {
        res.status(500).json({ error: err.generic("Could not edit recipe.", reason)});
      });
    } else {
      res.status(401).json({ error: err.unauthorized()});
    }
  }
}

module.exports = editRecipeController;
