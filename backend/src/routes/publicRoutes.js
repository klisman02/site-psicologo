const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/AppointmentController');

// ====================================================================
// ROTAS PÚBLICAS (Mapeadas para /api/public)
// ====================================================================


// POST /api/public/request-appointment - Paciente envia os dados de inscrição para um horário
router.post('/request-appointment', AppointmentController.requestPublicAppointment);


module.exports = router;