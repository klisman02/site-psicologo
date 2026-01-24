const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

async function enviarEmailContato({ nome, email, mensagem }) {
  try {
    console.log("📧 [MailService] Iniciando envio de email");
    console.log("🔑 API Key presente?", !!process.env.RESEND_API_KEY);
    console.log("📬 Enviando para:", "klisman.gomes.silva@gmail.com");
    
    const resp = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["klisman.gomes.silva@gmail.com"],
      subject: `Teste contato – ${nome}`,
      reply_to: email,
      text: `Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}`,
    });

    console.log("✅ Resend Response:", resp);
    return resp;
  } catch (error) {
    console.error("❌ Erro ao enviar email:", error);
    throw error;
  }
}

module.exports = { enviarEmailContato };
