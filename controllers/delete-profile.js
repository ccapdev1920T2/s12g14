const Profile = require('../models/profile-model');

const deleteProfileController = {
  getDelete: function(req, res) {
    console.log('test');
    if (req.session && req.session.loggedIn) {
      console.log('test');
      res.render('delete-account', {
        title: 'Delete Profile',
        class: 'bg-cstm-yellow-lightest',
      });
    } else {
      res.redirect('/login');
    }
  },

  postDelete: function(req, res, next){
    if (req.session && req.session.loggedIn) {
      var userId = req.session.userId;
      
      Profile.deleteOne({ _id: userId }, function(err) {
        if (err) return next(err);
        else
          req.session.destroy(function(err) {
            if (err)  return next(err);
            else      return res.redirect('/');
          });
      });
    } else {
      res.redirect('/login');
    }
  }
}

module.exports = deleteProfileController;