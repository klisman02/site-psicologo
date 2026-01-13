const db = require('./db');

// ====================================================================
// FUNÇÕES PARA O PSICÓLOGO (Acesso Protegido)
// ====================================================================

/**
 * Cria um novo slot de disponibilidade (status 'AVAILABLE').
 * @param {Date} appointmentTime Data e hora do slot.
 * @param {number} userId ID do psicólogo.
 * @returns {Object} O novo agendamento criado.
 */
const createAvailableSlot = async (appointmentTime, userId) => {
    const query = `
        INSERT INTO appointments (user_id, appointment_time, status)
        VALUES ($1, $2, 'AVAILABLE')
        RETURNING *
    `;
    const values = [userId, appointmentTime];
    
    const { rows } = await db.query(query, values);
    return rows[0];
};

/**
 * Lista todos os agendamentos de um psicólogo, incluindo PENDENTES e CONFIRMADOS.
 * @param {number} userId ID do psicólogo.
 * @returns {Array} Lista de agendamentos.
 */
const getAllAppointmentsByUserId = async (userId) => {
    const query = `
        SELECT 
            a.id, 
            a.appointment_time, 
            a.status, 
            a.patient_id,
            a.requested_full_name,
            a.requested_contact_phone,
            a.requested_whatsapp,
            a.requested_initial_complaint,
            p.full_name AS patient_name -- Pega o nome do paciente se já for um registro existente
        FROM appointments a
        LEFT JOIN patients p ON a.patient_id = p.id
        WHERE a.user_id = $1
        ORDER BY a.appointment_time ASC
    `;
    const values = [userId];
    
    const { rows } = await db.query(query, values);
    return rows;
};

/**
 * Atualiza o status de um agendamento (usado pelo psicólogo para CONFIRMAR/CANCELAR).
 * @param {number} appointmentId ID do agendamento.
 * @param {number} userId ID do psicólogo (para segurança).
 * @param {string} newStatus Novo status ('CONFIRMED', 'CANCELLED', etc.).
 * @param {number | null} patientId Opcional: ID do paciente se o status for CONFIRMED.
 * @returns {Object | null} O agendamento atualizado ou null se não encontrado.
 */
const updateAppointmentStatus = async (appointmentId, userId, newStatus, patientId = null) => {
    const query = `
        UPDATE appointments 
        SET 
            status = $1, 
            patient_id = $2, -- Pode ser null se estiver cancelando/pendente
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3 AND user_id = $4
        RETURNING *
    `;
    // Se o status for CONFIRMED, garantimos que patientId é o ID correto do paciente.
    // Em outros casos (CANCELLED, AVAILABLE), patientId deve ser null ou o valor existente.
    const finalPatientId = (newStatus === 'CONFIRMED' && patientId) ? patientId : null;

    const values = [newStatus, finalPatientId, appointmentId, userId];
    
    const { rows } = await db.query(query, values);
    return rows[0];
};

// ====================================================================
// FUNÇÕES PARA O PACIENTE (Acesso Público/Anônimo)
// ====================================================================

/**
 * Lista todos os slots 'AVAILABLE' (disponíveis) para que o paciente escolha.
 * @returns {Array} Slots disponíveis que ainda não passaram.
 */
// const getAvailableSlots = async () => {
//     const query = `
//         SELECT id, appointment_time
//         FROM appointments 
//         WHERE status = 'AVAILABLE' AND appointment_time > NOW()
//         ORDER BY appointment_time ASC
//     `;
//     // Não precisa de user_id aqui, pois queremos todos os horários disponíveis
//     const { rows } = await db.query(query);
//     return rows;
// };

/**
 * Paciente solicita um agendamento, preenchendo os dados e mudando o status para 'PENDING'.
 * @param {number} appointmentId ID do slot disponível.
 * @param {string} fullName Nome completo do solicitante.
 * @param {string} contactPhone Telefone.
 * @param {string} whatsapp WhatsApp.
 * @param {string} initialComplaint Queixa inicial.
 * @returns {Object | null} O agendamento atualizado para PENDING.
 */
// const requestAppointment = async (appointmentId, fullName, contactPhone, whatsapp, initialComplaint) => {
//     const query = `
//         UPDATE appointments 
//         SET 
//             status = 'PENDING', 
//             requested_full_name = $1,
//             requested_contact_phone = $2,
//             requested_whatsapp = $3,
//             requested_initial_complaint = $4,
//             updated_at = CURRENT_TIMESTAMP
//         WHERE id = $5 AND status = 'AVAILABLE' -- Apenas slots DISPONÍVEIS podem ser solicitados
//         RETURNING *
//     `;
//     const values = [
//         fullName, 
//         contactPhone, 
//         whatsapp, 
//         initialComplaint, 
//         appointmentId
//     ];
    
//     const { rows } = await db.query(query, values);
//     return rows[0];
// };

module.exports = {
    createAvailableSlot,
    getAllAppointmentsByUserId,
    updateAppointmentStatus,
    getAvailableSlots,
    requestAppointment,
};