// subroutes for the /recipe route

const express = require('express');
const router = express();

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
const upload = multer(storage);


<<<<<<< HEAD
const newRecipeController = require('../controllers/new-recipe.js');
const editRecipeController = require('../controllers/edit-recipe.js');
const deleteRecipeController = require('../controllers/delete-recipe.js');
const likeController = require('../controllers/like.js');
const commentController = require('../controllers/comment.js');
const viewRecipeController = require('../controllers/view-recipe.js');
=======
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

router.post('/new', upload.single('display'), function(req, res, next) {
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
});

router.get('/:id/edit', function(req, res) {
  if (req.session && req.session.loggedIn) {
    Recipe.findOne({ _id: req.params.id, author: req.session.userId }).populate("author").exec(function(err, recipe) {
    if (err) return next(err);
    if (!recipe) return next({ status: 404, message: 'Recipe not found' });

    var params = {
      layout: 'with-nav',
      registered: true,
      is_admin: req.session.isAdmin,
      user: req.session.username,
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
});

router.post('/:id/edit', function(req, res) {
  if (req.session && req.session.loggedIn) {
    var recipeId = req.body.id;
    
    var delta = {};

    Recipe.updateOne({ _id: recipeId, author: req.session.userId }, delta, function(err) {
      if (err)  return next(err);
      else      return res.redirect('/profile');
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/:id/delete', function(req, res, next) {
  if (req.session && req.session.loggedIn) {
    var recipeId = req.body.id;
    
    Recipe.deleteOne({ _id: recipeId, author: req.session.userId }, function(err) {
      if (err)  return next(err);
      else {
        Like.deleteMany({ recipe: recipeId }, function(err) {
          if (err)  return next(err);
          else {
            Comment.deleteMany({ recipe: recipeId }, function(err) {
              if (err)  return next(err);
              else      return res.redirect('/profile');
            });
          }
        });
      }
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/:id/like', function(req, res, next) {
  if (req.session && req.session.loggedIn) {
    Like.create({ recipe: req.params.id, sender: req.session.userId }, function(err) {
      if (err)  return next(err);
      else      return res.redirect('/recipe/' + req.params.id);
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/:id/unlike', function(req, res, next) {
  if (req.session && req.session.loggedIn) {
    Like.deleteOne({ recipe: req.params.id, sender: req.session.userId }, function(err) {
      if (err)  return next(err);
      else      return res.redirect('/recipe/' + req.params.id);
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/:id/comment', function(req, res, next) {
  if (req.session && req.session.loggedIn) {
    var text = req.body.text;
  
    Comment.create({ text: text, recipe: req.params.id, author: req.session.userId }, function(err) {
      if (err)  return next(err);
      else      return res.redirect('/recipe/' + req.params.id);
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/:id/comment/edit', function(req, res, next) {
  if (req.session && req.session.loggedIn) {
    var commentId = req.body.id;
    var delta = {
      text: req.body.text
    };
  
    Comment.updateOne({ _id: commentId, author: req.session.userId }, delta, function(err) {
      if (err)  return next(err);
      else      return res.redirect('/recipe/' + req.params.id);
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/:id/comment/delete', function(req, res, next) {
  if (req.session && req.session.loggedIn) {
    var commentId = req.body.id;
  
    Comment.deleteOne({ _id: commentId, author: req.session.userId }, function(err) {
      if (err)  return next(err);
      else      return res.redirect('/recipe/' + req.params.id);
    });
  } else {
    res.redirect('/login');
  }
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
      recipeId: req.params.id,
      owned: recipe.author._id == req.session.userId,
      author: recipe.author.toObject()
    };

    params.author.display_name = recipe.author.display_name;
      
    if (req.session && req.session.loggedIn) {
      params.registered = true;
      params.is_admin = req.session.isAdmin;
      params.user = req.session.username;
    }
>>>>>>> changes

router.get('/new', newRecipeController.getNew);
router.post('/new', upload.single('display'), newRecipeController.postNew);

router.get('/:id/edit', editRecipeController.getEdit);
router.post('/:id/edit', editRecipeController.postEdit);

router.post('/:id/delete', deleteRecipeController.postDelete);

router.get('/:id/like', likeController.getLike);
router.get('/:id/unlike', likeController.getUnlike);

router.post('/:id/comment', commentController.postCommentNew);
router.post('/:id/comment/edit', commentController.postCommentEdit);
router.post('/:id/comment/delete', commentController.postCommentDelete);

router.get('/:id', viewRecipeController.getRecipe);

module.exports = router;
