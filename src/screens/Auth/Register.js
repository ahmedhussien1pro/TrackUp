import { t } from '../../i18n.js';
import { AuthService } from '../../services/auth.service.js';
import { Router } from '../../router.js';
import { showToast } from '../../utils.js';

export function Register() {
  return `
    <div class="auth-card">
      <div class="auth-card__header">
        <span class="auth-card__logo">TrackUp</span>
        <h2>${t('auth.register.title')}</h2>
      </div>
      <form class="auth-form" id="register-form" novalidate>
        <div class="form-group">
          <label class="form-label">${t('auth.name')}</label>
          <input class="form-input" type="text" id="reg-name" required />
        </div>
        <div class="form-group">
          <label class="form-label">${t('auth.email')}</label>
          <input class="form-input" type="email" id="reg-email" required />
        </div>
        <div class="form-group">
          <label class="form-label">${t('auth.password')}</label>
          <input class="form-input" type="password" id="reg-password" required />
        </div>
        <button type="submit" class="btn btn--primary btn--full">
          ${t('auth.register.submit')}
        </button>
      </form>
      <p class="auth-card__switch">
        ${t('auth.register.hasAccount')}
        <a href="#/login">${t('auth.register.login')}</a>
      </p>
    </div>
  `;
}

export function RegisterEvents() {
  document.getElementById('register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    if (!name || !email || !password) {
      showToast(t('auth.validation.required'), 'error');
      return;
    }
    const result = AuthService.register({ name, email, password });
    if (result.success) {
      showToast(t('auth.register.success'), 'success');
      Router.navigate('/onboarding');
    } else {
      showToast(result.message, 'error');
    }
  });
}
