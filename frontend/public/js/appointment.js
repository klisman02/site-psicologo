const API_BASE = "http://localhost:3001/api";

function fmtLocalDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
}

async function loadSlots() {
  const sel = document.getElementById('appointment_id');
  try {
    const res = await fetch(`${API_BASE}/public/available-slots`);
    if (!res.ok) throw new Error('Falha ao carregar horários');
    const slots = await res.json();

    sel.innerHTML = '';
    if (!slots || slots.length === 0) {
      sel.innerHTML = '<option value="">Nenhum horário disponível no momento</option>';
      sel.disabled = true;
      return;
    }

    sel.disabled = false;
    sel.innerHTML = '<option value="">Escolha um horário</option>';
    slots.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = fmtLocalDate(s.appointment_time);
      sel.appendChild(opt);
    });
  } catch (err) {
    console.error(err);
    sel.innerHTML = '<option value="">Erro ao carregar</option>';
    sel.disabled = true;
  }
}

async function sendRequest(e) {
  e.preventDefault();
  const msgBox = document.getElementById('form-message');
  msgBox.className = 'form-message';
  msgBox.style.display = 'none';

  const appointment_id = document.getElementById('appointment_id').value;
  const full_name = document.getElementById('full_name').value.trim();
  const contact_phone = document.getElementById('contact_phone').value.trim();
  const whatsapp = document.getElementById('whatsapp').value.trim();
  const initial_complaint = document.getElementById('initial_complaint').value.trim();

  if (!appointment_id || !full_name || !contact_phone || !initial_complaint) {
    msgBox.classList.add('error');
    msgBox.textContent = 'Por favor preencha todos os campos obrigatórios.';
    msgBox.style.display = 'block';
    return;
  }

  try {
    const payload = { appointment_id: Number(appointment_id), full_name, contact_phone, whatsapp, initial_complaint };
    const res = await fetch(`${API_BASE}/public/request-appointment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.status === 202) {
      const body = await res.json();
      msgBox.classList.add('success');
      msgBox.textContent = body.message || 'Solicitação enviada. Aguarde confirmação.';
      msgBox.style.display = 'block';
      document.getElementById('appointment-form').reset();
      // recarrega slots
      await loadSlots();
    } else {
      const err = await res.json();
      msgBox.classList.add('error');
      msgBox.textContent = err.message || 'Erro ao enviar solicitação.';
      msgBox.style.display = 'block';
    }
  } catch (err) {
    console.error(err);
    msgBox.classList.add('error');
    msgBox.textContent = 'Erro de comunicação com o servidor.';
    msgBox.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('appointment-form');
  if (form) {
    loadSlots();
    form.addEventListener('submit', sendRequest);
  }
});
