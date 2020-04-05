// subroutes for the /recipe route

const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: 'uploads' });

const Profile = require('../models/profile-model');
const Recipe = require('../models/recipe-model');
const Like = require('../models/like-model');
const Comment = require('../models/comment-model');

router.get('/new', function(req, res) {
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
});

router.post('/new', upload.single(''), function(req, res) {
  if (req.session && req.session.loggedIn) {

  } else {
    res.redirect('/login');
  }
});

router.get('/:id/edit', function(req, res) {
  res.render('view-recipe', {
    layout: 'with-nav',
    registered: false,
    class: 'bg-cstm-yellow-lightest',
    title: 'View Recipe',
  });
});

router.post('/:id/edit', function(req, res) {
  res.render('view-recipe', {
    layout: 'with-nav',
    registered: false,
    class: 'bg-cstm-yellow-lightest',
    title: 'View Recipe',
  });
});

router.get('/:id', function(req, res, next) {
  Recipe.findOne({ _id: req.params.id })
    .populate("author").exec(function(err, recipe) {
    if (err) return next(err);
    if (!recipe) return next({ status: 404, message: 'Recipe not found' });

    var params = {
      layout: 'with-nav',
      registered: false,
      class: 'bg-cstm-yellow-lightest',
      title: recipe.name,
      recipe: recipe.toObject(),
      author: recipe.author.toObject()
    };

    params.author.display_name = recipe.author.display_name;
      
    if (req.session && req.session.loggedIn) {
      params.registered = true;
      params.user = req.session.username;
    }

    Like.find({ recipe: req.params.id }).populate('sender').exec(function(err, likes) {
      if (err) return next(err);

      params.like_count = likes.length;

      var liked = false;
      if (params.registered) {
        for (var i = 0; i < likes.length; i++) {
          if (likes[i].sender.username === params.user) {
            liked = true;
            break;
          }
        }
      }

      Comment.find({ recipe: req.params.id }).populate('author').exec(function(err, comments) {
        if (err) return next(err);

        params.comments = comments.map(d => {
          var o = d.toObject();
          o.author.display_name = d.author.display_name;
          return o;
        });

        res.render('view-recipe', params);
      });
    });
  });
});

router.get('/', function(req, res) {
  res.render('view-recipe', {
    layout: 'with-nav',
    registered: false,
    class: 'bg-cstm-yellow-lightest',
    title: 'View Recipe',
  });
});

module.exports = router;
