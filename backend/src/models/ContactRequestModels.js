const db = require('./db');

const create = async ({ full_name, contact_phone, whatsapp, email, initial_complaint }) => {
  const query = `
    INSERT INTO contact_requests
      (full_name, contact_phone, whatsapp, email, initial_complaint)
    VALUES
      ($1, $2, $3, $4, $5)
    RETURNING id, full_name, contact_phone, whatsapp, email, initial_complaint, created_at
  `;

  const values = [full_name, contact_phone, whatsapp, email, initial_complaint];
  const { rows } = await db.query(query, values);
  return rows[0];
};

module.exports = { create };
