const Recipe = require('../models/recipe-model');
const sanitizer = require('sanitize')();

const registerController = { 
  getSearch: function(req, res) {
    var query = sanitizer.value(req.query.q, 'string');
    // TODO: basic keyword or title search
    var keywords = query.trim().split(/\s+/);

    Recipe.find({
      $or: [
        { keywords: { $all: keywords } },
        { name: { $regex: query, $options: 'i' } }
      ]
    }).exec()
    .then(function(results) {
      res.render('search', {
        title: 'Search results for ' + query
      });
    })
    .catch(function(reason) {
      // TODO: redirect to error page or show error
      res.render('register', {
        title: 'Register'
      });
    });

  }
}

module.exports = registerController;
