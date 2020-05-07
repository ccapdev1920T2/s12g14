const Like = require('../models/like-model');
const err = require('../errors');

const likeController = {
  postLike: function(req, res, next){
    if (req.session && req.session.loggedIn) {
      Like.create({ recipe: req.params.id, sender: req.session.user.id })
      .then(function(like) {
        // Generic message; use status code to check for success
        if (like) res.send("Success!");
        else      res.status(500).send("Recipe still not liked");
      })
      .catch(function(reason) {
        res.status(500).json({ error: {
          message: "Could not like recipe.",
          details: reason
        }});
      });
    } else {
      res.status(401).json({ error: err.unauthorized() });
    }
  },

  postUnlike: function(req, res, next){
    if (req.session && req.session.loggedIn) {
      Like.deleteOne({ recipe: req.params.id, sender: req.session.user.id }).exec()
      .then(function(result) {
        if (result.ok) {
          if (result.n == 0) res.status(400).send({ error: "Recipe not liked. " });
          else               res.send("Success!");
        } else {
          res.status(500).send("Weird..."); // Generic message; use status code to check for success
        }
      })
      .catch(function(reason) {
        res.status(500).json({ error: {
          message: "An error occurred.",
          details: reason
        }});
      });
    } else {
      res.status(401).json({ error: err.unauthorized() });
    }
  },

  getLikes: function(req, res, next){
    Like.find({ recipe: req.params.id }).exec()
    .then(function(likes) {
      var liked = false;
      if (req.session && req.session.loggedIn) {
        for (var i = 0; i < likes.length; i++) {
          if (likes[i].sender == req.session.user.id) {
            liked = true;
            break;
          }
        }
      }
      
      res.json({ count: likes.length, liked: liked });  
    })
    .catch(function(reason) {
      res.status(500).json({ error: err.generic("An error occurred.", reason) });
    });
  }
}

module.exports = likeController;
