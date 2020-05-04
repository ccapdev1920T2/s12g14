// subroutes for the /recipe route

const err = require('../errors');
const express = require('express');
const router = express();

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
const upload = multer(storage);

const newRecipeController = require('../controllers/new-recipe.js');
const editRecipeController = require('../controllers/edit-recipe.js');
const deleteRecipeController = require('../controllers/delete-recipe.js');
const likeController = require('../controllers/like.js');
const commentController = require('../controllers/comment.js');
const viewRecipeController = require('../controllers/view-recipe.js');

const reportController = require('../controllers/report.js');

const Like = require('../models/like-model');

router.get('/new', newRecipeController.getNew);
router.post('/new', upload.single('display'), newRecipeController.postNew);

router.get('/:id/edit', editRecipeController.getEdit);
router.post('/:id/edit', editRecipeController.postEdit);

router.post('/:id/delete', deleteRecipeController.postDelete);

router.get('/:id/likes', likeController.getLikes);
router.post('/:id/like', likeController.postLike);
router.post('/:id/unlike', likeController.postUnlike);

router.get('/:id/comment', commentController.getComments);
router.post('/:id/comment', commentController.postCommentNew);
router.post('/:id/comment/edit', commentController.postCommentEdit);
router.post('/:id/comment/delete', commentController.postCommentDelete);

router.get('/:id', viewRecipeController.getRecipe);

// REPORT

router.post('/:id/report', reportController.postReportRecipe);
router.post('/:id/comment/:cid/report', reportController.postReportComment);

module.exports = router;
