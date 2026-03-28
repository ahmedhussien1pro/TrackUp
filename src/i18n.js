import { en } from './i18n/en.js';
import { ar } from './i18n/ar.js';

const LOCALES = { en, ar };
let _currentLang = 'en';

function _get(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? path;
}

export function t(key) {
  const locale = LOCALES[_currentLang] || LOCALES.en;
  const val = _get(locale, key);
  if (val === key) {
    // Fallback to English
    return _get(LOCALES.en, key);
  }
  return val;
}

export function getLang() {
  return _currentLang;
}

export function setLang(lang) {
  if (!LOCALES[lang]) return;
  _currentLang = lang;
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
}
