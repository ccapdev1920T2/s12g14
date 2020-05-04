const Recipe = require('../models/recipe-model');
const Like = require('../models/like-model');
const Comment = require('../models/comment-model');
const mongoose = require('mongoose');
const err = require('../errors');

const deleteRecipeController = {
  postDelete: function(req, res, next){
    if (req.session && req.session.loggedIn) {
      var recipeId = req.body.id;
  
      // start a delete transaction
      mongoose.startSession()
      .then(async function(session) {
        session.startTransaction();
        Recipe.findOne(recipeId).exec()
        .then(function(recipe) {
          if (recipe) {
            if (recipe.author == req.session.userId) {
              return recipe;
            } else {
              throw Error("Recipe not owned by requestor.");
            }
          } else {
            throw Error("No recipe to delete.");
          }
        })
        .then(() => Like.deleteMany({ recipe: recipeId }))
        .then(() => Comment.deleteMany({ recipe: recipeId }))
        .then(function() {
          session.commitTransaction(function() {
            res.send("Successfully deleted recipe.");
          });
        })
        .catch(function(reason) {
          session.abortTransaction(function() {
            res.status(404).json({ error: err.notFound("Could not delete recipe.", reason) });
          });
        })
        .finally(function() {
          session.endSession();
        })
      })
      .catch(function(reason) {
        res.status(500).json({ error: err.generic("Could not delete recipe.", reason) });
      });
    } else {
      res.status(401).json({ error: err.unauthorized() });
    }
  }
}

module.exports = deleteRecipeController;
