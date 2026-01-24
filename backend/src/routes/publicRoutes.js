const express = require('express');
const router = express.Router();

const PublicController = require('../controllers/PublicController');

// NOVO endpoint
router.post('/contact-request', PublicController.createContactRequest);

// antigos descontinuados
router.post('/request-appointment', (req, res) => {
  return res.status(410).json({ message: 'Endpoint descontinuado. Use POST /api/public/contact-request.' });
});

router.get('/available-slots', (req, res) => {
  return res.status(410).json({ message: 'Endpoint descontinuado.' });
});

module.exports = router;
