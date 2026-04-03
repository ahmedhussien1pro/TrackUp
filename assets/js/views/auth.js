// ============================================================
// auth.js — Login / Register / Guest gate
// UC1: Welcome stepper shown on first-time register success
// ============================================================

window.renderAuthView = function renderAuthView() {
  const isAr = state.language === 'ar';
  const mode = state._authMode || 'login';

  // UC1 — post-register welcome stepper
  if (state._showWelcomeStepper) return renderWelcomeStepper(isAr);

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
          <div style="display:grid;gap:.4rem;margin-bottom:.7rem;">
            <div style="display:flex;align-items:center;justify-content:space-between;background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:.38rem .65rem;">
              <div style="display:flex;align-items:center;gap:.4rem;min-width:0;">
                <i data-lucide="at-sign" style="width:.78rem;height:.78rem;color:var(--text-muted);flex-shrink:0;"></i>
                <code style="font-size:.8rem;color:var(--text);letter-spacing:.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">demo@trackup.io</code>
              </div>
              <button type="button" title="${isAr?'نسخ البريد':'Copy email'}" onclick="copyDemoCred('demo@trackup.io',this)"
                style="background:none;border:none;cursor:pointer;padding:.2rem .3rem;border-radius:5px;color:var(--text-muted);flex-shrink:0;display:flex;align-items:center;transition:color .15s;">
                <i data-lucide="copy" style="width:.82rem;height:.82rem;pointer-events:none;"></i>
              </button>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:.38rem .65rem;">
              <div style="display:flex;align-items:center;gap:.4rem;min-width:0;">
                <i data-lucide="key-round" style="width:.78rem;height:.78rem;color:var(--text-muted);flex-shrink:0;"></i>
                <code style="font-size:.8rem;color:var(--text);letter-spacing:.04em;white-space:nowrap;">trackup123</code>
              </div>
              <button type="button" title="${isAr?'نسخ كلمة المرور':'Copy password'}" onclick="copyDemoCred('trackup123',this)"
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
          <div class="tab-bar" style="margin-bottom:1.25rem;">
            <button class="tab-btn ${mode==='login'?'tab-btn--active':''}" onclick="setAuthMode('login')">${isAr?'تسجيل دخول':'Login'}</button>
            <button class="tab-btn ${mode==='register'?'tab-btn--active':''}" onclick="setAuthMode('register')">${isAr?'إنشاء حساب':'Register'}</button>
          </div>
          ${mode === 'login' ? renderLoginForm(isAr) : renderRegisterForm(isAr)}
          <div style="display:flex;align-items:center;gap:.75rem;margin:1.1rem 0;">
            <div style="flex:1;height:1px;background:var(--border);"></div>
            <span style="font-size:.75rem;color:var(--text-faint);">${isAr?'أو':'or'}</span>
            <div style="flex:1;height:1px;background:var(--border);"></div>
          </div>
          <button class="btn btn-secondary" style="width:100%;" onclick="continueAsGuest()">
            <i data-lucide="user" style="width:.9rem;height:.9rem;"></i>
            ${isAr?'متابعة كـ ضيف':'Continue as Guest'}
          </button>
          <p class="text-muted" style="font-size:.74rem;text-align:center;margin-top:.5rem;line-height:1.6;">
            ${isAr?'الضيوف يمكنهم استخدام التقييم والنتائج. يتم حفظ بياناتك محليًا فقط.':'Guests can use the assessment & results. Data is saved locally only.'}
          </p>
        </div>

      </div>
    </div>
  `;
};

// ============================================================
// UC1 — Welcome Stepper (shown once after new registration)
// ============================================================
function renderWelcomeStepper(isAr) {
  const STEPS = [
    { icon: 'user-round',     en: 'Complete your profile',       ar: 'أكمل بياناتك',            view: 'profile' },
    { icon: 'clipboard-list', en: 'Take the quick assessment',   ar: 'اعمل الاختبار السريع',      view: 'pre-test' },
    { icon: 'bar-chart-3',    en: 'See your track results',      ar: 'شوف نتائج مسارك',           view: 'results' },
    { icon: 'route',          en: 'Start your roadmap',          ar: 'ابدأ خارطتك المهنية',       view: 'roadmap' },
    { icon: 'users-round',    en: 'Meet a mentor',               ar: 'تواصل مع مرشد',             view: 'mentors' },
  ];
  const name = state.auth?.name || (isAr ? 'مهندس' : 'Engineer');

  return `
    <div style="display:flex;align-items:center;justify-content:center;min-height:65vh;padding:2rem 0;">
      <div style="width:100%;max-width:520px;" data-aos="fade-up">

        <!-- Hero -->
        <div style="text-align:center;margin-bottom:2rem;">
          <div style="width:64px;height:64px;border-radius:20px;background:var(--accent-soft);
            border:1.5px solid rgba(37,99,235,.2);
            display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;">
            <i data-lucide="rocket" style="width:1.6rem;height:1.6rem;color:var(--accent);"></i>
          </div>
          <h2 style="font-size:1.3rem;font-weight:900;margin-bottom:.4rem;">
            ${isAr ? `أهلاً ${escapeHtml(name)}! جاهز تبدأ؟` : `Welcome, ${escapeHtml(name)}! Ready to start?`}
          </h2>
          <p class="text-muted" style="font-size:.88rem;line-height:1.7;max-width:380px;margin:0 auto;">
            ${isAr
              ? 'رحلتك من 5 خطوات بس — كل خطوة تقربك أكتر من مسارك الصح.'
              : 'Your journey is just 5 steps away — each one brings you closer to the right career path.'}
          </p>
        </div>

        <!-- Steps -->
        <div class="surface-panel section-pad" style="padding:1.1rem 1.2rem;">
          <div style="display:grid;gap:.55rem;">
            ${STEPS.map((s, i) => `
              <div style="display:flex;align-items:center;gap:.85rem;padding:.6rem .55rem;border-radius:11px;
                background:var(--surface-2);border:1px solid var(--border);">
                <div style="width:2rem;height:2rem;border-radius:50%;flex-shrink:0;
                  background:${i===0?'var(--accent)':'var(--surface-3)'};
                  border:2px solid ${i===0?'var(--accent)':'var(--border)'};
                  display:flex;align-items:center;justify-content:center;">
                  ${i===0
                    ? `<i data-lucide="${s.icon}" style="width:.75rem;height:.75rem;color:#fff;"></i>`
                    : `<span style="font-size:.72rem;font-weight:800;color:var(--text-muted);">${i+1}</span>`
                  }
                </div>
                <i data-lucide="${s.icon}" style="width:.9rem;height:.9rem;flex-shrink:0;
                  color:${i===0?'var(--accent)':'var(--text-muted)'};transition:color .2s;"></i>
                <span style="flex:1;font-size:.88rem;font-weight:${i===0?'700':'500'};
                  color:${i===0?'var(--text)':'var(--text-muted)'};"
                >${isAr?s.ar:s.en}</span>
                ${i===0?`<i data-lucide="chevron-${isAr?'left':'right'}" style="width:.8rem;height:.8rem;color:var(--accent);flex-shrink:0;"></i>`:''}
              </div>`).join('')}
          </div>

          <!-- CTA -->
          <div style="display:flex;gap:.65rem;flex-wrap:wrap;margin-top:1.1rem;">
            <button class="btn btn-primary" style="flex:1;min-width:140px;"
              onclick="state._showWelcomeStepper=false;navigateTo('profile');">
              <i data-lucide="arrow-${isAr?'left':'right'}" style="width:.88rem;height:.88rem;"></i>
              ${isAr?'ابدأ الآن':'Start now'}
            </button>
            <button class="btn btn-secondary"
              onclick="state._showWelcomeStepper=false;navigateTo('home');">
              ${isAr?'تخطي':'Skip'}
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

function renderLoginForm(isAr) {
  return `
    <form onsubmit="submitLogin(event)">
      <div class="form-group" style="margin-bottom:.75rem;">
        <label class="form-label">${isAr?'البريد الإلكتروني':'Email'}</label>
        <input class="form-input" id="authEmail" type="email" placeholder="name@mail.com" autocomplete="email" required />
      </div>
      <div class="form-group" style="margin-bottom:.75rem;">
        <label class="form-label">${isAr?'كلمة المرور':'Password'}</label>
        <div style="position:relative;">
          <input class="form-input" id="authPassword" type="password" placeholder="••••••••" autocomplete="current-password" required
            style="padding-${state.direction==='rtl'?'left':'right'}:2.5rem;" />
          <button type="button" onclick="toggleAuthPwd('authPassword',this)"
            style="position:absolute;top:50%;${state.direction==='rtl'?'left':'right'}:.7rem;transform:translateY(-50%);
              background:none;border:none;cursor:pointer;color:var(--text-faint);padding:0;">
            <i data-lucide="eye" style="width:.95rem;height:.95rem;"></i>
          </button>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;margin-top:.25rem;">
        <i data-lucide="log-in" style="width:.9rem;height:.9rem;"></i>
        ${isAr?'دخول':'Login'}
      </button>
    </form>`;
}

function renderRegisterForm(isAr) {
  return `
    <form onsubmit="submitRegister(event)">
      <div class="form-group" style="margin-bottom:.75rem;">
        <label class="form-label">${isAr?'الاسم بالكامل':'Full Name'}</label>
        <input class="form-input" id="regName" type="text" placeholder="${isAr?'مثال: أحمد علي':'e.g. Ahmed Ali'}" autocomplete="name" required />
      </div>
      <div class="form-group" style="margin-bottom:.75rem;">
        <label class="form-label">${isAr?'البريد الإلكتروني':'Email'}</label>
        <input class="form-input" id="regEmail" type="email" placeholder="name@mail.com" autocomplete="email" required />
      </div>
      <div class="form-group" style="margin-bottom:.75rem;">
        <label class="form-label">${isAr?'كلمة المرور':'Password'}</label>
        <div style="position:relative;">
          <input class="form-input" id="regPassword" type="password"
            placeholder="${isAr?'8 أحرف على الأقل':'At least 8 characters'}" autocomplete="new-password" required
            style="padding-${state.direction==='rtl'?'left':'right'}:2.5rem;" />
          <button type="button" onclick="toggleAuthPwd('regPassword',this)"
            style="position:absolute;top:50%;${state.direction==='rtl'?'left':'right'}:.7rem;transform:translateY(-50%);
              background:none;border:none;cursor:pointer;color:var(--text-faint);padding:0;">
            <i data-lucide="eye" style="width:.95rem;height:.95rem;"></i>
          </button>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;margin-top:.25rem;">
        <i data-lucide="user-plus" style="width:.9rem;height:.9rem;"></i>
        ${isAr?'إنشاء الحساب':'Create Account'}
      </button>
    </form>`;
}

// ── Auth actions ─────────────────────────────────────────────────
window.setAuthMode = function setAuthMode(mode) {
  state._authMode = mode;
  renderMainOnly();
};

window.toggleAuthPwd = function toggleAuthPwd(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.innerHTML = `<i data-lucide="${isHidden?'eye-off':'eye'}" style="width:.95rem;height:.95rem;"></i>`;
  if (window.lucide) lucide.createIcons();
};

window.submitLogin = function submitLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('authEmail')?.value?.trim();
  const password = document.getElementById('authPassword')?.value;
  if (!email || !password) return;
  const stored = StorageAPI.get('trackup_user_' + email, null);
  if (!stored) {
    showToast(state.language==='ar'?'البريد غير مسجل.':'Email not registered.', '#dc2626');
    return;
  }
  if (stored.password !== btoa(password)) {
    showToast(state.language==='ar'?'كلمة المرور غلط.':'Wrong password.', '#dc2626');
    return;
  }
  state.auth = { email, name: stored.name, isGuest: false };
  if (stored.profile) state.profile = stored.profile;
  showToast((state.language==='ar'?'أهلًا ':'Welcome ') + stored.name, '#16a34a');
  navigateTo('home');
};

window.submitRegister = function submitRegister(e) {
  e.preventDefault();
  const name     = document.getElementById('regName')?.value?.trim();
  const email    = document.getElementById('regEmail')?.value?.trim();
  const password = document.getElementById('regPassword')?.value;
  if (!name || !email || !password) return;
  if (password.length < 8) {
    showToast(state.language==='ar'?'كلمة المرور أقل من 8 أحرف.':'Password must be 8+ chars.', '#dc2626');
    return;
  }
  const existing = StorageAPI.get('trackup_user_' + email, null);
  if (existing) {
    showToast(state.language==='ar'?'البريد ده مسجل قبل كده.':'Email already registered.', '#f59e0b');
    return;
  }
  StorageAPI.set('trackup_user_' + email, { name, password: btoa(password), profile: state.profile });
  state.auth  = { email, name, isGuest: false };
  state.profile = { ...state.profile, fullName: name, email };
  persistState();
  // UC1 — show welcome stepper once
  state._showWelcomeStepper = true;
  showToast((state.language==='ar'?'أهلاً! ':'Welcome! ') + name, '#16a34a');
  renderMainOnly();
};

window.continueAsGuest = function continueAsGuest() {
  state.auth = { isGuest: true, name: state.language==='ar'?'ضيف':'Guest' };
  showToast(state.language==='ar'?'متابعة كـ ضيف — بياناتك محلية فقط.':'Continuing as guest — data is local only.', '#2563eb');
  navigateTo('home');
};

window.logOut = function logOut() {
  state.auth = null;
  state._authMode = 'login';
  state._showWelcomeStepper = false;
  showToast(state.language==='ar'?'تم تسجيل الخروج.':'Logged out.', '#64748b');
  navigateTo('auth');
};

window.isLoggedIn = function isLoggedIn() { return state.auth && !state.auth.isGuest; };
window.isGuest    = function isGuest()    { return state.auth &&  state.auth.isGuest; };

// ── Copy demo credentials ────────────────────────────────────────────────
window.copyDemoCred = function copyDemoCred(text, btn) {
  navigator.clipboard?.writeText(text).then(() => {
    const icon = btn.querySelector('i[data-lucide]');
    if (icon) {
      icon.setAttribute('data-lucide','check-circle');
      btn.style.color = '#16a34a';
      if (window.lucide) lucide.createIcons();
      setTimeout(() => {
        icon.setAttribute('data-lucide','copy');
        btn.style.color = '';
        if (window.lucide) lucide.createIcons();
      }, 1800);
    }
    showToast((state.language==='ar'?'تم النسخ: ':'Copied: ') + text, '#16a34a');
  });
};
