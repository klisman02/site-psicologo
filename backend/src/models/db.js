require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// A função query será usada em todos os modelos para executar comandos SQL
// Exporta uma função que qualquer Model pode usar para interagir com o DB
module.exports = {
  // text: comando SQL, params: array de valores para substituição ($1, $2...)
  query: (text, params) => pool.query(text, params),
};
