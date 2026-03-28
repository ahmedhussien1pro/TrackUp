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

export function SettingsEvents() {
  // Save profile name
  document.getElementById('settings-save')?.addEventListener('click', () => {
    const nameVal = document.getElementById('settings-name')?.value.trim();
    if (!nameVal) return;
    const updatedUser = { ...State.getState('user'), name: nameVal };
    State.setState('user', updatedUser);
    StorageService.set('session', updatedUser);
    document.querySelector('.sidebar__avatar')?.textContent = nameVal.charAt(0).toUpperCase();
    document.querySelector('.sidebar__user-name')?.textContent = nameVal;
    Toastify({
      text:     t('settings.saved'),
      duration: 2500,
      gravity:  'bottom',
      position: 'right',
      style:    { background: 'var(--color-success)' },
    }).showToast();
  });

  // Theme toggle
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

  // Language toggle
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

  // Logout
  document.getElementById('settings-logout')?.addEventListener('click', () => {
    const currentLang = getLang();
    const isArabic    = currentLang === 'ar';

    const swalTitle   = isArabic ? '\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062e\u0631\u0648\u062c\u061f' : 'Sign out?';
    const swalText    = isArabic ? '\u0633\u064a\u062a\u0645 \u0625\u0646\u0647\u0627\u0621 \u062c\u0644\u0633\u062a\u0643' : 'Your session will end.';
    const confirmTxt  = isArabic ? '\u062e\u0631\u0648\u062c' : 'Sign out';
    const cancelTxt   = isArabic ? '\u0625\u0644\u063a\u0627\u0621' : 'Cancel';

    Swal.fire({
      title:              swalTitle,
      text:               swalText,
      icon:               'question',
      showCancelButton:   true,
      confirmButtonText:  confirmTxt,
      cancelButtonText:   cancelTxt,
      confirmButtonColor: '#ef4444',
    }).then(function(swalResult) {
      if (swalResult.isConfirmed) {
        AuthService.logout();
        unmountLayout();
        Router.navigate('/login');
      }
    });
  });
}
