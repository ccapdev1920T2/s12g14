// subroutes for the /profile route

const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: 'uploads' });

const Profile = require('../models/profile-model');
const Recipe = require('../models/recipe-model');
const Like = require('../models/like-model');
const Comment = require('../models/comment-model');

// the edit your own profile route
router.get('/edit', function(req, res) {
  if (req.session && req.session.loggedIn) {
    Profile.findOne({ username: req.session.username }).exec(function(err, user) {
      if (err) {
        return next(err);
      } else if (!user) {
        res.redirect('/404');
      } else {
        res.render('edit-profile', {
          layout: 'with-nav',
          registered: true,
          is_admin: req.session.isAdmin,
          user: req.session.username,
          self: true,
          profile: {
            display: (user.firstname && user.lastname) ? user.firstname + ' ' + user.lastname : user.username,
            bio: user.bio,
            join_date: user.join_date,
            picture_link: user.picture_link
          },
          class: 'bg-cstm-yellow-lightest',
          title: 'Edit Profile'
        });
      }
    });
  } else {
    res.redirect('/login')
  }
});

router.post('/edit', upload.single('display'), function(req, res, next) {
  if (req.session && req.session.loggedIn) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var bio = req.body.bio;

    var display = req.file;

    var delta = {
      firstname: firstname,
      lastname: lastname,
      bio: bio
    };
    if (display) delta.picture_link = '/uploads/' + display.filename;

    Profile.update({ username: req.session.username }, delta, function(err) {
      if (err)  return next(err);
      else      return res.redirect('/profile');
    });
  } else {
    return res.redirect('/login');
  }
});

// the view others' profiles route
router.get('/:username', function(req, res) {
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
            params.user = req.session.username;
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
});

// the view your own profile route
router.get('/', function(req, res, next) {
  if (req.session && req.session.loggedIn) {
    Profile.findOne({ username: req.session.username }).exec(function(err, user) {
      if (err) {
        return next(err);
      } else if (!user) {
        res.redirect('/404');
      } else {
        res.render('profile', {
          layout: 'with-nav',
          registered: true,
          user: req.session.username,
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
});

module.exports = router;
