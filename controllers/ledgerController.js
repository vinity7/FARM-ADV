const Ledger = require('../models/Ledger');

// @desc    Get all ledger entries for a user
// @route   GET /api/ledger
// @access  Private
exports.getLedgerEntries = async (req, res) => {
    try {
        const entries = await Ledger.find({ user: req.user._id }).sort({ date: -1 });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a new ledger entry
// @route   POST /api/ledger
// @access  Private
exports.addLedgerEntry = async (req, res) => {
    try {
        const { type, category, amount, description, date } = req.body;
        const newEntry = new Ledger({
            user: req.user._id,
            type,
            category,
            amount,
            description,
            date: date || Date.now()
        });
        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

// @desc    Delete a ledger entry
// @route   DELETE /api/ledger/:id
// @access  Private
exports.deleteLedgerEntry = async (req, res) => {
    try {
        const entry = await Ledger.findById(req.params.id);
        if (!entry) return res.status(404).json({ message: 'Entry not found' });
        
        if (entry.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await entry.deleteOne();
        res.json({ message: 'Entry removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
