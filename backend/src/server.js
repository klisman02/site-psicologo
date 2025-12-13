// 1. Configuração Inicial e Importações
require('dotenv').config(); // Carrega as variáveis do .env
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Importa a biblioteca do PostgreSQL

const app = express();
const PORT = process.env.PORT || 3001; 

// Importa as rotas de Paciente e Agendamento
const patientRoutes = require('./routes/PatientRoutes'); 
const appointmentRoutes = require('./routes/AppointmentRoutes'); // Rotas Protegidas (Psicólogo)
const publicRoutes = require('./routes/publicRoutes'); // Rotas Públicas (Paciente)

const path = require('path');

// arquivos estáticos (HTML, CSS, JS, imagens)
app.use(express.static(path.join(__dirname, 'public')));


// 2. Middlewares
app.use(cors()); 
app.use(express.json()); 

// 3. Configuração do Pool de Conexão com o PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // ... (configurações de SSL omitidas por brevidade)
});

// 4. Integração das Rotas
app.use('/api/patients', patientRoutes);

// ✅ Mapeamento CORRETO para Agendamentos (Psicólogo)
console.log("Mapeando /api/appointments..."); 
app.use('/api/appointments', appointmentRoutes); 

// ✅ Mapeamento CORRETO para Rotas Públicas (Paciente)
app.use('/api/public', publicRoutes);


// 5. Rota de Teste (Health Check)
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'API do Psicólogo online!',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 6. Rota de Teste de Conexão com o Banco de Dados
app.get('/db-test', async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1'); 
    client.release(); 
    
    res.status(200).json({ 
      message: 'Conexão com PostgreSQL estabelecida com sucesso!' 
    });
  } catch (error) {
    console.error('Erro ao conectar ao PostgreSQL:', error.message);
    res.status(500).json({ 
      message: 'Falha na conexão com o Banco de Dados.',
      error: error.message 
    });
  }
});


// 7. Iniciar o Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`Testar API em: http://localhost:${PORT}/`);
  console.log(`Testar DB em: http://localhost:${PORT}/db-test`);
});
