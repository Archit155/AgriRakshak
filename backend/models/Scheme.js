const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['insurance', 'subsidy', 'loan', 'soil', 'other'] 
  },
  description: { type: String, required: true },
  benefits: { type: String, required: true },
  eligibility: { type: String, required: true },
  documents: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Scheme', schemeSchema);
