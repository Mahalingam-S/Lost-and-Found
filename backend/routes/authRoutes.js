const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/send-otp
router.post('/send-otp', authController.sendOTP);

// POST /api/auth/verify-otp
router.post('/verify-otp', authController.verifyOTP);

// GET /api/auth/me
router.get('/me', authMiddleware, authController.getMe);

// PUT /api/auth/profile
router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router;
