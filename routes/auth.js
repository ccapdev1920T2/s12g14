// Implements the /login and /register paths

const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: 'uploads' });

const Profile = require('../models/profile-model');

router.get('/login', function(req, res) {
  res.render('login', {
    title: 'Login',
    returnUrl: req.query['returnUrl'] || ''
  });
});

router.post('/login', function(req, res, next) {
  var username = req.body['username'];
  var password = req.body['password'];
  console.log('User "' + username + '" attempted to log in with passcode ' + password);
  if (username && password) {
    Profile.authenticate(username, password, function(err, user) {
      if (err) {
        return next(err);
      } else if (!user) {
        return res.redirect('/login');
      }
      else {
        req.session.loggedIn = true;
        req.session.username = username; // TODO: this seems kinda insecure
        return res.redirect(req.body['returnUrl'] || '/');
      }
    });
  } else {
    res.redirect(401, '/login');
  }
});

router.get('/logout', function(req, res, next) {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err)  return next(err);
      else      return res.redirect('/');
    });
  }
});

router.get('/register', function(req, res){
  res.render('register', {
    title: 'Register',
    returnUrl: req.query['returnUrl'] || ''
  });
});

router.post('/register', upload.single('display'), function(req, res, next) {
  var username = req.body['username'];
  var email = req.body['email'];
  var password = req.body['password'];
  var confirm = req.body['confirm'];

  var firstName = req.body['firstname'];
  var lastName = req.body['lastname'];
  var bio = req.body['bio'];

  var display = req.file;
  
  if (username && email && password && confirm && password === confirm) {
    var userData = {
      username: username,
      email: email,
      pass_encrypted: password,
  
      firstname: firstName,
      lastname: lastName,
      bio: bio,
      picture_link: display ? ('/uploads/' + display.filename) : null,
      is_admin: false
    };

    console.log("creating user " + userData);
    Profile.create(userData, function(err, user) {
      if (err) {
        return next(err);
      } else if (!user) {
        return res.redirect('/register');
      }
      else {
        req.session.loggedIn = true;
        req.session.username = username; // TODO: this seems kinda insecure
        return res.redirect(req.body['returnUrl'] || '/profile');
      }
    });
  } else {
    console.log("not creating user");
    return redirect('/register');
  }
});

module.exports = router;
