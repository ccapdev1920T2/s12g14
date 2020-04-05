const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');

const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads' })

const path = require('path');

const databaseUrl = process.env.DATABASE || "mongodb://localhost:27017/cookerdb";

const database = require('./database');
const dbinit = require('./dbinit');

database.connect();
dbinit.initializeDefault();
dbinit.initializeDummy();

const User = require('./models/user');



const port = process.env.PORT || 3000;
const app = express();

// use handlebars as our template engine
app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultView: 'default',
  defaultLayout: 'default',
  layoutsDir: path.join(__dirname, '/views/layouts'),
  partialsDir: path.join(__dirname, '/views/partials')
}));
app.set('view engine', 'hbs');

var sessionOpts = {
  secret: 'put a secret code here',
  resave: true,
  saveUninitialized: false,
  cookie: {}
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
  sessionOpts.cookie.secure = true;
}

app.use(session(sessionOpts));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.get('/login', function(req, res) {
  res.render('login', {
    title: 'Login',
    returnUrl: req.query['returnUrl'] || ''
  });
});

app.post('/login', function(req, res, next) {
  var username = req.body['username'];
  var password = req.body['password'];
  console.log('User "' + username + '" attempted to log in with passcode ' + password);
  if (username && password) {
    User.authenticate(username, password, function(err, user) {
      if (err)        return next(err);
      else if (!user) return res.redirect('/login');
      else            return res.redirect(req.body['returnUrl'] || '/');
    });
  } else {
    res.redirect(401, '/login');
  }
});

app.get('/register', function(req, res){
  res.render('register', {
    title: 'Register',
    returnUrl: req.query['returnUrl'] || ''
  });
});

app.post('/register', upload.single('display'), function(req, res, next) {
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
      passEncrypted: password,
  
      firstName: firstName,
      lastName: lastName,
      bio: bio,
      pictureLink: '/uploads/' + display.filename
    };

    User.create(userData, function(err, user) {
      if (err)        return next(err);
      else if (!user) return res.redirect('/register');
      else            return res.redirect(req.body['returnUrl'] || '/profile');
    });
  } else {
    return redirect('/register');
  }

  


});

app.get('/profile', function(req, res){
  res.render('profile', {
    layout: 'with-nav',
    registered: false,
    class: 'bg-cstm-yellow-lightest',
    title: 'View Profile',
  });
});

app.get('/create-recipe', function(req, res){
  res.render('create-recipe', {
    layout: 'with-nav',
    registered: true,
    class: 'bg-cstm-yellow-lightest',
    title: 'Create Recipe',
  });
});

app.get('/edit-profile', function(req, res){
  res.render('edit-profile', {
    layout: 'with-nav',
    registered: true,
    class: 'bg-cstm-yellow-lightest',
    title: 'Edit Profile'
  });
});

app.get('/recipe', function(req, res){
  res.render('recipe', {
    layout: 'with-nav',
    registered: false,
    class: 'bg-cstm-yellow-lightest',
    title: 'View Recipe',
  });
});

app.get('/404', function(req, res){
  res.render('index', {
    layout: 'with-nav',
    registered: false,
    class: 'bg-cstm-yellow-lightest',
    title: 'Landing Page',
  });
});

app.get('/', function(req, res){
  res.render('index', {
    layout: 'with-nav',
    registered: false,
    class: 'bg-cstm-yellow-lightest',
    title: 'Landing Page',
  });
});

app.get('/*', function(req, res){
  res.redirect('/404');
});

app.listen(port, function() {
  console.log('App listening at port ' + port);
  console.log('Go to http://localhost:' + port);
});
