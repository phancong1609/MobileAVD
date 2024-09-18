const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendOtpEmail } = require('../utils/otpUtils');

const JWT_SECRET = 'your_jwt_secret';


exports.registerUser = async (req, res) => {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000);

    const user = new User({ email, password: hashedPassword, name, otp, isActivated: false });
    await user.save();

    sendOtpEmail(email, otp);
    res.status(201).send('User registered. Check your email for the OTP.');
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (user && user.otp === otp) {
        user.otp = null;
        user.isActivated = true;
        await user.save();
        res.status(200).send('Email verified. You can now log in.');
    } else {
        res.status(400).send('Invalid OTP.');
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).send('User not found');
    if (!user.isActivated) return res.status(400).send('Please verify your email first');

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: user._id}, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};


exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User not found');
    if (!user.isActivated) return res.status(400).send('Please verify your email first');

    user.otp = otp;
    await user.save();

    sendOtpEmail(email, otp);
    res.send('OTP sent to your email.');
};

exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (user && user.otp === otp) {
        user.password = await bcrypt.hash(newPassword, 10);
        user.otp = null;
        await user.save();
        res.send('Password reset successfully.');
    } else {
        res.status(400).send('Invalid OTP.');
    }
};


exports.updateProfile = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { otp, name } = req.body;
    if (!otp) return res.status(400).send('OTP is required');
    if (!token) return res.status(400).send('Token is required');

    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id);
        if (!user) return res.status(400).send('User not found');
        if (otp.trim() !== user.otp.trim()) return res.status(400).send('Invalid OTP');

        user.name = name;
        user.otp = null;
        await user.save();

        res.send('Profile has been updated');
    } catch (error) {
        res.status(400).send('Invalid token or user');
    }
};


exports.requestOtp = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { email } = req.body;

    if (!token) return res.status(400).send('Token is required');
    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id);

        if (!user) return res.status(400).send('User not found');
        if (user.email !== email) return res.status(400).send('Email does not match the user');

        const otp = Math.floor(100000 + Math.random() * 900000);
        user.otp = otp;
        await user.save();

        sendOtpEmail(user.email, otp);
        res.send('OTP sent to your email.');
    } catch (error) {
        res.status(400).send('Invalid token');
    }
}

exports.getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (error) {
        res.status(500).send('An error occurred while retrieving the user');
    }
};
