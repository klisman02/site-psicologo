-- Tabela para armazenar os agendamentos e a disponibilidade do psicólogo.
-- O psicólogo insere a disponibilidade e o paciente solicita um desses slots.

CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    
    -- ID do usuário (psicólogo) responsável por esta disponibilidade
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    
    -- ID do paciente (se o agendamento for confirmado/relacionado a um paciente existente)
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Data e hora da consulta
    appointment_time TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Status do agendamento:
    -- 'AVAILABLE': Slot definido pelo psicólogo, pronto para ser agendado (Default)
    -- 'PENDING': Paciente solicitou o horário, aguardando confirmação do psicólogo
    -- 'CONFIRMED': Consulta agendada
    -- 'CANCELLED': Consulta cancelada
    -- 'COMPLETED': Consulta realizada
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    
    -- Dados do paciente que fez a solicitação (se 'status' for PENDING)
    requested_full_name VARCHAR(100),
    requested_contact_phone VARCHAR(50),
    requested_whatsapp VARCHAR(50),
    requested_initial_complaint TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar um índice para buscas rápidas pela disponibilidade do psicólogo
CREATE INDEX idx_appointments_user_id_time ON appointments (user_id, appointment_time);

-- Criar um índice para busca rápida de solicitações pendentes
CREATE INDEX idx_appointments_status ON appointments (status);