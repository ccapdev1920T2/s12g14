const Like = require('../models/like-model');

const likeController = {
  getLike: function(req, res, next){
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
  },

  getUnlike: function(req, res, next){
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
    // if (req.session && req.session.loggedIn) {
    //   Like.deleteOne({ recipe: req.params.id, sender: req.session.userId }, function(err) {
    //     if (err)  return next(err);
    //     else      return res.redirect('/recipe/' + req.params.id);
    //   });
    // } else {
    //   res.redirect('/login');
    // }
  },

  getLikes: function(req, res, next){
    Like.find({ recipe: req.params.id }).exec()
    .then(function(likes) {
      res.json({ count: likes.length });  
    })
    .catch(function(reason) {
      res.status(400).json({ error: err.create(err.GENERIC_ERROR, "An error occurred.", reason) });
    });
  }
}

module.exports = likeController;