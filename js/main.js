/* Erin Mills Optical — site behaviour */

/* TODO(owner): create a free access key at https://web3forms.com with the
   store's email address, then replace the placeholder below. Until then the
   form shows the call-us fallback instead of silently failing. */
const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const STORE_PHONE_DISPLAY = '905-858-2066';

/* --- Mobile nav --- */
const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

siteNav.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

/* --- Service cards pre-select the booking form --- */
const serviceSelect = document.getElementById('bf-service');

document.querySelectorAll('.card-link[data-service]').forEach((link) => {
  link.addEventListener('click', () => {
    const wanted = link.dataset.service;
    const match = Array.from(serviceSelect.options)
      .find((option) => option.text === wanted);
    if (match) serviceSelect.value = match.value || match.text;
  });
});

/* --- Date field: min today, Sundays flagged (store closed) --- */
const dateInput = document.getElementById('bf-date');
const dateHint = document.getElementById('bf-date-hint');
const today = new Date();
const pad = (n) => String(n).padStart(2, '0');
dateInput.min = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

const isSunday = (value) => {
  if (!value) return false;
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d).getDay() === 0;
};

dateInput.addEventListener('change', () => {
  const closed = isSunday(dateInput.value);
  dateHint.hidden = !closed;
  dateInput.setCustomValidity(closed ? 'We are closed on Sundays — please pick another day.' : '');
});

/* --- Booking form submit --- */
const form = document.getElementById('booking-form');
const statusEl = document.getElementById('form-status');
const submitBtn = document.getElementById('bf-submit');

const FALLBACK_MESSAGE =
  `Online booking isn't available right now — please call us at ${STORE_PHONE_DISPLAY} and we'll set up your appointment.`;

function showStatus(message, kind) {
  statusEl.textContent = message;
  statusEl.className = `form-status ${kind}`;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;
  if (isSunday(dateInput.value)) {
    dateInput.focus();
    return;
  }
  if (form.querySelector('.honeypot').checked) return; /* bot */

  if (WEB3FORMS_ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY') {
    showStatus(FALLBACK_MESSAGE, 'err');
    return;
  }

  const payload = Object.fromEntries(new FormData(form));
  payload.access_key = WEB3FORMS_ACCESS_KEY;
  payload.subject = `Booking request — ${payload.service} — ${payload.name}`;
  payload.from_name = 'Erin Mills Optical website';
  delete payload.botcheck;

  submitBtn.disabled = true;
  showStatus('Sending…', 'ok');

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || 'Submission failed');
    form.reset();
    dateHint.hidden = true;
    showStatus("Request sent — we'll confirm your appointment within one business day.", 'ok');
  } catch (error) {
    showStatus(FALLBACK_MESSAGE, 'err');
  } finally {
    submitBtn.disabled = false;
  }
});

/* --- Footer year --- */
document.getElementById('year').textContent = String(new Date().getFullYear());
