const Comment = require('../models/comment-model');
const sanitize = require('sanitize-html');

const commentController = {
  getComments: function(req, res, next) {
    Comment.find({ recipe: req.params.id }).populate("author").exec()
    .then(function(documents) {
      var comments = documents.map(doc => {
        var comment = doc.toObject();
        comment.author.display_name = doc.author.display_name;
        comment.owner = req.session && (doc.author._id == req.session.userId);
        comment.text = sanitize(comment.text);
        return comment;
      });
      res.json({ count: comments.length, comments: comments });
    })
    .catch(function(reason) {
      res.status(500).json({ error: err.generic("An error occurred.", reason) });
    });
  },

  postCommentNew: function(req, res, next){
    if (req.session && req.session.loggedIn) {
      var text = req.body.text;
      Comment.create({ text: text, recipe: req.params.id, author: req.session.userId })
      .then(function(document) {
        var comment = document.toObject();
        comment.author.display_name = document.author.display_name;
        res.json(comment);
      })
      .catch(function(reason) {
        res.status(500).json({ error: err.generic("An error occurred.", reason) });
      });
    } else {
      res.status(401).json({ error: err.unauthorized() });
    }
  },

  postCommentEdit: function(req, res, next){
    if (req.session && req.session.loggedIn) {
      var text = req.body.text;
  
      var query = {
        _id: req.params.id,
        author: req.session.userId
      };
  
      var doc = { text: text };
  
      Comment.findOneAndUpdate(query, doc).exec()
      .then(function(document) {
        var comment = document.toObject();
        comment.author.display_name = document.author.display_name;
        res.json(comment);
      })
      .catch(function(reason) {
        res.status(500).json({ error: err.generic("Could not edit comment.", reason)});
      });
    } else {
      res.status(401).json({ error: err.unauthorized() });
    }
  },

  postCommentDelete: function(req, res, next){
    if (req.session && req.session.loggedIn) {
      var recipeId = req.body.id;
      var commentId = req.body.cid;
  
      Comment.deleteOne({ _id: commentId, recipe: recipeId, author: req.session.userId }).exec()
      .then(function(result) {
        res.send("Successfully deleted comment.");
      })
      .catch(function(reason) {
        res.status(500).json({ error: err.generic("Could not delete comment.", reason) });
      });
    } else {
      res.status(401).json({ error: err.unauthorized() });
    }
  }
}

module.exports = commentController;
