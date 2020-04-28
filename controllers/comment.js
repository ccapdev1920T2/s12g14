const Comment = require('../models/comment-model');

const commentController = {
  postCommentNew: function(req, res, next){
    if (req.session && req.session.loggedIn) {
      var text = req.body.text;
    
      Comment.create({ text: text, recipe: req.params.id, author: req.session.userId }, function(err) {
        if (err)  return next(err);
        else      return res.redirect('/recipe/' + req.params.id);
      });
    } else {
      res.redirect('/login');
    }
  },

  postCommentEdit: function(req, res, next){
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
  },

  postCommentDelete: function(req, res, next){
    if (req.session && req.session.loggedIn) {
      var commentId = req.body.id;
    
      Comment.deleteOne({ _id: commentId, author: req.session.userId }, function(err) {
        if (err)  return next(err);
        else      return res.redirect('/recipe/' + req.params.id);
      });
    } else {
      res.redirect('/login');
    }
  }
}

module.exports = commentController;