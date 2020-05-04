const Recipe = require('../models/recipe-model');
const err = require('../errors');
const newRecipeController = {
  getNew: function(req, res){
    if (req.session && req.session.loggedIn) {
      var params = {
        layout: 'with-nav',
        registered: true,
        user: req.session.username,
        class: 'bg-cstm-yellow-lightest',
        title: 'Create Recipe',
      };
      res.render('create-recipe', params);
    } else {
      res.redirect('/login');
    }
  },

  //router.post('/new', upload.single('displ'))
  // AJAX API:
  // The data to be passed to this endpoint should contain the following fields:
  //   name:         the name of the recipe                        (string)
  //   description:  the user-provided description for the recipe  (string?)
  //   servings:     how many servings this recipe has             (int)
  //   ingredients:  the list of ingredients for this recipe       (string[])
  //   steps:        the steps for creating the recipe             (string[])
  //   keywords:     the keywords associated with this recipe      (string[]?)
  //
  // The following fields are implicit to the request:
  //   author:       the author information is stored in the session, which should be present
  //   upload_date:  when the recipe is uploaded; it can be tracked by the server upon receiving the
  //                 request
  //   picture_link: this is handled by the file upload mechanism
  postNew: function(req, res, next){
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
  
      var doc = {
        name: req.body.name,
        description: req.body.description,
        author: req.session.userId,
        servings: req.body.servings,
        picture_link: '/uploads/' + uploaded.filename,
  
        keywords: req.body.keywords,
        ingredients: req.body.ingredients,
        steps: req.body.steps
      };
  
      Recipe.create(doc)
      .then(function(recipe) {
        res.json({ id: recipe._id });
      })
      .catch(function(reason) {
        res.status(500).json({ error: err.generic("Could not create recipe.", reason)});
      });
    } else {
      res.status(401).json({ error: err.unauthorized()})
    }
  }
}

module.exports = newRecipeController;
