const Recipe = require('../models/recipe-model');

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

  postNew: function(req, res, next){
    if (req.session && req.session.loggedIn) {
      var name = req.body.name;
      var servings = req.body.servings;
      var description = req.body.description;
      var keywords = req.body.keywords;
  
      var display = req.file;
  
      var ingredients = [];
      var index = 1;
      while (true) {
        var fname = 'ingredient-' + index;
        if (req.body[fname]) {
          ingredients.push(req.body[fname]);
        } else {
          break;
        }
        index++;
      }
  
      var steps = [];
      index = 1;
      while (true) {
        var fname = 'step-' + index;
        if (req.body[fname]) {
          steps.push(req.body[fname]);
        } else {
          break;
        }
        index++;
      }
  
      Recipe.create({
        name: name,
        description: description,
        author: req.session.userId,
        servings: servings,
        picture_link: '/uploads/' + display.filename,
        keywords: keywords.split(' '),
        ingredients: ingredients,
        steps: steps
      }, function(err, result) {
        if (err) return next(err);
  
        return res.redirect('/recipe/' + result._id);
      });
    } else {
      res.redirect('/login');
    }
  }
}

module.exports = newRecipeController;