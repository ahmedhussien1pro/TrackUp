/**
 * TRACKUP i18n
 * t() translation helper + setLang() with RTL flip.
 */

let _locale = {};
let _lang = 'en';

const _loaders = {
  en: () => import('./i18n/en.js'),
  ar: () => import('./i18n/ar.js'),
};

export async function setLang(lang) {
  _lang = lang;
  const mod = await _loaders[lang]?.();
  _locale = mod?.default || {};
  document.documentElement.lang = lang;
  document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
}

export function t(key, vars = {}) {
  let str = _locale[key] ?? key;
  Object.entries(vars).forEach(([k, v]) => {
    str = str.replace(`{${k}}`, v);
  });
  return str;
}

export function getLang() {
  return _lang;
}

export default { t, setLang, getLang };
