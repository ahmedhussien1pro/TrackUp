import { en } from './i18n/en.js';
import { ar } from './i18n/ar.js';

const LOCALES = { en, ar };
let _locale = LOCALES.en;
let _lang = 'en';

export function setLang(lang) {
  _lang = lang;
  _locale = LOCALES[lang] || LOCALES.en;
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
}

export function t(key) {
  const parts = key.split('.');
  let val = _locale;
  for (const part of parts) {
    if (val == null) break;
    val = val[part];
  }
  if (typeof val === 'string') return val;
  // fallback to en
  let fallback = LOCALES.en;
  for (const part of parts) {
    if (fallback == null) break;
    fallback = fallback[part];
  }
  return typeof fallback === 'string' ? fallback : key;
}

export function getLang() {
  return _lang;
}

export default { t, setLang, getLang };
