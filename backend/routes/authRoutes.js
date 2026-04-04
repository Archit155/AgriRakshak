const express = require('express');
const router = express.Router();
const { signup, login, getMe, updateOnboarding, googleAuth } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', authMiddleware, getMe);
router.put('/onboarding', authMiddleware, updateOnboarding);

module.exports = router;
