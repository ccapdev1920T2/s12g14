const Recipe = require('../models/recipe-model');
const sanitizer = require('sanitize')();

const searchController = { 
  getSearch: function(req, res) {
    var query = sanitizer.value(req.query.q, String);
    // TODO: basic keyword or title search
    var keywords = query.trim().split(/\s+/);

    Recipe.find({
      $or: [
        { keywords: { $all: keywords } },
        { name: { $regex: query, $options: 'i' } }
      ]
    }).exec()
    .then(function(results) {
      var params = {
        layout: 'with-nav',
        registered: false,
        class: 'bg-cstm-yellow-lightest',
        title: 'Search results for ' + query.trim() + ' - Cooker',
        search_recipes: {
          section_name: 'search-recipes',
          values: results.map((doc) => doc.toObject())
        }
      };
    
      if (req.session && req.session.loggedIn) {
        params.registered = true;
        params.is_admin = req.session.isAdmin;
        params.user = req.session.user;
      }

      res.render('search', params);
    })
    .catch(function(reason) {
      // TODO: redirect to error page or show error
      res.redirect('/404');
    });

  }
}

module.exports = searchController;
