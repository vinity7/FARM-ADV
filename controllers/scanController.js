const Scan = require('../models/Scan');

// @desc    Get recent scans for a user
// @route   GET /api/scan
// @access  Private
exports.getScans = async (req, res) => {
    try {
        const scans = await Scan.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
        res.json(scans);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Save a new scan result
// @route   POST /api/scan
// @access  Private
exports.saveScan = async (req, res) => {
    try {
        const { imageUrl, diagnosis, recommendation, status } = req.body;
        const newScan = new Scan({
            user: req.user._id,
            imageUrl,
            diagnosis,
            recommendation,
            status: status || 'detected'
        });
        const savedScan = await newScan.save();
        res.status(201).json(savedScan);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};
