// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // Otp model is no longer needed
const generateToken = require('../utils/generateToken'); // sendSMS/sendEmail/otpGenerator are no longer needed

// @desc    Register a new user (Direct Registration - No OTP)
// @route   POST /api/users
// @access  Public
router.post(
    '/', // Changed route from '/register-with-otp' or '/request-register-otp'
    asyncHandler(async (req, res) => {
        const { username, email, password } = req.body; // Expecting username, email, password

        // Basic validation
        if (!username || !email || !password) {
            res.status(400);
            throw new Error('Please enter all required fields: username, email, and password');
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User with this email already exists');
        }

        // Create the new user
        const user = await User.create({
            username,
            email,
            password, // Password will be hashed by the pre-save hook in User model
        });

        if (user) {
            res.status(201).json({ // Created
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    })
);

// @desc    Auth user & get token (Standard Email/Password Login)
// @route   POST /api/users/login
// @access  Public
router.post(
    '/login',
    asyncHandler(async (req, res) => {
        const { email, password } = req.body; // Expecting email and password

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401); // Unauthorized
            throw new Error('Invalid email or password');
        }
    })
);

// All OTP-related routes like /request-register-otp, /register-with-otp, /request-otp, /verify-otp-login are removed.

module.exports = router;