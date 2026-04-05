const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voiceController');

// Route to initialize a Retell web call agent session
// SECURITY: Our system trusts nothing by default. 
// Requires authentication in more complex scenarios.
router.post('/web-call', voiceController.createWebCall);

module.exports = router;
