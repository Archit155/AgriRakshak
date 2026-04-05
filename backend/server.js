const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const schemeRoutes = require('./routes/schemeRoutes');
const authRoutes = require('./routes/authRoutes');
const voiceRoutes = require('./routes/voiceRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/krishi_portal';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', schemeRoutes);
app.use('/api/voice', voiceRoutes);

// Database connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));
