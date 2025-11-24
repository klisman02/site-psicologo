const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/AppointmentController');

// Mapeado em server.js como /api/appointments.
// Rotas internas: /slot, / e /:id/status

// POST /api/appointments/slot - Cria um novo slot de disponibilidade
router.post('/slot', AppointmentController.createSlot);

// GET /api/appointments - Lista todos os agendamentos do psicólogo (pendentes, confirmados, etc.)
router.get('/', AppointmentController.getAllAppointments);

// PUT /api/appointments/:id/status - Atualiza o status do agendamento (CONFIRMAR, CANCELAR)
// Este é o Teste 5 que estava dando 404
router.put('/:id/status', AppointmentController.updateAppointment); 

// POST /api/appointments/:id/status - Compatibilidade (se o PUT não for suportado)
router.post('/:id/status', AppointmentController.updateAppointment); 

module.exports = router;