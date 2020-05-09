// subroutes for the /profile route

const express = require('express');
const router = express.Router();

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function(req, file, cb) {
    cb(null, 'profile-' + Date.now());
  }
});

const upload = multer({ storage: storage });

const editProfileController = require('../controllers/edit-profile.js');
const viewProfileController = require('../controllers/view-profile.js');
const deleteProfileController = require('../controllers/delete-profile.js');

// the edit your own profile route
router.get('/edit', editProfileController.getEdit);
router.post('/edit', upload.single('display'), editProfileController.postEdit);

// delete profile route
router.get('/delete', deleteProfileController.getDelete);
router.post('/delete', deleteProfileController.postDelete);

// the view others' profiles route
router.get('/:username', viewProfileController.getOtherProfile);

// the view your own profile route
router.get('/', viewProfileController.getOwnProfile);

module.exports = router;
