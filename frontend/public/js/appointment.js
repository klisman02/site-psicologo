const API_BASE = "http://localhost:3001/api";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("appointment-form");
  const msgBox = document.getElementById("form-message");

  const fullNameEl = document.getElementById("full_name");
  const phoneEl = document.getElementById("contact_phone");
  const waEl = document.getElementById("whatsapp");
  const emailEl = document.getElementById("email");
  const complaintEl = document.getElementById("initial_complaint");

  if (!form) return;

  const showMessage = (text, type = "error") => {
    msgBox.className = `form-message ${type}`;
    msgBox.textContent = text;
    msgBox.style.display = "block";
  };

  const onlyDigits = (v) => (v || "").replace(/\D/g, "");

  // (11) 9999-9999 ou (11) 99999-9999
  const formatBRPhone = (value) => {
    const d = onlyDigits(value).slice(0, 11);
    if (!d) return "";

    const ddd = d.slice(0, 2);
    const rest = d.slice(2);

    if (rest.length <= 4) return `(${ddd}) ${rest}`;
    if (rest.length <= 8) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;

    return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5, 9)}`;
  };

  const applyMask = (el) => {
    el.addEventListener("input", () => {
      el.value = formatBRPhone(el.value);
    });
    el.addEventListener("paste", () => {
      setTimeout(() => (el.value = formatBRPhone(el.value)), 0);
    });
  };

  applyMask(phoneEl);
  applyMask(waEl);

  const isValidPhone = (value) => {
    const d = onlyDigits(value);
    return d.length === 10 || d.length === 11; // com DDD
  };

  const isValidEmail = (value) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test((value || "").trim());
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msgBox.style.display = "none";

    const full_name = fullNameEl.value.trim();
    const contact_phone = phoneEl.value.trim();
    const whatsapp = waEl.value.trim();
    const email = emailEl.value.trim();
    const initial_complaint = complaintEl.value.trim();

    // validações
    if (!full_name || !contact_phone || !whatsapp || !email || !initial_complaint) {
      showMessage("Por favor, preencha todos os campos.");
      return;
    }

    if (!isValidPhone(contact_phone)) {
      showMessage("Telefone inválido. Use DDD + número (10 ou 11 dígitos).");
      phoneEl.focus();
      return;
    }

    if (!isValidPhone(whatsapp)) {
      showMessage("WhatsApp inválido. Use DDD + número (10 ou 11 dígitos).");
      waEl.focus();
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("Por favor, informe um e-mail válido.");
      emailEl.focus();
      return;
    }

    try {
      const payload = {
        full_name,
        contact_phone,
        whatsapp,
        email,
        initial_complaint
      };

      const res = await fetch(`${API_BASE}/public/request-appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const body = await res.json().catch(() => ({}));
        showMessage(body.message || "Solicitação enviada. Aguarde confirmação.", "success");
        form.reset();
      } else {
        const err = await res.json().catch(() => ({}));
        showMessage(err.message || "Erro ao enviar solicitação.");
      }
    } catch (err) {
      console.error(err);
      showMessage("Erro de comunicação com o servidor.");
    }
  });
});
