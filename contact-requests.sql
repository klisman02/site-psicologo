CREATE TABLE IF NOT EXISTS contact_requests (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  email VARCHAR(150) NOT NULL,
  initial_complaint TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contact_requests_email ON contact_requests(email);
CREATE INDEX idx_contact_requests_created_at ON contact_requests(created_at); 
CREATE INDEX idx_contact_requests_full_name ON contact_requests(full_name);
CREATE INDEX idx_contact_requests_contact_phone ON contact_requests(contact_phone);
CREATE INDEX idx_contact_requests_whatsapp ON contact_requests(whatsapp);
CREATE INDEX idx_contact_requests_initial_complaint ON contact_requests(initial_complaint);
CREATE INDEX idx_contact_requests_full_name_email ON contact_requests(full_name, email);
CREATE INDEX idx_contact_requests_phone_whatsapp ON contact_requests(contact_phone, whatsapp);
CREATE INDEX idx_contact_requests_email_created_at ON contact_requests(email, created_at);
CREATE INDEX idx_contact_requests_full_name_created_at ON contact_requests(full_name, created_at);
CREATE INDEX idx_contact_requests_complaint_created_at ON contact_requests(initial_complaint, created_at);
CREATE INDEX idx_contact_requests_full_name_phone ON contact_requests(full_name, contact_phone);
CREATE INDEX idx_contact_requests_whatsapp_email ON contact_requests(whatsapp, email);
CREATE INDEX idx_contact_requests_phone_email ON contact_requests(contact_phone, email);
CREATE INDEX idx_contact_requests_full_name_whatsapp ON contact_requests(full_name, whatsapp);
CREATE INDEX idx_contact_requests_complaint_phone ON contact_requests(initial_complaint, contact_phone);
CREATE INDEX idx_contact_requests_complaint_whatsapp ON contact_requests(initial_complaint, whatsapp);
CREATE INDEX idx_contact_requests_complaint_email ON contact_requests(initial_complaint, email);
