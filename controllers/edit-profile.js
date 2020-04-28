const Profile = require('../models/profile-model');

const editProfileController = {
  getEdit: function(req, res){
    if (req.session && req.session.loggedIn) {
      Profile.findOne({ username: req.session.username }).exec(function(err, user) {
        if (err) {
          return next(err);
        } else if (!user) {
          res.redirect('/404');
        } else {
          res.render('edit-profile', {
            layout: 'with-nav',
            registered: true,
            is_admin: req.session.isAdmin,
            user: req.session.username,
            self: true,
            profile: {
              display: (user.firstname && user.lastname) ? user.firstname + ' ' + user.lastname : user.username,
              bio: user.bio,
              join_date: user.join_date,
              picture_link: user.picture_link
            },
            class: 'bg-cstm-yellow-lightest',
            title: 'Edit Profile'
          });
        }
      });
    } else {
      res.redirect('/login')
    }
  },

  postEdit: function(res, res){
    if (req.session && req.session.loggedIn) {
      var firstname = req.body.firstname;
      var lastname = req.body.lastname;
      var bio = req.body.bio;
  
      var display = req.file;
  
      var delta = {
        firstname: firstname,
        lastname: lastname,
        bio: bio
      };
      if (display) delta.picture_link = '/uploads/' + display.filename;
  
      Profile.update({ username: req.session.username }, delta, function(err) {
        if (err)  return next(err);
        else      return res.redirect('/profile');
      });
    } else {
      return res.redirect('/login');
    }
  }
}

module.exports = editProfileController;