const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
    const { name, phone, district, password } = req.body;
    try {
        let user = await User.findOne({ phone });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = await User.create({ name, phone, district, password });
        const token = generateToken(user._id);
        res.status(201).json({ token, user: { name: user.name, phone: user.phone, district: user.district } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { phone, password } = req.body;
    try {
        const user = await User.findOne({ phone });
        if (user && (await user.comparePassword(password))) {
            const token = generateToken(user._id);
            res.json({ token, user: { name: user.name, phone: user.phone, district: user.district } });
        } else {
            res.status(401).json({ message: 'Invalid phone or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = req.user; // set by protect middleware
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ name: user.name, phone: user.phone, district: user.district, createdAt: user.createdAt });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
