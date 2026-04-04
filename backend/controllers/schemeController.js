const Scheme = require('../models/Scheme');

// GET /schemes
const getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find({});
    res.status(200).json(schemes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /schemes/:id
const getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
    res.status(200).json(scheme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /search?q=
const searchSchemes = async (req, res) => {
  const { q } = req.query;
  try {
    const schemes = await Scheme.find({
      name: { $regex: q, $options: 'i' }
    });
    res.status(200).json(schemes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /filter?category=
const filterSchemes = async (req, res) => {
  const { category } = req.query;
  try {
    const filter = category && category !== 'all' ? { category: { $regex: new RegExp(`^${category}$`, 'i') } } : {};
    const schemes = await Scheme.find(filter);
    res.status(200).json(schemes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSchemes,
  getSchemeById,
  searchSchemes,
  filterSchemes
};
