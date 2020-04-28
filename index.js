const express = require('express');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

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

const Profile = require('./models/profile-model');
const Recipe = require('./models/recipe-model');

const port = process.env.PORT || 3000;
const app = express();

// use handlebars as our template engine
Handlebars.registerHelper("split_fours", function(array, options) {
  var result = '';
  var remaining = array.length;
  var offset = 0;
  while (remaining > 0) {
    var take = Math.min(remaining, 4);
    remaining -= take;

    var subArray = array.slice(offset, offset + take);
    offset += take;
    while (subArray.length < 4) subArray.push({ _id: null });
    result += options.fn(subArray, options);
  }
  return result;
});

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
  cookie: {},
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
};

app.use(session(sessionOpts));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

const authRoute = require('./routes/auth');
app.use(authRoute);

const profileRoute = require('./routes/profile');
app.use("/profile", profileRoute);

const recipeRoute = require('./routes/recipe');
app.use("/recipe", recipeRoute);

app.get('/404', function(req, res){
  var params = {
    layout: 'with-nav',
    registered: false,
    class: 'bg-cstm-yellow-lightest',
    title: 'Page not found',
  }

  if (req.session && req.session.loggedIn) {
    params.registered = true;
    params.is_admin = req.session.isAdmin;
    params.user = req.session.username;
  }

  res.render('404', params);
});

app.get('/', function(req, res, next){
  Recipe.find().exec(function(err, recipes) {
    if (err) return next(err);

    var params = {
      layout: 'with-nav',
      registered: false,
      class: 'bg-cstm-yellow-lightest',
      title: 'Cooker: Your repository of recipes',
      hot_recipes: {
        section_name: 'hot-recipes',
        values: recipes.map((doc) => doc.toObject())
      }
    };
  
    if (req.session && req.session.loggedIn) {
      params.registered = true;
      params.is_admin = req.session.isAdmin;
      params.user = req.session.username;
    }
  
    res.render('index', params);
  });
});

app.use(function(err, req, res, next) {
  if (err.status && err.message) {
    return res.redirect('/404');
  } else {
    return next(err);
  }
});

app.get('/*', function(req, res){
  res.redirect('/404');
});

app.listen(port, function() {
  console.log('App listening at port ' + port);
  console.log('Go to http://localhost:' + port);
});
