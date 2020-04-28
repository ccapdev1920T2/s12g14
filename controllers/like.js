const Like = require('../models/like-model');

const likeController = {
  getLike: function(req, res, next){
    if (req.session && req.session.loggedIn) {
      Like.create({ recipe: req.params.id, sender: req.session.userId }, function(err) {
        if (err)  return next(err);
        else      return res.redirect('/recipe/' + req.params.id);
      });
    } else {
      res.redirect('/login');
    }
  },

  getUnlike: function(req, res, next){
    if (req.session && req.session.loggedIn) {
      Like.deleteOne({ recipe: req.params.id, sender: req.session.userId }, function(err) {
        if (err)  return next(err);
        else      return res.redirect('/recipe/' + req.params.id);
      });
    } else {
      res.redirect('/login');
    }
  }
}

module.exports = likeController;