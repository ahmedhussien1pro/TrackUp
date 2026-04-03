// ============================================================
// auth.js — Login / Register / Guest gate
// ============================================================

window.renderAuthView = function renderAuthView() {
  const isAr = state.language === 'ar';
  const mode = state._authMode || 'login';

  return `
    <div style="display:flex;align-items:center;justify-content:center;min-height:60vh;padding:2rem 0;">
      <div style="width:100%;max-width:420px;" data-aos="fade-up">

        <!-- Brand -->
        <div style="text-align:center;margin-bottom:1.75rem;">
          <div class="brand-block" style="justify-content:center;pointer-events:none;margin-bottom:.5rem;">
            <span class="brand-mark">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent)">
                <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
              </svg>
            </span>
            <span class="brand-name" style="font-size:1.2rem;">TrackUp</span>
          </div>
          <p class="text-muted" style="font-size:.85rem;">
            ${isAr ? 'ابدأ مسارك الهندسي الصح' : 'Start your engineering journey'}
          </p>
        </div>

        <!-- Demo Banner -->
        <div style="
          background:linear-gradient(135deg,rgba(37,99,235,.08),rgba(124,58,237,.08));
          border:1px solid rgba(37,99,235,.25);
          border-radius:14px;
          padding:1rem 1.1rem;
          margin-bottom:1.1rem;
        ">
          <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.55rem;">
            <i data-lucide="zap" style="width:.95rem;height:.95rem;color:#2563eb;flex-shrink:0;"></i>
            <span style="font-weight:800;font-size:.88rem;color:var(--text);">
              ${isAr ? 'جرّب الديمو فوراً' : 'Try the Demo instantly'}
            </span>
          </div>

          <!-- Credentials row -->
          <div style="display:grid;gap:.4rem;margin-bottom:.7rem;">

            <!-- Email row -->
            <div style="display:flex;align-items:center;justify-content:space-between;background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:.38rem .65rem;">
              <div style="display:flex;align-items:center;gap:.4rem;min-width:0;">
                <i data-lucide="at-sign" style="width:.78rem;height:.78rem;color:var(--text-muted);flex-shrink:0;"></i>
                <code style="font-size:.8rem;color:var(--text);letter-spacing:.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">demo@trackup.io</code>
              </div>
              <button
                type="button"
                title="${isAr ? 'نسخ البريد' : 'Copy email'}"
                onclick="copyDemoCred('demo@trackup.io', this)"
                style="background:none;border:none;cursor:pointer;padding:.2rem .3rem;border-radius:5px;color:var(--text-muted);flex-shrink:0;display:flex;align-items:center;transition:color .15s;">
                <i data-lucide="copy" style="width:.82rem;height:.82rem;pointer-events:none;"></i>
              </button>
            </div>

            <!-- Password row -->
            <div style="display:flex;align-items:center;justify-content:space-between;background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:.38rem .65rem;">
              <div style="display:flex;align-items:center;gap:.4rem;min-width:0;">
                <i data-lucide="key-round" style="width:.78rem;height:.78rem;color:var(--text-muted);flex-shrink:0;"></i>
                <code style="font-size:.8rem;color:var(--text);letter-spacing:.04em;white-space:nowrap;">trackup123</code>
              </div>
              <button
                type="button"
                title="${isAr ? 'نسخ كلمة المرور' : 'Copy password'}"
                onclick="copyDemoCred('trackup123', this)"
                style="background:none;border:none;cursor:pointer;padding:.2rem .3rem;border-radius:5px;color:var(--text-muted);flex-shrink:0;display:flex;align-items:center;transition:color .15s;">
                <i data-lucide="copy" style="width:.82rem;height:.82rem;pointer-events:none;"></i>
              </button>
            </div>

          </div>

          <button class="btn btn-primary" style="width:100%;font-size:.85rem;" onclick="loginDemo()">
            <i data-lucide="play-circle" style="width:.9rem;height:.9rem;"></i>
            ${isAr ? 'دخول مباشر بحساب الديمو' : 'Login with Demo Account'}
          </button>
        </div>

        <!-- Card -->
        <div class="surface-panel section-pad">

          <!-- Tab toggle -->
          <div class="tab-bar" style="margin-bottom:1.25rem;">
            <button class="tab-btn ${mode === 'login'    ? 'tab-btn--active' : ''}" onclick="setAuthMode('login')">
              ${isAr ? 'تسجيل دخول' : 'Login'}
            </button>
            <button class="tab-btn ${mode === 'register' ? 'tab-btn--active' : ''}" onclick="setAuthMode('register')">
              ${isAr ? 'إنشاء حساب' : 'Register'}
            </button>
          </div>

          ${mode === 'login' ? renderLoginForm(isAr) : renderRegisterForm(isAr)}

          <!-- Divider -->
          <div style="display:flex;align-items:center;gap:.75rem;margin:1.1rem 0;">
            <div style="flex:1;height:1px;background:var(--border);"></div>
            <span style="font-size:.75rem;color:var(--text-faint);">${isAr ? 'أو' : 'or'}</span>
            <div style="flex:1;height:1px;background:var(--border);"></div>
          </div>

          <!-- Guest CTA -->
          <button class="btn btn-secondary" style="width:100%;" onclick="continueAsGuest()">
            <i data-lucide="user" style="width:.9rem;height:.9rem;"></i>
            ${isAr ? 'متابعة كـ ضيف' : 'Continue as Guest'}
          </button>
          <p class="text-muted" style="font-size:.74rem;text-align:center;margin-top:.5rem;line-height:1.6;">
            ${isAr
              ? 'الضيوف يمكنهم استخدام التقييم والنتائج. يتم حفظ بياناتك محليًا فقط.'
              : 'Guests can use the assessment & results. Data is saved locally only.'}
          </p>
        </div>

      </div>
    </div>
  `;
};

function renderLoginForm(isAr) {
  return `
    <form onsubmit="submitLogin(event)">
      <div class="form-group" style="margin-bottom:.75rem;">
        <label class="form-label">${isAr ? 'البريد الإلكتروني' : 'Email'}</label>
        <input class="form-input" id="authEmail" type="email" placeholder="name@mail.com" autocomplete="email" required />
      </div>
      <div class="form-group" style="margin-bottom:.75rem;">
        <label class="form-label">${isAr ? 'كلمة المرور' : 'Password'}</label>
        <div style="position:relative;">
          <input class="form-input" id="authPassword" type="password"
            placeholder="${isAr ? '••••••••' : '••••••••'}" autocomplete="current-password" required
            style="padding-${state.direction === 'rtl' ? 'left' : 'right'}:2.5rem;" />
          <button type="button" onclick="toggleAuthPwd('authPassword',this)"
            style="position:absolute;top:50%;${state.direction === 'rtl' ? 'left' : 'right'}:.7rem;transform:translateY(-50%);
              background:none;border:none;cursor:pointer;color:var(--text-faint);padding:0;">
            <i data-lucide="eye" style="width:.95rem;height:.95rem;"></i>
          </button>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;margin-top:.25rem;">
        <i data-lucide="log-in" style="width:.9rem;height:.9rem;"></i>
        ${isAr ? 'دخول' : 'Login'}
      </button>
    </form>
  `;
}

function renderRegisterForm(isAr) {
  return `
    <form onsubmit="submitRegister(event)">
      <div class="form-group" style="margin-bottom:.75rem;">
        <label class="form-label">${isAr ? 'الاسم بالكامل' : 'Full Name'}</label>
        <input class="form-input" id="regName" type="text"
          placeholder="${isAr ? 'مثال: أحمد علي' : 'e.g. Ahmed Ali'}" autocomplete="name" required />
      </div>
      <div class="form-group" style="margin-bottom:.75rem;">
        <label class="form-label">${isAr ? 'البريد الإلكتروني' : 'Email'}</label>
        <input class="form-input" id="regEmail" type="email" placeholder="name@mail.com" autocomplete="email" required />
      </div>
      <div class="form-group" style="margin-bottom:.75rem;">
        <label class="form-label">${isAr ? 'كلمة المرور' : 'Password'}</label>
        <div style="position:relative;">
          <input class="form-input" id="regPassword" type="password"
            placeholder="${isAr ? '8 أحرف على الأقل' : 'At least 8 characters'}" autocomplete="new-password" required
            style="padding-${state.direction === 'rtl' ? 'left' : 'right'}:2.5rem;" />
          <button type="button" onclick="toggleAuthPwd('regPassword',this)"
            style="position:absolute;top:50%;${state.direction === 'rtl' ? 'left' : 'right'}:.7rem;transform:translateY(-50%);
              background:none;border:none;cursor:pointer;color:var(--text-faint);padding:0;">
            <i data-lucide="eye" style="width:.95rem;height:.95rem;"></i>
          </button>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;margin-top:.25rem;">
        <i data-lucide="user-plus" style="width:.9rem;height:.9rem;"></i>
        ${isAr ? 'إنشاء الحساب' : 'Create Account'}
      </button>
    </form>
  `;
}

// ── Auth actions ──────────────────────────────────────────────

window.setAuthMode = function setAuthMode(mode) {
  state._authMode = mode;
  renderMainOnly();
};

window.toggleAuthPwd = function toggleAuthPwd(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.innerHTML = `<i data-lucide="${isHidden ? 'eye-off' : 'eye'}" style="width:.95rem;height:.95rem;"></i>`;
  if (window.lucide) lucide.createIcons();
};

window.submitLogin = function submitLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('authEmail')?.value?.trim();
  const password = document.getElementById('authPassword')?.value;
  if (!email || !password) return;

  const stored = StorageAPI.get('trackup_user_' + email, null);
  if (!stored) {
    showToast(state.language === 'ar' ? 'البريد غير مسجل.' : 'Email not registered.', '#dc2626');
    return;
  }
  if (stored.password !== btoa(password)) {
    showToast(state.language === 'ar' ? 'كلمة المرور غلط.' : 'Wrong password.', '#dc2626');
    return;
  }
  state.auth = { email, name: stored.name, isGuest: false };
  if (stored.profile) state.profile = stored.profile;
  showToast((state.language === 'ar' ? 'أهلًا ' : 'Welcome ') + stored.name, '#16a34a');
  navigateTo('home');
};

window.submitRegister = function submitRegister(e) {
  e.preventDefault();
  const name     = document.getElementById('regName')?.value?.trim();
  const email    = document.getElementById('regEmail')?.value?.trim();
  const password = document.getElementById('regPassword')?.value;
  if (!name || !email || !password) return;
  if (password.length < 8) {
    showToast(state.language === 'ar' ? 'كلمة المرور أقل من 8 أحرف.' : 'Password must be 8+ chars.', '#dc2626');
    return;
  }
  const existing = StorageAPI.get('trackup_user_' + email, null);
  if (existing) {
    showToast(state.language === 'ar' ? 'البريد ده مسجل قبل كده.' : 'Email already registered.', '#f59e0b');
    return;
  }
  StorageAPI.set('trackup_user_' + email, { name, password: btoa(password), profile: state.profile });
  state.auth = { email, name, isGuest: false };
  state.profile = { ...state.profile, fullName: name, email };
  persistState();
  showToast((state.language === 'ar' ? 'تم إنشاء حسابك! أهلًا ' : 'Account created! Welcome ') + name, '#16a34a');
  navigateTo('profile');
};

window.continueAsGuest = function continueAsGuest() {
  state.auth = { isGuest: true, name: state.language === 'ar' ? 'ضيف' : 'Guest' };
  showToast(state.language === 'ar' ? 'متابعة كـ ضيف — بياناتك محلية فقط.' : 'Continuing as guest — data is local only.', '#2563eb');
  navigateTo('home');
};

window.logOut = function logOut() {
  state.auth = null;
  state._authMode = 'login';
  showToast(state.language === 'ar' ? 'تم تسجيل الخروج.' : 'Logged out.', '#64748b');
  navigateTo('auth');
};

window.isLoggedIn = function isLoggedIn() {
  return state.auth && !state.auth.isGuest;
};

window.isGuest = function isGuest() {
  return state.auth && state.auth.isGuest;
};

// ── Copy demo credentials ─────────────────────────────────────
window.copyDemoCred = function copyDemoCred(text, btn) {
  navigator.clipboard?.writeText(text).then(() => {
    // swap icon to check-circle briefly
    const icon = btn.querySelector('i[data-lucide]');
    if (icon) {
      icon.setAttribute('data-lucide', 'check-circle');
      btn.style.color = '#16a34a';
      if (window.lucide) lucide.createIcons();
      setTimeout(() => {
        icon.setAttribute('data-lucide', 'copy');
        btn.style.color = '';
        if (window.lucide) lucide.createIcons();
      }, 1800);
    }
    showToast(
      (state.language === 'ar' ? 'تم النسخ: ' : 'Copied: ') + text,
      '#16a34a'
    );
  });
};
