import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import { AuthService } from '../../services/auth.service.js';
import { StorageService } from '../../services/storage.service.js';
import State from '../../state.js';

export function Login() {
  return `
    <div class="auth-screen">
      <div class="auth-card">
        <div class="auth-card__header">
          <a href="#/" class="auth-card__logo">TrackUp</a>
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
          <div id="login-error" class="form-error"></div>
          <button type="submit" class="btn btn--primary btn--full btn--lg" id="login-submit" style="margin-top:var(--space-2)">
            ${t('auth.login.submit')}
          </button>
        </form>
        <div style="margin-top:1rem;font-size:0.8rem;color:var(--color-text-muted);text-align:center;padding:var(--space-3);background:var(--color-surface-2);border-radius:var(--radius-md)">
          Demo: <strong>demo@trackup.io</strong> / <strong>demo1234</strong>
        </div>
      </div>
    </div>
  `;
}

export function LoginEvents() {
  const form  = document.getElementById('login-form');
  const errEl = document.getElementById('login-error');
  const btnEl = document.getElementById('login-submit');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value;

    _clearError(errEl);

    if (!email || !password) { _showError(errEl, t('auth.validation.required')); return; }

    btnEl.disabled    = true;
    btnEl.textContent = t('common.loading');

    await new Promise(r => setTimeout(r, 380));

    const result = AuthService.login(email, password);

    if (!result.success) {
      btnEl.disabled    = false;
      btnEl.textContent = t('auth.login.submit');
      _showError(errEl, result.message);
      return;
    }

    // BUG-06 FIX: smart redirect after login
    // Priority: committed track → has active track → has result → onboarding
    const user             = State.getState('user');
    const committedTrackId = StorageService.get('committed_track_id');
    const hasResult        = !!State.getState('testResult');

    if (committedTrackId && !user?.activeTrackId) {
      // Attach committed track from pre-login flow
      user.activeTrackId = committedTrackId;
      State.setState('user', user);
      StorageService.set('session', user);
    }

    if (user?.activeTrackId) {
      Router.navigate('/dashboard');
    } else if (hasResult) {
      Router.navigate('/results');
    } else {
      Router.navigate('/onboarding');
    }
  });
}

function _showError(el, msg) {
  if (!el) return;
  el.textContent  = msg;
  el.style.cssText = 'display:block;color:var(--color-danger);font-size:0.85rem;margin:0.5rem 0 0.75rem;padding:0.5rem 0.75rem;background:#fee2e2;border-radius:6px;';
}
function _clearError(el) {
  if (!el) return;
  el.textContent   = '';
  el.style.display = 'none';
}
