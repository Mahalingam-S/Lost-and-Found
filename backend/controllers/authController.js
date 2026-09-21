const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');

// In-memory user store fallback
const memoryUsers = new Map();
const otpStore = new Map();

const JWT_SECRET = process.env.JWT_SECRET || 'campus_lost_found_secret_key_2026_jwt';

// POST /api/auth/send-otp
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }

    const cleanPhone = phone.trim();
    // Static demo OTP: 123456
    const otp = '123456';
    otpStore.set(cleanPhone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    console.log(`[OTP SENT] Phone: ${cleanPhone} -> OTP: ${otp}`);
    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      demoOtp: otp
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/verify-otp
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp, name, email } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone and OTP are required' });
    }

    const cleanPhone = phone.trim();
    const storedOtpData = otpStore.get(cleanPhone);

    // Allow 123456 or stored OTP for easy testing
    if (otp !== '123456' && (!storedOtpData || storedOtpData.otp !== otp)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    let user;
    if (getIsConnected()) {
      user = await User.findOne({ phone: cleanPhone });
      if (!user) {
        user = await User.create({
          name: name || `Campus User (${cleanPhone.slice(-4)})`,
          phone: cleanPhone,
          email: email || ''
        });
      }
    } else {
      if (memoryUsers.has(cleanPhone)) {
        user = memoryUsers.get(cleanPhone);
      } else {
        user = {
          _id: 'usr_' + Date.now() + Math.random().toString(36).substr(2, 4),
          name: name || `Campus User (${cleanPhone.slice(-4)})`,
          phone: cleanPhone,
          email: email || '',
          createdAt: new Date()
        };
        memoryUsers.set(cleanPhone, user);
      }
    }

    const token = jwt.sign(
      { userId: user._id, phone: user.phone, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const { userId, phone } = req.user;
    let user;

    if (getIsConnected()) {
      user = await User.findById(userId);
    } else {
      user = Array.from(memoryUsers.values()).find(u => u._id === userId || u.phone === phone);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { userId, phone } = req.user;
    const { name, email } = req.body;

    let user;
    if (getIsConnected()) {
      user = await User.findByIdAndUpdate(userId, { name, email }, { new: true });
    } else {
      user = Array.from(memoryUsers.values()).find(u => u._id === userId || u.phone === phone);
      if (user) {
        if (name) user.name = name;
        if (email) user.email = email;
      }
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.memoryUsers = memoryUsers;
