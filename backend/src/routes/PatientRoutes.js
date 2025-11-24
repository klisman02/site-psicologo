const express = require('express');
const router = express.Router();

// O controller está em /backend/src/controllers
const PatientController = require('../controllers/PatientController');

// --------------------------------------------------
// Rotas CRUD de Pacientes (Prefixadas com /api/patients)
// --------------------------------------------------

// POST /api/patients - Cadastra um novo paciente
router.post('/', PatientController.createPatient);

// GET /api/patients - Lista todos os pacientes
router.get('/', PatientController.getAllPatients);

// GET /api/patients/:id - Busca um paciente específico
router.get('/:id', PatientController.getPatientById);

// PUT /api/patients/:id - Atualiza um paciente
router.put('/:id', PatientController.updatePatient);

// DELETE /api/patients/:id - Deleta um paciente
router.delete('/:id', PatientController.deletePatient);

module.exports = router;
