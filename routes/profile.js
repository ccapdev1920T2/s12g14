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

router.post('/edit', function(req, res) {
  
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
            title: profileToView +  '\'s Profile',
            recipes: recipes
          };
          params.recipe_title = params.profile.display + '\'s Recipes';
    
          if (req.session && req.session.loggedIn) {
            params.registered = true;
            params.user = req.session.username;
          }
    
          res.render('profile', params);
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
