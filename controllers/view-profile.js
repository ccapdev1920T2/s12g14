const Profile = require('../models/profile-model');
const Recipe = require('../models/recipe-model');
const Like = require('../models/like-model');
const Comment = require('../models/comment-model');

const viewProfileController = {
  getOtherProfile: function(req, res){
    var profileToView = req.params.username;
    Profile.findOne({ username: profileToView }).exec(function(err, user) {
      if (err) {
        return next(err);
      } else if (!user) {
        res.redirect('/404');
      } else {
        // load recipes made by this user
        Recipe.find({ author: user._id }).exec(function(err, recipes) {
          if (err) {
            return next(err);
          } else {
            var params = {
              layout: 'with-nav',
              registered: false,
              self: false,
              profile: {
                display: user.display_name,
                bio: user.bio,
                join_date: user.join_date,
                picture_link: user.picture_link
              },
              class: 'bg-cstm-yellow-lightest',
              title: profileToView + '\'s Profile',
              uploaded_recipes: {
                section_name: 'uploaded-recipes',
                values: recipes.map(d => d.toObject())  
              }
            };
            params.recipe_title = params.profile.display + '\'s Recipes';
      
            if (req.session && req.session.loggedIn) {
              params.registered = true;
              params.is_admin = req.session.isAdmin;
              params.user = req.session.user;
            }

            // get all recipes this user has liked
            Like.find({ sender: user._id }).populate('recipe').exec(function(err, likes) {
              if (err) {
                return next(err);
              } else {
                var liked_recipes = likes.map(d => d.recipe.toObject());
                params.liked_recipes = {
                  section_name: 'liked-recipes',
                  values: liked_recipes
                };

                Comment.find({ author: user._id }).populate('recipe').exec(function(err, comments) {
                  var allComments = comments.map(d => d.toObject());
                  params.comments = allComments;

                  if (err) {
                    return next(err);
                  } else {
                    res.render('profile', params);
                  }
                });
              }
            });
          }
        });
      }
    });
  },

  getOwnProfile: function(req, res){
    if (req.session && req.session.loggedIn) {
      Profile.findOne({ username: req.session.user.username }).exec(function(err, user) {
        if (err) {
          return next(err);
        } else if (!user) {
          res.redirect('/404');
        } else {
          res.render('profile', {
            layout: 'with-nav',
            registered: true,
            user: req.session.user,
            self: true,
            profile: {
              display: (user.firstname && user.lastname) ? user.firstname + ' ' + user.lastname : user.username,
              bio: user.bio,
              join_date: user.join_date,
              picture_link: user.picture_link
            },
            class: 'bg-cstm-yellow-lightest',
            title: 'My Profile',
            recipe_title: 'My Recipes'
          });
        }
      });
    } else {
      res.redirect('/login')
    }
  }
}

module.exports = viewProfileController;
