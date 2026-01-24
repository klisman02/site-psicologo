const ContactRequestModel = require('../models/ContactRequestModels');
const MailService = require('../services/MailService');

const onlyDigits = (v) => String(v || '').replace(/\D/g, '');
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || '').trim());

const createContactRequest = async (req, res) => {
  const { full_name, contact_phone, whatsapp, email, initial_complaint } = req.body;

  if (!full_name || !contact_phone || !whatsapp || !email || !initial_complaint) {
    return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'E-mail inválido.' });
  }

  const phoneDigits = onlyDigits(contact_phone);
  const whatsDigits = onlyDigits(whatsapp);

  if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    return res.status(400).json({ message: 'Telefone inválido. Use DDD + número.' });
  }

  if (whatsDigits.length < 10 || whatsDigits.length > 11) {
    return res.status(400).json({ message: 'WhatsApp inválido. Use DDD + número.' });
  }

  try {
    // 1) Salva no banco
    const saved = await ContactRequestModel.create({
      full_name: String(full_name).trim(),
      contact_phone: String(contact_phone).trim(),
      whatsapp: String(whatsapp).trim(),
      email: String(email).trim(),
      initial_complaint: String(initial_complaint).trim()
    });

    // 2) Envia e-mail (se falhar, não perde o registro pois já salvou)
    try {
      await MailService.sendContactRequestEmail(saved);
    } catch (mailErr) {
      console.error('Falha ao enviar e-mail (mas request foi salvo):', mailErr);
      return res.status(201).json({
        message: 'Solicitação salva com sucesso, mas houve falha ao enviar e-mail. Tente novamente mais tarde.',
        request: saved
      });
    }

    return res.status(201).json({
      message: 'Solicitação enviada com sucesso! Em breve entraremos em contato.',
      request: saved
    });
  } catch (err) {
    console.error('Erro ao salvar contact request:', err);
    return res.status(500).json({ message: 'Erro interno ao processar solicitação.' });
  }
};

module.exports = { createContactRequest };
