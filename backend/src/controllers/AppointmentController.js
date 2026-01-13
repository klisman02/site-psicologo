const AppointmentModel = require('../models/AppointmentModel');

// O Id deve vir da sessão do psicólogo, mas para testes, usamos um fixo
const TEST_USER_ID = 1; 

// ====================================================================
// ROTAS DO PSICÓLOGO (Protegidas)
// ====================================================================

// POST /api/appointments/slot
const createSlot = async (req, res) => {
    const userId = TEST_USER_ID; // Simulação de usuário logado
    const { appointment_time } = req.body;

    if (!appointment_time) {
        return res.status(400).json({ message: 'A data e hora do agendamento são obrigatórias.' });
    }

    try {
        const newSlot = await AppointmentModel.createAvailableSlot(appointment_time, userId);
        return res.status(201).json({ 
            message: 'Slot de disponibilidade criado com sucesso.', 
            slot: newSlot 
        });
    } catch (error) {
        console.error("Erro ao criar slot de agendamento:", error);
        return res.status(500).json({ message: 'Erro interno ao criar slot.' });
    }
};

// GET /api/appointments
const getAllAppointments = async (req, res) => {
    const userId = TEST_USER_ID; // Simulação de usuário logado

    try {
        const appointments = await AppointmentModel.getAllAppointmentsByUserId(userId);
        return res.status(200).json(appointments);
    } catch (error) {
        console.error("Erro ao listar agendamentos:", error);
        return res.status(500).json({ message: 'Erro interno ao listar agendamentos.' });
    }
};

// PUT/POST /api/appointments/:id/status
const updateAppointment = async (req, res) => {
    // -------------------------------------------------------------------
    // PASSO 1: VERIFICAR SE O BODY EXISTE E SE NÃO É VAZIO
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Corpo da requisição (JSON Body) ausente ou mal formatado. Verifique se o Body Type no Insomnia está configurado para JSON.' });
    }
    // -------------------------------------------------------------------
    
    const userId = TEST_USER_ID; // Simulação de usuário logado
    const { id } = req.params;
    const { status, patient_id } = req.body;
    const validStatuses = ['CONFIRMED', 'CANCELLED', 'AVAILABLE', 'COMPLETED'];

    // PASSO 2: VERIFICAR O STATUS E INCLUIR O DIAGNÓSTICO
    if (!status || !validStatuses.includes(status.toUpperCase())) {
        return res.status(400).json({ 
            message: 'Status inválido ou não fornecido. O status deve ser: CONFIRMED, CANCELLED, AVAILABLE ou COMPLETED.',
            received_status: status, // ESSA LINHA É O DIAGNÓSTICO FINAL!
            received_body_keys: Object.keys(req.body) // Diagnóstico extra para ver as chaves enviadas
        });
    }

    try {
        const updatedAppointment = await AppointmentModel.updateAppointmentStatus(
            id, 
            userId, 
            status.toUpperCase(), 
            patient_id // patient_id é obrigatório se o status for CONFIRMED
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Agendamento não encontrado ou não pertence a este usuário.' });
        }

        return res.status(200).json({
            message: `Status do agendamento atualizado para ${status.toUpperCase()}.`,
            appointment: updatedAppointment
        });
    } catch (error) {
        console.error("Erro ao atualizar agendamento:", error);
        return res.status(500).json({ message: 'Erro interno ao atualizar agendamento.' });
    }
};

// ====================================================================
// ROTAS DO PACIENTE (Públicas)
// ====================================================================

// GET /api/public/available-slots
// const getPublicAvailableSlots = async (req, res) => {
//     try {
//         const slots = await AppointmentModel.getAvailableSlots();
//         return res.status(200).json(slots);
//     } catch (error) {
//         console.error("Erro ao listar slots públicos:", error);
//         return res.status(500).json({ message: 'Erro interno ao listar horários disponíveis.' });
//     }
// };

// POST /api/public/request-appointment
const requestPublicAppointment = async (req, res) => {
    const { 
        appointment_id, 
        full_name, 
        contact_phone, 
        whatsapp, 
        initial_complaint 
    } = req.body;

    if (!appointment_id || !full_name || !contact_phone || !initial_complaint) {
        return res.status(400).json({ message: 'Agendamento, nome, telefone e queixa inicial são obrigatórios.' });
    }

    try {
        const pendingAppointment = await AppointmentModel.requestAppointment(
            appointment_id, 
            full_name, 
            contact_phone, 
            whatsapp, 
            initial_complaint
        );

        if (!pendingAppointment) {
            // Isso acontece se o ID não existe ou se já foi agendado por outra pessoa
            return res.status(409).json({ message: 'Horário indisponível ou já foi solicitado.' });
        }

        return res.status(202).json({
            message: 'Solicitação de agendamento enviada com sucesso! Aguarde a confirmação do psicólogo.',
            appointment: pendingAppointment
        });
    } catch (error) {
        console.error("Erro ao solicitar agendamento:", error);
        return res.status(500).json({ message: 'Erro interno ao processar solicitação.' });
    }
};

module.exports = {
    createSlot,
    getAllAppointments,
    updateAppointment, 
    getPublicAvailableSlots,
    requestPublicAppointment,
};