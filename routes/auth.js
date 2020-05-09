// Implements the /login and /register paths

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

const loginController = require('../controllers/login.js');
const logoutController = require('../controllers/logout.js');
const registerController = require('../controllers/register.js');

router.get('/login', loginController.getLogin);
router.post('/login', loginController.postLogin);

router.get('/logout', logoutController.getLogout);

router.get('/register', registerController.getRegister);
router.post('/register', upload.single('display'), registerController.postRegister);
router.get('/getCheckUsername', registerController.getCheckUsername);

module.exports = router;
