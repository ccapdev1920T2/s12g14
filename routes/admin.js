// subroutes for the /profile route

const express = require('express');
const router = express.Router();

const Profile = require('../models/profile-model');

router.post('/ban', function(req, res, next) {

});

// the admin dashboard route
router.get('/', function(req, res, next) {

});

module.exports = router;
