import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import { AuthService } from '../../services/auth.service.js';

export function Login() {
  return `
    <div class="auth-screen">
      <div class="auth-card">
        <div class="auth-card__header">
          <span class="auth-card__logo">TrackUp</span>
          <h1>${t('auth.login.title')}</h1>
          <p>${t('auth.login.noAccount')} <a href="#/register">${t('auth.login.register')}</a></p>
        </div>
        <form id="login-form" novalidate>
          <div class="form-group">
            <label class="form-label" for="login-email">${t('auth.email')}</label>
            <input class="form-input" id="login-email" type="email" autocomplete="email" placeholder="you@example.com" />
          </div>
          <div class="form-group">
            <label class="form-label" for="login-password">${t('auth.password')}</label>
            <input class="form-input" id="login-password" type="password" autocomplete="current-password" placeholder="••••••••" />
          </div>
          <div id="login-error" class="form-error" style="display:none"></div>
          <button type="submit" class="btn btn--primary btn--full btn--lg" id="login-submit">
            ${t('auth.login.submit')}
          </button>
        </form>
        <div class="auth-card__hint" style="margin-top:1rem;font-size:0.8rem;color:var(--color-text-muted);text-align:center">
          Demo: demo@trackup.io / demo1234
        </div>
      </div>
    </div>
  `;
}

export function LoginEvents() {
  const form   = document.getElementById('login-form');
  const errEl  = document.getElementById('login-error');
  const btnEl  = document.getElementById('login-submit');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    errEl.style.display = 'none';

    if (!email || !password) {
      showError(t('auth.validation.required'));
      return;
    }

    btnEl.disabled = true;
    btnEl.textContent = t('common.loading');

    await new Promise(r => setTimeout(r, 400));

    const result = AuthService.login(email, password);

    if (!result.success) {
      btnEl.disabled = false;
      btnEl.textContent = t('auth.login.submit');
      showError(result.message);
      return;
    }

    const user = result.user;
    if (!user.activeTrackId) {
      Router.navigate('/onboarding');
    } else {
      Router.navigate('/dashboard');
    }
  });

  function showError(msg) {
    errEl.textContent = msg;
    errEl.style.display = 'block';
    errEl.style.cssText = 'display:block;color:var(--color-danger);font-size:0.85rem;margin-bottom:0.75rem;padding:0.5rem 0.75rem;background:#fee2e2;border-radius:6px;';
  }
}
