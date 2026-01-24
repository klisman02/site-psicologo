const { enviarEmailContato } = require("../services/MailService");

async function enviarContato(req, res) {
  try {
    console.log("🔵 [ContactController] Requisição recebida");
    console.log("📧 Body recebido:", req.body);
    
    const { nome, email, mensagem } = req.body;

    if (!nome || !email || !mensagem) {
      console.log("❌ Dados inválidos");
      return res.status(400).json({ error: "Dados inválidos" });
    }

    console.log("📤 Enviando email para:", email);
    await enviarEmailContato({ nome, email, mensagem });
    console.log("✅ Email enviado com sucesso");

    return res.status(200).json({ success: true, message: "Mensagem enviada com sucesso" });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return res.status(500).json({ error: "Erro ao enviar mensagem. Tente novamente." });
  }
}

module.exports = { enviarContato };