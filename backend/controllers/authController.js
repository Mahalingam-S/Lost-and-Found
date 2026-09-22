const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');
const { sendSMS, isRealSmsConfigured } = require('../services/smsService');

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
    // Generate dynamic 6-digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(cleanPhone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    console.log(`[OTP GENERATED] Phone: ${cleanPhone} -> OTP: ${otp}`);

    // Dispatch SMS via real SMS Gateway
    await sendSMS(cleanPhone, otp);

    const realSmsActive = isRealSmsConfigured();

    const responsePayload = {
      success: true,
      message: realSmsActive ? 'Verification code sent to your mobile phone via SMS' : 'OTP sent successfully',
      isRealSms: realSmsActive
    };

    // Only include demoOtp if real SMS gateway is not active (sandbox/dev mode)
    if (!realSmsActive) {
      responsePayload.demoOtp = otp;
    }

    return res.status(200).json(responsePayload);
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
    const phoneDigits = cleanPhone.replace(/\D/g, '');
    const storedOtpData = otpStore.get(cleanPhone) || Array.from(otpStore.entries()).find(([k]) => k.replace(/\D/g, '') === phoneDigits)?.[1];

    // Allow 123456 as dev fallback or validate stored non-expired OTP
    const isValidStored = storedOtpData && storedOtpData.otp === otp && storedOtpData.expiresAt > Date.now();
    if (otp !== '123456' && !isValidStored) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    let user;
    if (getIsConnected()) {
      user = await User.findOne({
        $or: [
          { phone: cleanPhone },
          { phone: { $regex: phoneDigits.length >= 10 ? phoneDigits.slice(-10) : phoneDigits } }
        ]
      });
      if (!user) {
        user = await User.create({
          name: name || `Campus User (${phoneDigits.slice(-4) || '2026'})`,
          phone: cleanPhone,
          email: email || ''
        });
      } else if (name || email) {
        if (name) user.name = name;
        if (email) user.email = email;
        await user.save();
      }
    } else {
      const existingKey = Array.from(memoryUsers.keys()).find(k => k.replace(/\D/g, '') === phoneDigits || k === cleanPhone);
      if (existingKey) {
        user = memoryUsers.get(existingKey);
        if (name) user.name = name;
        if (email) user.email = email;
      } else {
        user = {
          _id: 'usr_' + Date.now() + Math.random().toString(36).substr(2, 4),
          name: name || `Campus User (${phoneDigits.slice(-4) || '2026'})`,
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

    const phoneDigits = (phone || '').replace(/\D/g, '');

    if (getIsConnected() && userId && userId !== 'usr_demo_active') {
      user = await User.findById(userId);
    }

    if (!user) {
      user = Array.from(memoryUsers.values()).find(u =>
        u._id === userId ||
        u.phone === phone ||
        (phoneDigits && u.phone && u.phone.replace(/\D/g, '') === phoneDigits)
      );
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
    if (getIsConnected() && userId && userId !== 'usr_demo_active') {
      user = await User.findByIdAndUpdate(userId, { name, email }, { new: true });
    }

    const phoneDigits = (phone || '').replace(/\D/g, '');
    const foundEntry = Array.from(memoryUsers.entries()).find(([k, v]) =>
      v._id === userId ||
      (phoneDigits && (k.replace(/\D/g, '') === phoneDigits || (v.phone && v.phone.replace(/\D/g, '') === phoneDigits)))
    );

    if (foundEntry) {
      const memoryUser = foundEntry[1];
      if (name) memoryUser.name = name;
      if (email) memoryUser.email = email;
      if (!user) user = memoryUser;
    } else if (!user) {
      user = {
        _id: userId || 'usr_' + Date.now(),
        name: name || 'Campus Student',
        phone: phone || '',
        email: email || ''
      };
      if (phone) memoryUsers.set(phone, user);
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.memoryUsers = memoryUsers;
