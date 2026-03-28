import { t } from '../../i18n.js';
import { AuthService } from '../../services/auth.service.js';
import { Router } from '../../router.js';
import { showToast } from '../../utils.js';

export function Login() {
  return `
    <div class="auth-card">
      <div class="auth-card__header">
        <span class="auth-card__logo">TrackUp</span>
        <h2>${t('auth.login.title')}</h2>
      </div>
      <form class="auth-form" id="login-form" novalidate>
        <div class="form-group">
          <label class="form-label">${t('auth.email')}</label>
          <input class="form-input" type="email" id="login-email" required />
        </div>
        <div class="form-group">
          <label class="form-label">${t('auth.password')}</label>
          <input class="form-input" type="password" id="login-password" required />
        </div>
        <button type="submit" class="btn btn--primary btn--full">
          ${t('auth.login.submit')}
        </button>
      </form>
      <p class="auth-card__switch">
        ${t('auth.login.noAccount')}
        <a href="#/register">${t('auth.login.register')}</a>
      </p>
    </div>
  `;
}

export function LoginEvents() {
  document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    if (!email || !password) {
      showToast(t('auth.validation.required'), 'error');
      return;
    }
    const result = AuthService.login(email, password);
    if (result.success) {
      Router.navigate('/dashboard');
    } else {
      showToast(result.message, 'error');
    }
  });
}
