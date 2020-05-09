// Implements the /admin paths

const express = require('express');
const router = express.Router();

const reportController = require('../controllers/report.js');

router.get('/reports', reportController.getReports);
router.post('/reports/:id/process', reportController.postProcessReport);

module.exports = router;
