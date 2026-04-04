const mongoose = require('mongoose');
require('dotenv').config();
const Scheme = require('./models/Scheme');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/krishi_portal';

const sampleSchemes = [
  {
    name: 'प्रधान मंत्री किसान सम्मान निधि (PM-KISAN)',
    category: 'subsidy',
    description: 'Under the scheme an income support of 6,000/- per year in three equal installments will be provided to all land holding farmer families.',
    benefits: '₹6,000 per year transferred directly to the bank accounts of farmer families.',
    eligibility: 'All landholding farmers families, subject to certain exclusion criteria related to higher income status.',
    documents: ['Aadhaar Card', 'Bank Account Details', 'Land Holding Papers']
  },
  {
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    category: 'insurance',
    description: 'A crop insurance scheme that integrates multiple stakeholders on a single platform to provide insurance coverage and financial support to farmers in the event of failure of any of the notified crops as a result of natural calamities, pests & diseases.',
    benefits: 'Comprehensive risk insurance to cover yield losses from pre-sowing to post-harvest.',
    eligibility: 'All farmers growing notified crops in a notified area during the season who have insurable interest in the crop.',
    documents: ['Aadhaar Card', 'Land Records', 'Sowing Certificate']
  },
  {
    name: 'Soil Health Card Scheme',
    category: 'soil',
    description: 'A scheme to promote soil test based nutrient management. Soil health cards are issued to farmers detailing the status of soil and recommendations on correct dosage of nutrients.',
    benefits: 'Reduces cost of farming by avoiding over-use of fertilizers. Increases yield through optimal nutrient management.',
    eligibility: 'All farmers are eligible.',
    documents: ['Aadhaar Card', 'Land Records']
  },
  {
    name: 'Kisan Credit Card (KCC)',
    category: 'loan',
    description: 'Provides adequate and timely credit support from the banking system under a single window to the farmers for their cultivation and other needs.',
    benefits: 'Credit to meet the short term credit requirements for cultivation of crops, post-harvest expenses, produce marketing loan, etc.',
    eligibility: 'All Farmers - Individuals / Joint borrowers who are owner cultivators, Tenant Farmers, Oral Lessees & Share Croppers.',
    documents: ['Aadhaar Card', 'PAN Card', 'Land Documents', 'Recent Passport Size Photograph']
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await Scheme.deleteMany({});
    console.log('Cleared existing schemes');
    await Scheme.insertMany(sampleSchemes);
    console.log('Successfully seeded database with schemes!');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    mongoose.connection.close();
  });
