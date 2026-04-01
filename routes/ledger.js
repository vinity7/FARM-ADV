const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
    getLedgerEntries, 
    addLedgerEntry, 
    deleteLedgerEntry 
} = require('../controllers/ledgerController');

router.route('/')
    .get(protect, getLedgerEntries)
    .post(protect, addLedgerEntry);

router.route('/:id')
    .delete(protect, deleteLedgerEntry);

module.exports = router;
