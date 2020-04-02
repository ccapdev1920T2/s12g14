const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const app = express();

const port = 3000;

app.use('/assets', express.static(path.join(__dirname, 'assets')));

var hbs = handlebars.create({
  extname: 'hbs'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.get('/profile/:profileID', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/recipe/:recipeID', function(req, res) {
  console.log(req.params);
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/search', function(req, res) {

});

app.get('/login', function(req, res) {
  res.render('login', {
    title: 'Login to Cooker'
  });
});

app.post('/login', function(req, res) {
  
});

app.get('/register', function(req, res) {
  res.render('register', {
    title: 'Register to Cooker'
  });
});

app.post('/register', function(req, res) {
  
});

app.get('/', function(req, res) {
  res.render('index', {
    title: 'Cooker',
    user: null
  });
});

app.listen(port, function() {
  console.log('Listening on port ' + port);
  console.log('Site can be accessed here: http://localhost:' + port);
});
