const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const { getQueryAdvice } = require('../controllers/queryController');

router.post('/', protect, upload.single('image'), getQueryAdvice);

module.exports = router;
