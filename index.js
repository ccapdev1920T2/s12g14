const express = require('express');
const handlebars = require('handlebars'); // for handlebars.SafeString()
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const port = 9090;




app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultView: 'default',
  defaultLayout: 'default',
  layoutsDir: path.join(__dirname, '/views/layouts'),
  partialsDir: path.join(__dirname, '/views/partials'),
}));

app.set('view engine', 'hbs');

app.get('/', function(req, res){
  res.render('index', {
    layout: 'with-nav',
    registered: false,
    class: 'bg-cstm-yellow-lightest',
    title: 'Landing Page',
  })
});
app.get('/login', function(req, res){
  res.render('login', {
    title: 'Login',
  });
});

app.get('/register', function(req, res){
  res.render('register', {
    title: 'Register',
  });
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

app.use(express.static('public'));
app.listen(port, function(){
  console.log('App listening at port ' + port);
});
