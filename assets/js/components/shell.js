/* ── helpers ── */
function getProfileInitials() {
  const name = (state.profile && state.profile.fullName && state.profile.fullName.trim()) || '';
  if (!name) return '?';
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

window.toggleJourneyMenu = function toggleJourneyMenu() {
  state.journeyOpen = !state.journeyOpen;
  state.accountOpen = false;
  renderApp();
  if (state.journeyOpen) {
    setTimeout(() => {
      function outsideHandler(e) {
        const dropdown = document.querySelector('.journey-dropdown');
        const trigger  = document.querySelector('[data-journey]');
        if (dropdown && !dropdown.contains(e.target) && trigger && !trigger.contains(e.target)) {
          state.journeyOpen = false;
          renderApp();
          document.removeEventListener('click', outsideHandler, true);
          window.removeEventListener('scroll', scrollHandler, true);
        }
      }
      function scrollHandler() {
        state.journeyOpen = false;
        renderApp();
        document.removeEventListener('click', outsideHandler, true);
        window.removeEventListener('scroll', scrollHandler, true);
      }
      document.addEventListener('click', outsideHandler, true);
      window.addEventListener('scroll', scrollHandler, { passive: true, capture: true });
    }, 0);
  }
};

window.guardedNavigate = function guardedNavigate(view) {
  if (!guardView(view)) return;
  navigateTo(view);
};

/* ──────────────────────────────────────────────
   Journey dropdown — 4 core steps only
────────────────────────────────────────────── */
function getJourneyDropdownItems() {
  const isAr = state.language === 'ar';
  return [
    { id: 'test',     icon: 'clipboard-list', labelEn: 'Assessment',  labelAr: 'الاختبار' },
    { id: 'results',  icon: 'bar-chart-3',    labelEn: 'Results',     labelAr: 'النتائج' },
    { id: 'roadmap',  icon: 'route',          labelEn: 'Roadmap',     labelAr: 'خارطة التطور' },
    { id: 'progress', icon: 'target',         labelEn: 'Progress',    labelAr: 'تقدمي' },
  ];
}

window.renderHeader = function renderHeader() {
  const isAr        = state.language === 'ar';
  const dir         = state.direction;
  const hasProfile  = state.profile?.fullName?.trim();
  const initials    = getProfileInitials();
  const isPro       = state.premiumUnlocked;
  const journeyItems = getJourneyDropdownItems();
  const journeyIds   = journeyItems.map(i => i.id);
  const isJourneyActive  = journeyIds.includes(state.currentView);
  const isAccountActive  = state.currentView === 'profile' || state.currentView === 'auth';

  return `
    <header class="app-header">
      <div class="container-shell">
        <div class="header-row">

          <!-- Brand -->
          <button class="brand-block" onclick="navigateTo('home')">
            <span class="brand-mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent)">
                <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
              </svg>
            </span>
            <span class="brand-name">TrackUp</span>
          </button>

          <!-- Desktop Nav -->
          <nav class="desktop-nav">

            <!-- Home -->
            <button class="nav-link ${state.currentView === 'home' ? 'is-active' : ''}" onclick="navigateTo('home')">
              ${isAr ? 'الرئيسية' : 'Home'}
            </button>

            <!-- Journey dropdown (4 items) -->
            <div style="position:relative;">
              <button class="nav-link ${isJourneyActive ? 'is-active' : ''}" data-journey="true" onclick="toggleJourneyMenu()">
                <span>${isAr ? 'رحلتي' : 'Journey'}</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                  style="transition:transform .2s;transform:${state.journeyOpen ? 'rotate(180deg)' : 'rotate(0deg)'}">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              ${state.journeyOpen ? `
                <div class="journey-dropdown surface-panel fade-up-soft"
                  style="position:absolute;top:calc(100% + 8px);${dir === 'rtl' ? 'left:0;' : 'right:0;'}min-width:200px;z-index:300;padding:.4rem;">
                  ${journeyItems.map(item => {
                    const isActive = state.currentView === item.id;
                    return `
                      <button
                        class="journey-item ${isActive ? 'is-active' : ''}"
                        onclick="guardedNavigate('${item.id}')">
                        <i data-lucide="${item.icon}" style="width:14px;height:14px;flex-shrink:0;color:var(--accent);"></i>
                        <span style="flex:1;text-align:start;">${isAr ? item.labelAr : item.labelEn}</span>
                      </button>`;
                  }).join('')}
                </div>
              ` : ''}
            </div>

            <!-- Mentors (top-level) -->
            <button class="nav-link ${state.currentView === 'mentors' ? 'is-active' : ''}" onclick="navigateTo('mentors')">
              ${isAr ? 'المرشدون' : 'Mentors'}
            </button>

            <!-- Pricing (top-level) -->
            <button class="nav-link ${state.currentView === 'pricing' ? 'is-active' : ''}" onclick="navigateTo('pricing')">
              ${isAr ? 'الأسعار' : 'Pricing'}
            </button>

          </nav>

          <!-- Actions -->
          <div class="header-actions">

            <!-- Language -->
            <button class="btn-icon" onclick="switchLanguage()" title="${state.language === 'en' ? 'العربية' : 'English'}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>
              </svg>
            </button>

            <!-- Theme -->
            <button class="btn-icon" onclick="switchTheme()" title="${state.theme === 'dark' ? t('light') : t('dark')}">
              ${state.theme === 'dark'
                ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`
                : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`
              }
            </button>

            <!-- Reset -->
            <button class="btn-icon" onclick="resetDemo()" title="Reset">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>

            <!-- Account dropdown -->
            <div style="position:relative;">
              <button
                class="nav-avatar ${isPro ? 'nav-avatar--pro' : ''} ${isAccountActive ? 'is-active' : ''}"
                data-account="true"
                onclick="toggleAccountMenu()"
                title="${hasProfile ? state.profile.fullName : (isAr ? 'الحساب' : 'Account')}">
                ${hasProfile
                  ? `<span class="nav-avatar-initials">${initials}</span>${isPro ? `<span class="nav-avatar-badge">PRO</span>` : ''}`
                  : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`
                }
              </button>

              ${state.accountOpen ? `
                <div class="account-dropdown surface-panel fade-up-soft"
                  style="position:absolute;top:calc(100% + 8px);${dir === 'rtl' ? 'left:0;' : 'right:0;'}min-width:220px;z-index:300;">

                  ${hasProfile ? `
                    <div style="padding:.75rem 1rem .6rem;border-bottom:1px solid var(--border);">
                      <div style="font-weight:700;font-size:.9rem;">${state.profile.fullName}</div>
                      ${state.profile.email ? `<div class="text-muted" style="font-size:.78rem;margin-top:.15rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${state.profile.email}</div>` : ''}
                      ${isPro ? `<div class="eyebrow" style="color:var(--accent);font-size:.68rem;margin-top:.35rem;">Premium</div>` : ''}
                    </div>
                  ` : ''}

                  <div style="padding:.5rem;display:grid;gap:.2rem;">
                    <button class="journey-item ${state.currentView === 'profile' ? 'is-active' : ''}" onclick="navigateTo('profile');state.accountOpen=false;renderApp();">
                      <i data-lucide="user-round" style="width:14px;height:14px;color:var(--accent);"></i>
                      <span>${isAr ? 'ملفي' : 'My Profile'}</span>
                    </button>
                    ${isPro ? `
                      <button class="journey-item ${state.currentView === 'recorded-library' ? 'is-active' : ''}" onclick="navigateTo('recorded-library');state.accountOpen=false;renderApp();">
                        <i data-lucide="library" style="width:14px;height:14px;color:var(--accent);"></i>
                        <span>${isAr ? 'مكتبة الجلسات' : 'Recorded Library'}</span>
                      </button>
                      <button class="journey-item ${state.currentView === 'chat' ? 'is-active' : ''}" onclick="navigateTo('chat');state.accountOpen=false;renderApp();">
                        <i data-lucide="message-square" style="width:14px;height:14px;color:var(--accent);"></i>
                        <span>${isAr ? 'تواصل مع مرشدك' : 'Mentor Chat'}</span>
                      </button>
                      <button class="journey-item ${state.currentView === 'session-booking' ? 'is-active' : ''}" onclick="navigateTo('session-booking');state.accountOpen=false;renderApp();">
                        <i data-lucide="calendar-days" style="width:14px;height:14px;color:var(--accent);"></i>
                        <span>${isAr ? 'احجز جلسة' : 'Book a Session'}</span>
                      </button>
                    ` : `
                      <button class="journey-item" onclick="navigateTo('pricing');state.accountOpen=false;renderApp();" style="color:var(--accent);">
                        <i data-lucide="crown" style="width:14px;height:14px;color:var(--accent);"></i>
                        <span>${isAr ? 'ترقية لـ Premium' : 'Upgrade to Premium'}</span>
                      </button>
                    `}
                    <div style="border-top:1px solid var(--border);margin:.3rem 0;"></div>
                    <button class="journey-item" onclick="navigateTo('auth');state.accountOpen=false;renderApp();">
                      <i data-lucide="log-in" style="width:14px;height:14px;color:var(--text-muted);"></i>
                      <span>${isAr ? 'تسجيل / دخول' : 'Sign In / Up'}</span>
                    </button>
                    <button class="journey-item" onclick="resetDemo()" style="color:var(--danger,#dc2626);">
                      <i data-lucide="rotate-ccw" style="width:14px;height:14px;color:var(--danger,#dc2626);"></i>
                      <span>${t('resetNow') || 'Reset'}</span>
                    </button>
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Mobile hamburger -->
            <button class="btn-icon mobile-toggle" onclick="toggleMobileMenu()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>

          </div>
        </div>
      </div>
    </header>
  `;
};

window.renderMobilePanel = function renderMobilePanel() {
  const isAr       = state.language === 'ar';
  const isPro      = state.premiumUnlocked;
  const initials   = getProfileInitials();
  const hasProfile = state.profile?.fullName?.trim();

  /* Flat list — simple and clear on mobile */
  const primaryItems = [
    { id: 'home',      icon: 'house',          labelEn: 'Home',        labelAr: 'الرئيسية' },
    { id: 'test',      icon: 'clipboard-list', labelEn: 'Assessment',  labelAr: 'الاختبار' },
    { id: 'results',   icon: 'bar-chart-3',    labelEn: 'Results',     labelAr: 'النتائج' },
    { id: 'roadmap',   icon: 'route',          labelEn: 'Roadmap',     labelAr: 'خارطة التطور' },
    { id: 'progress',  icon: 'target',         labelEn: 'Progress',    labelAr: 'تقدمي' },
    { id: 'mentors',   icon: 'users-round',    labelEn: 'Mentors',     labelAr: 'المرشدون' },
    { id: 'pricing',   icon: 'credit-card',    labelEn: 'Pricing',     labelAr: 'الأسعار' },
  ];

  const premiumItems = [
    { id: 'session-booking',  icon: 'calendar-days',  labelEn: 'Book a Session',    labelAr: 'احجز جلسة',          lock: !isPro },
    { id: 'recorded-library', icon: 'library',         labelEn: 'Recorded Library',  labelAr: 'مكتبة الجلسات',      lock: !isPro },
    { id: 'chat',             icon: 'message-square',  labelEn: 'Mentor Chat',       labelAr: 'تواصل مع مرشدك',     lock: !isPro },
    { id: 'subtrack-test',    icon: 'flask-conical',   labelEn: 'Sub-track Test',    labelAr: 'اختبار التخصص الدقيق', lock: !state.completedMilestones?.sessionBooked },
    { id: 'sub-track-result', icon: 'crosshair',       labelEn: 'Sub-track Result',  labelAr: 'تخصصك الدقيق',       lock: !state.completedMilestones?.sessionBooked },
  ];

  function renderItem(item) {
    const isActive = state.currentView === item.id;
    const locked   = item.lock;
    return `
      <button
        class="btn ${isActive ? 'btn-secondary' : 'btn-ghost'}"
        style="justify-content:flex-start;gap:.65rem;${locked ? 'opacity:.45;' : ''}"
        onclick="${locked ? `openPremiumLock('${item.id}')` : `guardedNavigate('${item.id}')`}">
        <i data-lucide="${locked ? 'lock' : item.icon}" style="width:15px;height:15px;flex-shrink:0;"></i>
        <span style="flex:1;text-align:start;">${isAr ? item.labelAr : item.labelEn}</span>
        ${locked ? `<span class="nav-lock-badge">${isAr ? 'مقفول' : 'PRO'}</span>` : ''}
      </button>`;
  }

  return `
    <div class="mobile-panel ${state.mobileMenuOpen ? 'is-open' : ''}" onclick="closeMobileMenu(event)">
      <div class="mobile-sheet" onclick="event.stopPropagation()">

        <div class="page-header" style="margin-bottom:1rem;">
          <div class="brand-block" style="pointer-events:none;">
            <span class="brand-mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent)">
                <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
              </svg>
            </span>
            <span class="brand-name">TrackUp</span>
          </div>
          <button class="btn-icon" onclick="toggleMobileMenu()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        ${hasProfile ? `
          <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem;background:var(--surface-2);border-radius:14px;margin-bottom:1rem;">
            <div class="nav-avatar ${isPro ? 'nav-avatar--pro' : ''}" style="pointer-events:none;">
              <span class="nav-avatar-initials">${initials}</span>
              ${isPro ? `<span class="nav-avatar-badge">PRO</span>` : ''}
            </div>
            <div>
              <div style="font-weight:700;font-size:.9rem;">${state.profile.fullName}</div>
              ${isPro
                ? `<div class="eyebrow" style="color:var(--accent);font-size:.7rem;">Premium</div>`
                : `<div class="text-muted" style="font-size:.78rem;">${t('free')}</div>`}
            </div>
          </div>
        ` : ''}

        <div style="display:grid;gap:1.2rem;">

          <!-- Main -->
          <div style="display:grid;gap:.3rem;">
            ${primaryItems.map(renderItem).join('')}
          </div>

          <!-- Premium section -->
          <div>
            <div class="eyebrow" style="padding:0 .5rem .5rem;display:flex;align-items:center;gap:.4rem;">
              <i data-lucide="crown" style="width:11px;height:11px;color:var(--accent);"></i>
              Premium
            </div>
            <div style="display:grid;gap:.3rem;">
              ${premiumItems.map(renderItem).join('')}
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
};

window.renderBottomNav = function renderBottomNav() {
  const isAr = state.language === 'ar';
  const items = [
    { id: 'home',    icon: 'house',          labelEn: 'Home',     labelAr: 'الرئيسية' },
    { id: 'test',    icon: 'clipboard-list', labelEn: 'Test',     labelAr: 'اختبار' },
    { id: 'results', icon: 'bar-chart-3',    labelEn: 'Results',  labelAr: 'النتائج' },
    { id: 'progress',icon: 'target',         labelEn: 'Progress', labelAr: 'تقدمي' },
    { id: 'profile', icon: 'user-round',     labelEn: 'Profile',  labelAr: 'ملفي' }
  ];
  return `
    <div class="mobile-bottom-nav">
      <div class="mobile-bottom-grid">
        ${items.map(item => `
          <button class="mobile-bottom-item ${state.currentView === item.id ? 'is-active' : ''}" onclick="guardedNavigate('${item.id}')">
            <i data-lucide="${item.icon}" style="width:20px;height:20px;"></i>
            <span>${isAr ? item.labelAr : item.labelEn}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
};
