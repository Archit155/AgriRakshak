const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google OAuth users
  googleId: { type: String, unique: true, sparse: true },
  role: { 
    type: String, 
    enum: ['farmer_small', 'farmer_large', 'dealer', 'unassigned'],
    default: 'unassigned'
  },
  interests: [{ type: String }],
  isOnboarded: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
