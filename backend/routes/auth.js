const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'pashu_secret_key';

// Mock OTP storage (In production, use Redis or database)
const otpStorage = new Map();

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP (Mock implementation)
const sendOTP = async (phoneNumber, otp) => {
  // In production, integrate with SMS service like Twilio, AWS SNS, etc.
  console.log(`📱 Sending OTP ${otp} to ${phoneNumber}`);
  return true;
};

// Aadhaar Authentication
router.post('/aadhaar-login', async (req, res) => {
  try {
    const { aadhaarNumber } = req.body;

    // Validate Aadhaar number
    if (!aadhaarNumber || !/^[0-9]{12}$/.test(aadhaarNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Valid 12-digit Aadhaar number required'
      });
    }

    // Mock Aadhaar verification (In production, integrate with UIDAI API)
    setTimeout(async () => {
      try {
        let user = await User.findOne({ aadhaar: aadhaarNumber });

        if (!user) {
          // Create new user if not exists
          user = new User({
            name: 'New Farmer', // In production, get from Aadhaar API
            aadhaar: aadhaarNumber,
            phone: '9876543210', // Mock phone
            state: 'Haryana',
            district: 'Gurgaon',
            isVerified: true
          });
          await user.save();
        }

        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
          success: true,
          message: 'Aadhaar authentication successful',
          user: {
            id: user._id,
            name: user.name,
            phone: user.phone,
            aadhaar: user.aadhaar,
            state: user.state,
            district: user.district
          },
          token: token
        });

      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Authentication failed',
          error: error.message
        });
      }
    }, 2000);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
});

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Validate phone number
    if (!phoneNumber || !/^[0-9]{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Valid 10-digit phone number required'
      });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP
    otpStorage.set(phoneNumber, { otp, expiresAt });

    // Send OTP
    await sendOTP(phoneNumber, otp);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      expiresIn: 300 // 5 minutes in seconds
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: error.message
    });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // Validate input
    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP required'
      });
    }

    // Check stored OTP
    const storedOTPData = otpStorage.get(phoneNumber);
    if (!storedOTPData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    // Check expiry
    if (new Date() > storedOTPData.expiresAt) {
      otpStorage.delete(phoneNumber);
      return res.status(400).json({
        success: false,
        message: 'OTP expired'
      });
    }

    // Verify OTP
    if (otp !== storedOTPData.otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Remove used OTP
    otpStorage.delete(phoneNumber);

    // Find or create user
    let user = await User.findOne({ phone: phoneNumber });
    if (!user) {
      user = new User({
        name: 'New Farmer',
        phone: phoneNumber,
        state: 'Punjab',
        district: 'Ludhiana',
        isVerified: true
      });
      await user.save();
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'OTP verification successful',
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        state: user.state,
        district: user.district
      },
      token: token
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'OTP verification failed',
      error: error.message
    });
  }
});

module.exports = router;