const Retell = require('retell-sdk');
require('dotenv').config();

const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY,
});

exports.createWebCall = async (req, res) => {
  try {
    // SECURITY COMPLIANCE: Our system trusts nothing by default.
    // Ensure agent_id is provided or use a safe default from config
    const agentId = req.body.agent_id || 'agent_c645b41efc5e49cddf3cc089c9';
    
    console.log(`Creating web call for Retell Agent: ${agentId}`);

    const callResponse = await retellClient.call.createWebCall({
      agent_id: agentId,
    });

    // Extract access_token to send to frontend
    res.status(201).json({
      access_token: callResponse.access_token,
      call_id: callResponse.call_id,
      status: 'success'
    });

  } catch (error) {
    console.error('Error creating Retell web call:', error);
    res.status(500).json({ 
      error: 'Failed to initialize voice session.',
      detail: error.message 
    });
  }
};
