const Comment = require('../models/comment-model');
const sanitize = require('sanitize-html');

const err = require('../errors');

const commentController = {
  getComments: function(req, res, next) {
    Comment.find({ recipe: req.params.id }).populate("author").exec()
    .then(function(documents) {
      var comments = documents.map(doc => {
        var comment = doc.toObject();
        comment.author.display_name = doc.author.display_name;
        comment.owned = req.session && (doc.author._id == req.session.userId);
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
      var text = sanitize(req.body.text, 'string');
      Comment.create({ text: text, recipe: req.params.id, author: req.session.userId })
      .then(function(document) {
        var comment = document.toObject();
        comment.author = {
          _id: req.session.user.id,
          username: req.session.user.username,
          display_name: req.session.user.display_name,
          lastname: req.session.user.lastname,
          firstname: req.session.user.firstname,
          picture_link: req.session.user.picture_link
        };
        comment.owned = true;
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
      var recipeId = req.params.id;
      var commentId = req.params.cid;
      var text = req.body.text;
  
      var query = {
        _id: commentId,
        author: req.session.user.id,
        recipe: recipeId
      };
  
      var doc = { text: text };
  
      Comment.findOneAndUpdate(query, doc, { useFindAndModify: false, new: true }).exec()
      .then(function(document) {
        console.log(document);
        if (!document) throw Error("Comment could not be found.");
        var comment = document.toObject();
        comment.author = {
          _id: req.session.user.id,
          username: req.session.user.username,
          display_name: req.session.user.display_name,
          lastname: req.session.user.lastname,
          firstname: req.session.user.firstname,
          picture_link: req.session.user.picture_link
        };
        comment.owned = true;
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
      var recipeId = req.params.id;
      var commentId = req.params.cid;
  
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
