const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register User
router.post('/register', userController.registerUser);

// Verify OTP (Email Verification)
router.post('/verify-otp', userController.verifyOtp);

// Login User
router.post('/login', userController.loginUser);

// Forgot Password (Send OTP)
router.post('/forgot-password', userController.forgotPassword);

// Reset Password
router.put('/reset-password', userController.resetPassword);

// Update User Profile (Requires Token and OTP)
router.put('/profile', userController.updateProfile);

// Request OTP (To Perform Sensitive Actions Like Profile Update)
router.post('/request-otp', userController.requestOtp);

// Get user
router.get('/:id', userController.getUser);
module.exports = router;
