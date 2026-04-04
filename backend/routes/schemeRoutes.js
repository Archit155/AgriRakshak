const express = require('express');
const router = express.Router();
const {
  getAllSchemes,
  getSchemeById,
  searchSchemes,
  filterSchemes
} = require('../controllers/schemeController');

router.get('/schemes', getAllSchemes);
router.get('/schemes/search', searchSchemes); // Needs to be before /:id to prevent matching
router.get('/schemes/filter', filterSchemes); // Needs to be before /:id to prevent matching
router.get('/schemes/:id', getSchemeById);

module.exports = router;
