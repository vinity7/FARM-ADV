const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
    getScans, 
    saveScan 
} = require('../controllers/scanController');

router.route('/')
    .get(protect, getScans)
    .post(protect, saveScan);

module.exports = router;
