import { t, getLang, setLang } from '../../i18n.js';
import State from '../../state.js';
import { AuthService } from '../../services/auth.service.js';
import { StorageService } from '../../services/storage.service.js';
import { Router } from '../../router.js';
import { unmountLayout, mountLayout } from '../../components/layout/Topbar.js';

export function Settings() {
  const user  = State.getState('user') || {};
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  const lang  = getLang();
  const isAr  = lang === 'ar';

  return `
    <div class="settings-screen">
      <div class="screen-header">
        <h1>${t('settings.title')}</h1>
      </div>

      <div class="settings-section">
        <div class="settings-section__title">${t('settings.profile')}</div>
        <div class="form-group">
          <label class="form-label" for="settings-name">${t('auth.name')}</label>
          <input class="form-input" id="settings-name" type="text"
                 value="${user.name || ''}" autocomplete="name" />
        </div>
        <div class="form-group" style="margin-bottom:var(--space-5)">
          <label class="form-label" for="settings-email">${t('auth.email')}</label>
          <input class="form-input" id="settings-email" type="email"
                 value="${user.email || ''}" disabled
                 style="opacity:0.55;cursor:not-allowed" />
        </div>
        <button class="btn btn--primary btn--sm" id="settings-save">${t('settings.save')}</button>
      </div>

      <div class="settings-section">
        <div class="settings-section__title">${t('settings.preferences')}</div>
        <div class="settings-row">
          <span>${t('settings.theme')}</span>
          <button class="btn btn--outline btn--sm" id="settings-theme-btn">
            ${theme === 'dark' ? t('settings.light') : t('settings.dark')}
          </button>
        </div>
        <div class="settings-row">
          <span>${t('settings.language')}</span>
          <button class="btn btn--outline btn--sm" id="settings-lang-btn">
            ${isAr ? 'English' : '\u0627\u0644\u0639\u0631\u0628\u064a\u0629'}
          </button>
        </div>
      </div>

      <div class="settings-section">
        <div class="settings-section__title">${isAr ? '\u0627\u0644\u062d\u0633\u0627\u0628' : 'Account'}</div>
        <button class="btn btn--danger btn--sm" id="settings-logout">${t('settings.logout')}</button>
      </div>
    </div>
  `;
}

function _setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}

export function SettingsEvents() {
  document.getElementById('settings-save')?.addEventListener('click', () => {
    const nameInput = document.getElementById('settings-name');
    const nameVal   = nameInput ? nameInput.value.trim() : '';
    if (!nameVal) return;

    const updatedUser = { ...State.getState('user'), name: nameVal };
    State.setState('user', updatedUser);
    StorageService.set('session', updatedUser);

    _setText('.sidebar__avatar',    nameVal.charAt(0).toUpperCase());
    _setText('.sidebar__user-name', nameVal);

    Toastify({
      text:     t('settings.saved'),
      duration: 2500,
      gravity:  'bottom',
      position: 'right',
      style:    { background: 'var(--color-success)' },
    }).showToast();
  });

  document.getElementById('settings-theme-btn')?.addEventListener('click', () => {
    const cur  = document.documentElement.getAttribute('data-theme') || 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    StorageService.set('theme', next);
    const outlet = document.getElementById('app-outlet');
    if (outlet) {
      outlet.innerHTML = Settings();
      SettingsEvents();
    }
  });

  document.getElementById('settings-lang-btn')?.addEventListener('click', () => {
    const nextLang = getLang() === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    StorageService.set('lang', nextLang);
    mountLayout();
    const outlet = document.getElementById('app-outlet');
    if (outlet) {
      outlet.innerHTML = Settings();
      SettingsEvents();
    }
  });

  document.getElementById('settings-logout')?.addEventListener('click', () => {
    const isArabic   = getLang() === 'ar';
    const swalConfig = {
      title:              isArabic ? '\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062e\u0631\u0648\u062c\u061f' : 'Sign out?',
      text:               isArabic ? '\u0633\u064a\u062a\u0645 \u0625\u0646\u0647\u0627\u0621 \u062c\u0644\u0633\u062a\u0643' : 'Your session will end.',
      icon:               'question',
      showCancelButton:   true,
      confirmButtonText:  isArabic ? '\u062e\u0631\u0648\u062c' : 'Sign out',
      cancelButtonText:   isArabic ? '\u0625\u0644\u063a\u0627\u0621' : 'Cancel',
      confirmButtonColor: '#ef4444',
    };

    Swal.fire(swalConfig).then(function (swalResult) {
      if (swalResult.isConfirmed) {
        AuthService.logout();
        unmountLayout();
        Router.navigate('/login');
      }
    });
  });
}
