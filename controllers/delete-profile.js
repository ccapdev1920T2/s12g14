const Profile = require('../models/profile-model');
const Recipe = require('../models/recipe-model');
const Like = require('../models/like-model');
const Comment = require('../models/comment-model');
const mongoose = require('mongoose');
const err = require('../errors');

const deleteProfileController = {
  getDelete: function(req, res) {
    if (req.session && req.session.loggedIn) {
      res.render('delete-account', {
        title: 'Delete Profile',
        class: 'bg-cstm-yellow-lightest',
      });
    } else {
      res.redirect('/login');
    }
  },

  postDelete: function(req, res, next){
    if (req.session && req.session.loggedIn) {
      var userId = req.session.user.id;
      var recipeIds = [];

      mongoose.startSession()
      .then(async function(session) {
        session.startTransaction();
        Profile.findByIdAndDelete(userId).exec()
        .then(() => Recipe.find({ author: userId }))                                // find all the recipes posted by the user
        .then((recipes) => recipeIds = recipes.map(recipe => recipe._id))           // map them into an array of ObjectId's
        .then(() => Recipe.deleteMany({ _id: { $in: recipeIds }}))                  // delete those recipes
        .then(() => Like.deleteMany({ sender: userId }))                            // delete all the user's likes (not the recipes)
        .then(() => Like.deleteMany({ recipe: { $in: recipeIds }}))                 // delete all the likes on any of the recipes
        .then(() => Comment.deleteMany({ author: userId }))                         // delete all the user's comments
        .then(() => Comment.deleteMany({ recipe: { $in: recipeIds }}))              // delete all the comments on any of the recipes
        .then(() => {
          req.session.destroy(function(err) {
            if (err)  return next(err);
            session.commitTransaction(function() {
              return res.redirect('/');
            });
          });
        })
        .catch(function(reason) {
          console.log(reason);
          session.abortTransaction(function() {
            res.status(500).json({ error: err.notFound("Could not delete user.", reason) });
          });
        })
        .finally(function() {
          session.endSession();
        });
      })
      .catch(function(reason) {
        res.status(500).json({ error: err.generic("Could not process report.", reason) });
      });
    } else {
      res.redirect('/login');
    }
  }
}

module.exports = deleteProfileController;
