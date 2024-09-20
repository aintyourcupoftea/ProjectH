const express = require('express');
const User = require('./user');
const router = express.Router();

// Store OTPs in-memory with expiry time
const otpStore = {};

// Helper function to generate random OTP
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
}

// Helper function to send OTP (simulated here)
function sendOTP(phone, otp) {
    console.log(`OTP sent to ${phone}: ${otp}`);
}

// Route to authenticate user
router.post('/', async (req, res) => {
    const { phone, otp, name } = req.body;

    // Check if the phone number starts with 0
    if (!/^[1-9]/.test(phone)) {
        return res.status(400).json({ message: 'Phone number cannot start with 0.' });
    }

    // Check if the phone number is exactly 10 digits
    if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ message: 'Phone number must be exactly 10 digits.' });
    }

    try {
        // Step 1: Phone provided, generate OTP
        if (phone && !otp && !name) {
            let user = await User.findOne({ phone });

            if (!user) {
                user = new User({ phone });
            }

            const generatedOTP = generateOTP();
            otpStore[phone] = {
                otp: generatedOTP,
                expiresAt: Date.now() + 5 * 60 * 1000  // Store OTP with expiry time (5 minutes)
            };

            sendOTP(phone, generatedOTP);  // Send OTP to user

            return res.status(200).json({ message: 'OTP sent to your phone.' });
        }

        // Step 2: OTP verification
        if (phone && otp && !name) {
            const storedOTPData = otpStore[phone];

            // Check if OTP is expired or not found
            if (!storedOTPData || storedOTPData.expiresAt < Date.now()) {
                return res.status(400).json({ message: 'OTP expired or invalid.' });
            }

            // Check if OTP matches
            if (storedOTPData.otp !== otp) {
                return res.status(400).json({ message: 'Invalid OTP.' });
            }

            // OTP is valid, check if user has a name (exists in DB)
            const user = await User.findOne({ phone });

            if (user && user.name) {
                return res.status(200).json({ message: 'OTP verified. Redirect to dashboard.' });
            } else {
                return res.status(200).json({ message: 'OTP verified. Please provide your name.' });
            }
        }

        // Step 3: Name provided, register new user
        if (phone && otp && name) {
            const storedOTPData = otpStore[phone];

            // Check if OTP is expired or not found before registering
            if (!storedOTPData || storedOTPData.expiresAt < Date.now()) {
                return res.status(400).json({ message: 'OTP expired or invalid. Please request a new one.' });
            }

            // If OTP is valid, register or update user
            let user = await User.findOne({ phone });

            if (!user) {
                // Create new user if they don't exist
                user = new User({ phone, name });
                await user.save();
            } else {
                // Update existing user's name if it's missing
                user.name = name;
                await user.save();
            }

            return res.status(201).json({ message: 'User registered successfully. Redirect to dashboard.' });
        }

        // If request doesn't match any of the expected inputs
        return res.status(400).json({ message: 'Invalid request.' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;