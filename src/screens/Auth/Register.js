import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import { AuthService } from '../../services/auth.service.js';
import { StorageService } from '../../services/storage.service.js';
import State from '../../state.js';

export function Register() {
  const isAr = document.documentElement.getAttribute('lang') === 'ar';
  return `
    <div class="auth-screen">
      <div class="auth-card">
        <div class="auth-card__header">
          <a href="#/" class="auth-card__logo">TrackUp</a>
          <h1>${t('auth.register.title')}</h1>
          <p>${t('auth.register.hasAccount')} <a href="#/login">${t('auth.register.login')}</a></p>
        </div>
        <form id="register-form" novalidate>
          <div class="form-group">
            <label class="form-label" for="reg-name">${t('auth.name')}</label>
            <input class="form-input" id="reg-name" type="text" autocomplete="name" placeholder="Ahmed Hussien" />
          </div>
          <div class="form-group">
            <label class="form-label" for="reg-email">${t('auth.email')}</label>
            <input class="form-input" id="reg-email" type="email" autocomplete="email" placeholder="you@example.com" />
          </div>
          <div class="form-group">
            <label class="form-label" for="reg-password">${t('auth.password')}</label>
            <input class="form-input" id="reg-password" type="password" autocomplete="new-password" placeholder="${isAr ? 'الحد الأدنى 6 أحرف' : 'Min. 6 characters'}" />
          </div>
          <div id="reg-error" style="display:none"></div>
          <button type="submit" class="btn btn--primary btn--full btn--lg" id="reg-submit">
            ${t('auth.register.submit')}
          </button>
        </form>
        <div class="auth-card__switch">
          ${t('auth.register.hasAccount')} <a href="#/login">${t('auth.register.login')}</a>
        </div>
      </div>
    </div>
  `;
}

export function RegisterEvents() {
  const form  = document.getElementById('register-form');
  const errEl = document.getElementById('reg-error');
  const btn   = document.getElementById('reg-submit');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name     = document.getElementById('reg-name').value.trim();
    const email    = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;

    errEl.style.display = 'none';

    if (!name || !email || !password) { showError(t('auth.validation.required')); return; }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) { showError(t('auth.validation.invalidEmail')); return; }
    if (password.length < 6) { showError(t('auth.validation.weakPassword')); return; }

    btn.disabled    = true;
    btn.textContent = t('common.loading');

    await new Promise(r => setTimeout(r, 500));

    const result = AuthService.register({ name, email, password });

    if (!result.success) {
      btn.disabled    = false;
      btn.textContent = t('auth.register.submit');
      showError(result.message);
      return;
    }

    // BUG-07 FIX: if user committed a track before registering, go to dashboard
    // otherwise check if they came from decision flow or start fresh onboarding
    const committedTrackId = StorageService.get('committed_track_id');
    const hasResult        = !!State.getState('testResult');

    if (committedTrackId) {
      // Attach the committed track to the new user session
      const user = State.getState('user');
      if (user) {
        user.activeTrackId = committedTrackId;
        State.setState('user', user);
        StorageService.set('session', user);
      }
      Router.navigate('/dashboard');
    } else if (hasResult) {
      Router.navigate('/results');
    } else {
      Router.navigate('/onboarding');
    }
  });

  function showError(msg) {
    errEl.textContent  = msg;
    errEl.style.cssText = 'display:block;color:var(--color-danger);font-size:0.85rem;margin-bottom:0.75rem;padding:0.5rem 0.75rem;background:#fee2e2;border-radius:6px;';
  }
}
