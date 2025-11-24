const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/AppointmentController');

// ====================================================================
// ROTAS PÚBLICAS (Mapeadas para /api/public)
// ====================================================================

// GET /api/public/available-slots - Lista horários disponíveis para o paciente escolher
router.get('/available-slots', AppointmentController.getPublicAvailableSlots);

// POST /api/public/request-appointment - Paciente envia os dados de inscrição para um horário
router.post('/request-appointment', AppointmentController.requestPublicAppointment);


module.exports = router;