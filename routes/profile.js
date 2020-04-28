// subroutes for the /profile route

const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: 'uploads' });

const Profile = require('../models/profile-model');
const Recipe = require('../models/recipe-model');
const Like = require('../models/like-model');
const Comment = require('../models/comment-model');

const editProfileController = require('../controllers/edit-profile.js');
const viewProfileController = require('../controllers/view-profile.js');

// the edit your own profile route
router.get('/edit', editProfileController.getEdit);
router.post('/edit', upload.single('display'), editProfileController.postEdit);

// the view others' profiles route
router.get('/:username', viewProfileController.getOtherProfile);

// the view your own profile route
router.get('/', viewProfileController.getOwnProfile);

module.exports = router;
