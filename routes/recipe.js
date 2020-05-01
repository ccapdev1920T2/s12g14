// subroutes for the /recipe route

const err = require('../errors');
const express = require('express');
const router = express.Router();

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

const Profile = require('../models/profile-model');
const Recipe = require('../models/recipe-model');
const Like = require('../models/like-model');
const Comment = require('../models/comment-model');

const mongoose = require('mongoose');

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
router.post('/new', upload.single('display'), function(req, res, next) {
  if (req.session && req.session.loggedIn) {
    var obj = {};
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

router.post('/:id/edit', upload.single('display'), function(req, res) {
  if (req.session && req.session.loggedIn) {
    var obj = {};
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

    var query = {
      _id: req.params.id,
      author: req.session.userId
    };

    var doc = {
      name: req.body.name,
      description: req.body.description,
      servings: req.body.servings,

      keywords: req.body.keywords,
      ingredients: req.body.ingredients,
      steps: req.body.steps
    };

    if (req.file) doc.picture_link = '/uploads/' + req.file.filename;

    Recipe.findOneAndUpdate(query, doc).exec()
    .then(function(recipe) {
      res.json({ id: recipe._id });
    })
    .catch(function(reason) {
      res.status(500).json({ error: err.generic("Could not edit recipe.", reason)});
    });
  } else {
    res.status(401).json({ error: err.unauthorized()})
  }
  /*if (req.session && req.session.loggedIn) {
    var recipeId = req.body.id;
    
    var delta = {};

    Recipe.updateOne({ _id: recipeId, author: req.session.userId }, delta, function(err) {
      if (err)  return next(err);
      else      return res.redirect('/profile');
    });
  } else {
    res.redirect('/login');
  }*/
});

router.post('/:id/delete', function(req, res, next) {
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
      res.status(500).json({ error: err.create(err.GENERIC_ERROR, "Could not delete recipe.", reason) });
    });
  } else {
    res.status(401).json({ error: err.unauthorized() });
  }
});

router.get('/:id/likes', function(req, res, next) {
  Like.find({ recipe: req.params.id }).exec()
  .then(function(likes) {
    res.json({ count: likes.length });  
  })
  .catch(function(reason) {
    res.status(400).json({ error: err.create(err.GENERIC_ERROR, "An error occurred.", reason) });
  });
});

router.get('/:id/like', function(req, res) {
  if (req.session && req.session.loggedIn) {
    Like.create({ recipe: req.params.id, sender: req.session.userId })
    .then(function(like) {
      console.log(like);
      // Generic message; use status code to check for success
      if (like) res.send("Success!");
      else      throw Error("Recipe is still not liked.");
    })
    .catch(function(reason) {
      res.status(500).json({ error: {
        message: "Could not like recipe.",
        details: reason
      }});
    });
  } else {
    res.status(401).json({ error: { message: "Not logged in." }});
  }
});

router.get('/:id/unlike', function(req, res) {
  if (req.session && req.session.loggedIn) {
    Like.deleteOne({ recipe: req.params.id, sender: req.session.userId }).exec()
    .then(function(result) {
      if (result.ok) {
        if (result.n == 0) res.status(401).send({ error: "Recipe not liked. " });
      }
      res.send("Success!"); // Generic message; use status code to check for success
    })
    .catch(function(reason) {
      res.status(400).json({ error: {
        message: "An error occurred.",
        details: reason
      }});
    });
  } else {
    res.status(401).json({ error: { message: "Not logged in." }});
  }
});
/*
router.get('/:id/unlike', function(req, res, next) {
  if (req.session && req.session.loggedIn) {
    Like.deleteOne({ recipe: req.params.id, sender: req.session.userId }, function(err) {
      if (err)  return next(err);
      else      return res.redirect('/recipe/' + req.params.id);
    });
  } else {
    res.redirect('/login');
  }
});*/

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
      params.liked = liked;

      Comment.find({ recipe: req.params.id }).populate('author').exec(function(err, comments) {
        if (err) return next(err);

        params.comments = comments.map(d => {
          var o = d.toObject();
          o.author.display_name = d.author.display_name;
          o.owned = d.author._id == req.session.userId;
          return o;
        });

        res.render('view-recipe', params);
      });
    });
  });
});

module.exports = router;
