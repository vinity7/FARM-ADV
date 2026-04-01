const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
    const { name, phone, district, state, password, language } = req.body;
    try {
        let user = await User.findOne({ phone });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = await User.create({ name, phone, district, state, password, language: language || 'english' });
        const token = generateToken(user._id);
        res.status(201).json({ token, user: { id: user._id, name: user.name, phone: user.phone, district: user.district, state: user.state, language: user.language } });
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
            res.json({ token, user: { id: user._id, name: user.name, phone: user.phone, district: user.district, state: user.state, language: user.language } });
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
        res.json({ id: user._id, name: user.name, phone: user.phone, district: user.district, state: user.state, language: user.language, createdAt: user.createdAt });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateProfile = async (req, res) => {
    try {
        const { language, state, district } = req.body;
        const user = await User.findById(req.user._id);
        if (user) {
            user.language = language || user.language;
            user.state = state || user.state;
            user.district = district || user.district;
            const updatedUser = await user.save();
            res.json({
                id: updatedUser._id,
                name: updatedUser.name,
                phone: updatedUser.phone,
                district: updatedUser.district,
                state: updatedUser.state,
                language: updatedUser.language
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
