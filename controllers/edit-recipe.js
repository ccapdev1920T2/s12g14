const Recipe = require('../models/recipe-model');
const err = require('../errors');

const editRecipeController = {
  getEdit: function(req, res){
    if (req.session && req.session.loggedIn) {
      Recipe.findOne({ _id: req.params.id, author: req.session.user.id }).populate("author").exec(function(err, recipe) {
      if (err) return next(err);
      if (!recipe) return next({ status: 404, message: 'Recipe not found' });
  
      var params = {
        layout: 'with-nav',
        registered: true,
        is_admin: req.session.isAdmin,
        user: req.session.user,
        class: 'bg-cstm-yellow-lightest',
        title: 'Edit recipe - ' + recipe.name.trim() + ' - Cooker',
        header_text: 'Edit recipe',
        recipe: recipe.toObject()
      };

      if (params.recipe.keywords) params.recipe.keywords = params.recipe.keywords.join(" ");

      res.render('edit-recipe', params);
    });
    } else {
      res.redirect('/login');
    }
  },
  
  // AJAX API:
  // The data to be passed to this endpoint should contain the following fields:
  //   name:               the name of the recipe                        (string)
  //   description:        the user-provided description for the recipe  (string?)
  //   servings:           how many servings this recipe has             (int)
  //   ingredient-count:   number of ingredients
  //   ingredient-x:       the list of ingredients for this recipe       (string)
  //   step-count:         number of steps
  //   step-x:             the steps for creating the recipe             (string)
  //   keywords:           the keywords associated with this recipe      (string)
  //
  // The following fields are implicit to the request:
  //   author:       the author information is stored in the session, which should be present
  //   upload_date:  when the recipe is uploaded; it can be tracked by the server upon receiving the
  //                 request
  //   picture_link: this is handled by the file upload mechanism
  postEdit: function(req, res) {
    if (req.session && req.session.loggedIn) {
      var errors = [];
  
      if (req.body.name === undefined) errors.push(err.missingField("name", "Recipe name is required."));
      else if (req.body.name.length == 0) errors.push(err.invalidValue("name", "Recipe name must have at least one character."));
      if (req.body.servings === undefined) errors.push(err.missingField("servings", "Recipe servings is required."));
      else if (req.body.servings < 1) errors.push(err.invalidValue("servings", "Recipe servings must be at least one."));
      if (req.body.ingredient_count === undefined) errors.push(err.missingField("ingredient_count", "Recipe must have ingredients."));
      else if (req.body.ingredient_count < 1) errors.push(err.invalidValue("ingredient_count", "Recipe must have at least one ingredient."));
      if (req.body.step_count === undefined) errors.push(err.missingField("step_count", "Recipe must have steps."));
      else if (req.body.step_count < 1) errors.push(err.invalidValue("step_count", "Recipe must have at least one step."));

      var ingredients = [];
      for (var i = 1; i <= req.body.ingredient_count; i++) {
        ingredients.push(req.body['ingredient-' + i]);
      }

      var steps = [];
      for (var i = 1; i <= req.body.step_count; i++) {
        steps.push(req.body['step-' + i]);
      }

      var keywords = [];
      if (req.body.keywords) keywords = req.body.keywords.split(/\s+/);
  
      if (errors && errors.length > 0) {
        return res.status(400).json({ error: errors });
      }
  
      var query = {
        _id: req.params.id,
        author: req.session.user.id
      };
  
      var doc = {
        name: req.body.name,
        description: req.body.description,
        servings: req.body.servings,
  
        keywords: keywords,
        ingredients: ingredients,
        steps: steps
      };
  
      if (req.file) doc.picture_link = '/uploads/' + req.file.filename;

      console.log(doc);

      Recipe.update(query, doc).exec()
      .then(function() {
        res.json({ id: req.params.id });
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
