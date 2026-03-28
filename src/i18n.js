import { en } from './i18n/en.js';
import { ar } from './i18n/ar.js';

const LANGS = { en, ar };
let _lang = 'en';

export function setLang(lang) {
  _lang = LANGS[lang] ? lang : 'en';
  document.documentElement.setAttribute('lang', _lang);
  document.documentElement.setAttribute('dir', _lang === 'ar' ? 'rtl' : 'ltr');
  // Expose t() globally so app.js can call it without circular imports
  window.__trackup_i18n__ = { t };
}

export function getLang() { return _lang; }

export function t(key) {
  const parts = key.split('.');
  let obj = LANGS[_lang] || LANGS.en;
  for (const p of parts) {
    if (obj == null) break;
    obj = obj[p];
  }
  // Fallback to English
  if (obj == null) {
    let fb = LANGS.en;
    for (const p of parts) { if (fb == null) break; fb = fb[p]; }
    return fb ?? key;
  }
  return obj;
}
