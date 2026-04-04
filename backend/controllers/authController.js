const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'secret_krishi_key';

const generateToken = (userId) => {
  return jwt.sign({ user: { id: userId } }, JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/signup
const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password });
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();
    
    const token = generateToken(user.id);
    res.status(201).json({ token, user: { _id: user.id, name, email, role: user.role, interests: user.interests, isOnboarded: user.isOnboarded } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const token = generateToken(user.id);
    res.status(200).json({ token, user: { _id: user.id, name: user.name, email: user.email, role: user.role, interests: user.interests, isOnboarded: user.isOnboarded } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/auth/onboarding
const updateOnboarding = async (req, res) => {
  const { role, interests } = req.body;
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role || user.role;
    user.interests = interests || user.interests;
    user.isOnboarded = true;
    
    await user.save();
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/auth/google
const googleAuth = async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      user = new User({
        name,
        email,
        googleId,
      });
      await user.save();
    }

    const token = generateToken(user.id);
    res.status(200).json({ 
      token, 
      user: { _id: user.id, name: user.name, email: user.email, role: user.role, interests: user.interests, isOnboarded: user.isOnboarded } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Google Authentication failed', error: error.message });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  updateOnboarding,
  googleAuth
};
