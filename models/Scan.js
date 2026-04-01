const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    recommendation: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['detected', 'healthy', 'unknown'],
        default: 'detected'
    }
}, { timestamps: true });

module.exports = mongoose.model('Scan', scanSchema);
