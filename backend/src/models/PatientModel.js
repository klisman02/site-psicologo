const db = require('./db');

// Insere um novo paciente no banco de dados
const createPatient = async (fullName, dateOfBirth, contactPhone, initialComplaint, userId) => {
  const query = `
    INSERT INTO patients (full_name, date_of_birth, contact_phone, initial_complaint, user_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, full_name, created_at, is_active
  `;
  const values = [fullName, dateOfBirth, contactPhone, initialComplaint, userId];
  
  const { rows } = await db.query(query, values);
  return rows[0];
};

// Lista todos os pacientes de um usuário específico
const getAllPatients = async (userId) => {
  const query = `
    SELECT id, full_name, date_of_birth, contact_phone, 
           initial_complaint, created_at, is_active
    FROM patients 
    WHERE user_id = $1 AND is_active = true
    ORDER BY full_name ASC
  `;
  const values = [userId];
  
  const { rows } = await db.query(query, values);
  return rows;
};

// Busca um paciente específico por ID
const getPatientById = async (patientId, userId) => {
  const query = `
    SELECT id, full_name, date_of_birth, contact_phone, 
           initial_complaint, created_at, is_active
    FROM patients 
    WHERE id = $1 AND user_id = $2 AND is_active = true
  `;
  const values = [patientId, userId];
  
  const { rows } = await db.query(query, values);
  return rows[0];
};

// Atualiza os dados de um paciente
const updatePatient = async (id, fullName, dateOfBirth, contactPhone, initialComplaint, isActive, userId) => {
  const query = `
    UPDATE patients 
    SET full_name = $1, 
        date_of_birth = $2, 
        contact_phone = $3, 
        initial_complaint = $4,
        is_active = $5,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $6 AND user_id = $7
    RETURNING id, full_name, date_of_birth, contact_phone, initial_complaint, is_active
  `;
  const values = [fullName, dateOfBirth, contactPhone, initialComplaint, isActive, id, userId];
  
  const { rows } = await db.query(query, values);
  return rows[0];
};

// "Deleta" um paciente (soft delete - apenas marca como inativo)
const deletePatient = async (id, userId) => {
  const query = `
    UPDATE patients 
    SET is_active = false, 
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND user_id = $2 AND is_active = true
    RETURNING id
  `;
  const values = [id, userId];
  
  const { rows } = await db.query(query, values);
  return rows.length > 0;
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient
};