const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    category: {
        type: String,
        required: true,
        // Common categories: Seeds, Labor, Fertilizer, Sales, Pesticides, Equipment, Other
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Ledger', ledgerSchema);
