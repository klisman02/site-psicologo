const PatientModel = require('../models/PatientModel');

// ATENÇÃO: Em um sistema real, o userId viria da SESSÃO/JWT do psicólogo logado
// Por enquanto, vamos usar um userId fixo (1) para todos os testes.
const TEST_USER_ID = 1; 

// --------------------------------------------------
// POST /api/patients
// --------------------------------------------------
const createPatient = async (req, res) => {
  const userId = TEST_USER_ID;
  
  const { full_name, birth_date, contact_phone, initial_complaint } = req.body;

  if (!full_name || !initial_complaint) {
    return res.status(400).json({ message: 'Nome completo e queixa inicial são obrigatórios.' });
  }

  try {
    const newPatient = await PatientModel.createPatient(
      full_name,
      birth_date,
      contact_phone,
      initial_complaint,
      userId
    );
    
    return res.status(201).json({ 
      message: 'Paciente cadastrado com sucesso.',
      patient: newPatient
    });
  } catch (error) {
    console.error("Erro ao cadastrar paciente:", error);
    return res.status(500).json({ message: 'Erro interno ao cadastrar paciente.' });
  }
};

// --------------------------------------------------
// GET /api/patients
// --------------------------------------------------
const getAllPatients = async (req, res) => {
  const userId = TEST_USER_ID;

  try {
    const patients = await PatientModel.getAllPatients(userId);
    return res.status(200).json(patients);
  } catch (error) {
    console.error("Erro ao listar pacientes:", error);
    return res.status(500).json({ message: 'Erro interno ao listar pacientes.' });
  }
};

// --------------------------------------------------
// GET /api/patients/:id
// --------------------------------------------------
const getPatientById = async (req, res) => {
  const userId = TEST_USER_ID;
  const { id } = req.params;

  try {
    const patient = await PatientModel.getPatientById(id, userId);

    if (!patient) {
      return res.status(404).json({ message: 'Paciente não encontrado.' });
    }
    
    return res.status(200).json(patient);
  } catch (error) {
    console.error("Erro ao buscar paciente:", error);
    return res.status(500).json({ message: 'Erro interno ao buscar paciente.' });
  }
};

// --------------------------------------------------
// PUT /api/patients/:id
// --------------------------------------------------
const updatePatient = async (req, res) => {
  const userId = TEST_USER_ID;
  const { id } = req.params;
  const { full_name, birth_date, contact_phone, initial_complaint, is_active } = req.body;

  // Validação básica
  if (!full_name || !initial_complaint) {
    return res.status(400).json({ message: 'Nome e queixa inicial são obrigatórios para atualização.' });
  }

  try {
    const updatedPatient = await PatientModel.updatePatient(
      id,
      full_name,
      birth_date,
      contact_phone,
      initial_complaint,
      is_active,
      userId
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Paciente não encontrado ou não pertence a este usuário.' });
    }

    return res.status(200).json({
      message: 'Paciente atualizado com sucesso.',
      patient: updatedPatient
    });
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error);
    return res.status(500).json({ message: 'Erro interno ao atualizar paciente.' });
  }
};

// --------------------------------------------------
// DELETE /api/patients/:id
// --------------------------------------------------
const deletePatient = async (req, res) => {
  const userId = TEST_USER_ID;
  const { id } = req.params;

  try {
    const success = await PatientModel.deletePatient(id, userId);

    if (!success) {
      return res.status(404).json({ message: 'Paciente não encontrado ou não pertence a este usuário.' });
    }

    // Retorna 204 No Content para exclusão bem-sucedida
    return res.status(204).send(); 
  } catch (error) {
    console.error("Erro ao deletar paciente:", error);
    return res.status(500).json({ message: 'Erro interno ao deletar paciente.' });
  }
};

module.exports = {
  createPatient,
  getAllPatients, 
  getPatientById,
  updatePatient,
  deletePatient,
};
