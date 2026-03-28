import { t } from '../../i18n.js';
import { AuthService } from '../../services/auth.service.js';
import { Router } from '../../router.js';
import State from '../../state.js';
import { showToast } from '../../utils.js';

export function Settings() {
  const user = State.getState('user');
  const lang = State.getState('lang');
  const theme = State.getState('theme');
  return `
    <div class="settings-screen">
      <div class="settings-screen__header">
        <h2>${t('settings.title')}</h2>
      </div>
      <div class="settings-screen__sections">
        <div class="settings-section">
          <h3 class="settings-section__title">${t('settings.profile')}</h3>
          <div class="form-group">
            <label class="form-label">${t('auth.name')}</label>
            <input class="form-input" id="settings-name" value="${user?.name || ''}" />
          </div>
          <div class="form-group">
            <label class="form-label">${t('auth.email')}</label>
            <input class="form-input" type="email" id="settings-email" value="${user?.email || ''}" />
          </div>
          <button class="btn btn--primary" id="settings-save">
            ${t('settings.save')}
          </button>
        </div>
        <div class="settings-section">
          <h3 class="settings-section__title">${t('settings.preferences')}</h3>
          <div class="settings-row">
            <span>${t('settings.theme')}</span>
            <button class="btn btn--ghost btn--sm" id="settings-theme">
              ${theme === 'dark' ? t('settings.light') : t('settings.dark')}
            </button>
          </div>
          <div class="settings-row">
            <span>${t('settings.language')}</span>
            <button class="btn btn--ghost btn--sm" id="settings-lang">
              ${lang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
        <div class="settings-section">
          <button class="btn btn--danger btn--full" id="settings-logout">
            ${t('settings.logout')}
          </button>
        </div>
      </div>
    </div>
  `;
}

export function SettingsEvents() {
  document.getElementById('settings-save')?.addEventListener('click', () => {
    const name = document.getElementById('settings-name').value.trim();
    const email = document.getElementById('settings-email').value.trim();
    if (!name || !email) { showToast(t('auth.validation.required'), 'error'); return; }
    const user = State.getState('user');
    State.setState('user', { ...user, name, email });
    showToast(t('settings.saved'), 'success');
  });

  document.getElementById('settings-theme')?.addEventListener('click', () => {
    const current = State.getState('theme');
    const next = current === 'dark' ? 'light' : 'dark';
    State.setState('theme', next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('trackup_theme', next);
    Router.navigate('/settings');
  });

  document.getElementById('settings-lang')?.addEventListener('click', () => {
    const current = State.getState('lang');
    const next = current === 'en' ? 'ar' : 'en';
    State.setState('lang', next);
    document.documentElement.setAttribute('dir', next === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', next);
    localStorage.setItem('trackup_lang', next);
    Router.navigate('/settings');
  });

  document.getElementById('settings-logout')?.addEventListener('click', () => {
    AuthService.logout();
    Router.navigate('/login');
  });
}
