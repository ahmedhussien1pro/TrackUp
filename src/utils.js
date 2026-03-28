/**
 * TRACKUP UTILITIES
 * Pure helpers — no side effects on import.
 */

export function uid() {
  return crypto.randomUUID();
}

export function formatDate(ts, lang = 'en') {
  return new Intl.DateTimeFormat(
    lang === 'ar' ? 'ar-EG' : 'en-GB',
    { dateStyle: 'medium' }
  ).format(new Date(ts));
}

export function relativeTime(ts, lang = 'en') {
  const diff = Date.now() - new Date(ts).getTime();
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
  if (diff < 60000)    return rtf.format(-Math.round(diff / 1000), 'second');
  if (diff < 3600000)  return rtf.format(-Math.round(diff / 60000), 'minute');
  if (diff < 86400000) return rtf.format(-Math.round(diff / 3600000), 'hour');
  return rtf.format(-Math.round(diff / 86400000), 'day');
}

export function debounce(fn, ms = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toast(message, type = 'info') {
  if (!window.Toastify) return;
  const colors = {
    success: '#2d9e5f',
    error:   '#c0392b',
    info:    '#5a67f2',
    warning: '#c47a14',
  };
  window.Toastify({
    text: message,
    duration: 3200,
    gravity: 'top',
    position: 'right',
    style: {
      background: colors[type] || colors.info,
      borderRadius: '8px',
      fontSize: '14px',
      padding: '10px 18px',
    },
  }).showToast();
}

export async function confirmDialog(title, text) {
  if (!window.Swal) return true;
  const result = await window.Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#5a67f2',
  });
  return result.isConfirmed;
}
