import { t, getLang, setLang } from '../../i18n.js';
import State from '../../state.js';
import { AuthService } from '../../services/auth.service.js';
import { StorageService } from '../../services/storage.service.js';
import { Router } from '../../router.js';
import { unmountLayout } from '../../components/layout/Topbar.js';

export function Settings() {
  const user  = State.getState('user') || {};
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  const lang  = getLang();

  return `
    <div class="settings-screen">
      <div class="settings-screen__header">
        <h1>${t('settings.title')}</h1>
      </div>

      <div class="settings-section">
        <div class="settings-section__title">${t('settings.profile')}</div>
        <div class="form-group">
          <label class="form-label">${t('auth.name')}</label>
          <input class="form-input" id="settings-name" type="text" value="${user.name || ''}" />
        </div>
        <div class="form-group">
          <label class="form-label">${t('auth.email')}</label>
          <input class="form-input" id="settings-email" type="email" value="${user.email || ''}" disabled style="opacity:0.6" />
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
            ${lang === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>
      </div>

      <div class="settings-section">
        <button class="btn btn--danger btn--sm" id="settings-logout">${t('settings.logout')}</button>
      </div>
    </div>
  `;
}

export function SettingsEvents() {
  document.getElementById('settings-save')?.addEventListener('click', () => {
    const name = document.getElementById('settings-name')?.value.trim();
    if (name) {
      const user = { ...State.getState('user'), name };
      State.setState('user', user);
      StorageService.set('session', user);
      Toastify({ text: t('settings.saved'), duration: 2000, gravity: 'bottom', position: 'right', style: { background: 'var(--color-success)' } }).showToast();
    }
  });

  document.getElementById('settings-theme-btn')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    StorageService.set('theme', next);
    const outlet = document.getElementById('app-outlet');
    if (outlet) { outlet.innerHTML = Settings(); SettingsEvents(); }
  });

  document.getElementById('settings-lang-btn')?.addEventListener('click', () => {
    const next = getLang() === 'ar' ? 'en' : 'ar';
    setLang(next);
    StorageService.set('lang', next);
    const outlet = document.getElementById('app-outlet');
    if (outlet) { outlet.innerHTML = Settings(); SettingsEvents(); }
  });

  document.getElementById('settings-logout')?.addEventListener('click', async () => {
    const confirm = await Swal.fire({
      title: 'Sign out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sign out',
      confirmButtonColor: 'var(--color-danger)',
    });
    if (confirm.isConfirmed) {
      AuthService.logout();
      unmountLayout();
      Router.navigate('/login');
    }
  });
}
