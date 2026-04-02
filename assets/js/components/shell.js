/* ── helpers ── */
function getProfileInitials() {
  const name = (state.profile && state.profile.fullName && state.profile.fullName.trim()) || '';
  if (!name) return '?';
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/* ── Nested dropdown state ── */
if (!window._navSubOpen) window._navSubOpen = null;

window.toggleJourneyMenu = function toggleJourneyMenu() {
  state.journeyOpen  = !state.journeyOpen;
  state.accountOpen  = false;
  window._navSubOpen = null;
  renderApp();
  if (state.journeyOpen) {
    setTimeout(() => {
      function outsideHandler(e) {
        const dd = document.querySelector('.journey-dropdown');
        const tr = document.querySelector('[data-journey]');
        if (dd && !dd.contains(e.target) && tr && !tr.contains(e.target)) {
          state.journeyOpen  = false;
          window._navSubOpen = null;
          renderApp();
          document.removeEventListener('click', outsideHandler, true);
          window.removeEventListener('scroll', scrollHandler, true);
        }
      }
      function scrollHandler() {
        state.journeyOpen  = false;
        window._navSubOpen = null;
        renderApp();
        document.removeEventListener('click', outsideHandler, true);
        window.removeEventListener('scroll', scrollHandler, true);
      }
      document.addEventListener('click', outsideHandler, true);
      window.addEventListener('scroll', scrollHandler, { passive: true, capture: true });
    }, 0);
  }
};

window.openNavSub = function openNavSub(key, e) {
  e && e.stopPropagation();
  window._navSubOpen = window._navSubOpen === key ? null : key;
  renderApp();
};

window.guardedNavigate = function guardedNavigate(view) {
  if (!guardView(view)) return;
  navigateTo(view);
};

/* ── Journey sub-menu data ── */
function getJourneySubs() {
  const isPremium   = state.premiumUnlocked;
  const sessionDone = state.completedMilestones?.sessionBooked;
  const isAr        = state.language === 'ar';

  return [
    {
      key: 'path',
      icon: 'map',
      labelEn: 'Your Path',
      labelAr: 'مسارك',
      items: [
        { id: 'profile',       icon: 'user-round',     labelEn: 'Profile',        labelAr: 'ملفي' },
        { id: 'test',          icon: 'clipboard-list', labelEn: 'Assessment',     labelAr: 'الاختبار' },
        { id: 'results',       icon: 'bar-chart-3',    labelEn: 'Results',        labelAr: 'النتائج' },
        { id: 'track-details', icon: 'layers-3',       labelEn: 'Track Details',  labelAr: 'تفاصيل المسار' },
        { id: 'roadmap',       icon: 'route',          labelEn: 'Roadmap',        labelAr: 'خارطة التطور' },
        { id: 'platforms',     icon: 'layout-grid',    labelEn: 'Platforms',      labelAr: 'منصات التعلم' },
        { id: 'progress',      icon: 'target',         labelEn: 'Progress',       labelAr: 'تقدمي' },
      ]
    },
    {
      key: 'support',
      icon: 'users-round',
      labelEn: 'Expert Support',
      labelAr: 'الدعم المتخصص',
      items: [
        { id: 'mentors',         icon: 'users-round',   labelEn: 'Mentors',         labelAr: 'المرشدين' },
        { id: 'session-booking', icon: 'calendar-days', labelEn: 'Book a Session',  labelAr: 'احجز جلسة', lock: !isPremium },
      ]
    },
    {
      key: 'premium',
      icon: 'crown',
      labelEn: 'Premium',
      labelAr: 'Premium',
      items: [
        { id: 'recorded-library', icon: 'library',        labelEn: 'Recorded Library',    labelAr: 'مكتبة الجلسات',       lock: !isPremium },
        { id: 'chat',             icon: 'message-square', labelEn: 'Mentor Chat',          labelAr: 'تواصل مع مرشدك',      lock: !isPremium },
        { id: 'subtrack-test',    icon: 'flask-conical',  labelEn: 'Sub-track Test',       labelAr: 'اختبار التخصص الدقيق', lock: !sessionDone },
        { id: 'sub-track-result', icon: 'crosshair',      labelEn: 'Sub-track Result',     labelAr: 'تخصصك الدقيق',        lock: !sessionDone },
      ]
    }
  ];
}

window.renderHeader = function renderHeader() {
  const isAr         = state.language === 'ar';
  const hasProfile   = state.profile?.fullName?.trim();
  const initials     = getProfileInitials();
  const isPro        = state.premiumUnlocked;
  const subs         = getJourneySubs();
  const allJourneyIds = subs.flatMap(s => s.items.map(i => i.id));
  const isJourneyActive = allJourneyIds.includes(state.currentView);
  const isAccountActive = state.currentView === 'profile' || state.currentView === 'auth';
  const dir          = state.direction;

  /* ── nested sub-panel HTML ── */
  function renderSubPanel(sub) {
    const isOpen   = window._navSubOpen === sub.key;
    const subLabel = isAr ? sub.labelAr : sub.labelEn;
    const hasActive = sub.items.some(i => i.id === state.currentView);

    return `
      <div class="nav-sub-group" data-sub="${sub.key}">
        <button
          class="journey-item nav-sub-trigger ${hasActive ? 'is-active' : ''}"
          onclick="openNavSub('${sub.key}', event)">
          <i data-lucide="${sub.icon}" style="width:14px;height:14px;flex-shrink:0;color:var(--accent);"></i>
          <span style="flex:1;text-align:start;">${subLabel}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            style="flex-shrink:0;transition:transform .18s;transform:${isOpen ? 'rotate(90deg)' : (dir==='rtl'?'rotate(180deg)':'rotate(0deg)')};color:var(--text-muted);">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>

        ${isOpen ? `
          <div class="nav-sub-panel fade-up-soft">
            ${sub.items.map(item => {
              const isActive = state.currentView === item.id;
              const locked   = item.lock;
              return `
                <button
                  class="journey-item journey-sub-item ${isActive ? 'is-active' : ''} ${locked ? 'is-locked' : ''}"
                  onclick="${locked ? `openPremiumLock('${item.id}')` : `guardedNavigate('${item.id}')`}"
                  style="${locked ? 'opacity:.5;' : ''}">
                  <i data-lucide="${locked ? 'lock' : item.icon}" style="width:13px;height:13px;flex-shrink:0;color:${locked ? 'var(--text-muted)' : 'var(--accent)'};"></i>
                  <span style="flex:1;text-align:start;font-size:.84rem;">${isAr ? item.labelAr : item.labelEn}</span>
                  ${locked ? `<span class="nav-lock-badge">${isAr ? 'مقفول' : 'PRO'}</span>` : ''}
                </button>`;
            }).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

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
              ${t('home')}
            </button>

            <!-- Journey (nested) -->
            <div style="position:relative;">
              <button class="nav-link ${isJourneyActive ? 'is-active' : ''}" data-journey="true" onclick="toggleJourneyMenu()">
                <span>${t('journey')}</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                  style="transition:transform .2s;transform:${state.journeyOpen ? 'rotate(180deg)' : 'rotate(0deg)'}">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              ${state.journeyOpen ? `
                <div class="journey-dropdown surface-panel fade-up-soft"
                  style="position:absolute;top:calc(100% + 8px);${dir === 'rtl' ? 'left:0;' : 'right:0;'}min-width:260px;z-index:300;">
                  <div class="journey-dropdown-header">
                    <span class="eyebrow">${t('journey')}</span>
                  </div>
                  <div class="journey-dropdown-items" style="padding:.4rem;display:grid;gap:.2rem;">
                    ${subs.map(s => renderSubPanel(s)).join('')}
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Pricing -->
            <button class="nav-link ${state.currentView === 'pricing' ? 'is-active' : ''}" onclick="navigateTo('pricing')">
              ${t('pricing')}
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
                  style="position:absolute;top:calc(100% + 8px);${dir === 'rtl' ? 'left:0;' : 'right:0;'}min-width:200px;z-index:300;">

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
                      <span>${t('profile')}</span>
                    </button>
                    <button class="journey-item ${state.currentView === 'auth' ? 'is-active' : ''}" onclick="navigateTo('auth');state.accountOpen=false;renderApp();">
                      <i data-lucide="log-in" style="width:14px;height:14px;color:var(--accent);"></i>
                      <span>${isAr ? 'تسجيل / دخول' : 'Sign In / Up'}</span>
                    </button>
                    <div style="border-top:1px solid var(--border);margin:.3rem 0;"></div>
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
  const isAr      = state.language === 'ar';
  const isPremium = state.premiumUnlocked;
  const sessionDone = state.completedMilestones?.sessionBooked;
  const initials  = getProfileInitials();
  const hasProfile = state.profile?.fullName?.trim();
  const isPro = state.premiumUnlocked;

  const sections = [
    {
      titleEn: 'Your Path', titleAr: 'مسارك',
      items: [
        { id: 'home',          icon: 'house',          labelEn: 'Home',           labelAr: 'الرئيسية' },
        { id: 'profile',       icon: 'user-round',     labelEn: 'Profile',        labelAr: 'ملفي' },
        { id: 'test',          icon: 'clipboard-list', labelEn: 'Assessment',     labelAr: 'الاختبار' },
        { id: 'results',       icon: 'bar-chart-3',    labelEn: 'Results',        labelAr: 'النتائج' },
        { id: 'track-details', icon: 'layers-3',       labelEn: 'Track Details',  labelAr: 'تفاصيل المسار' },
        { id: 'roadmap',       icon: 'route',          labelEn: 'Roadmap',        labelAr: 'خارطة التطور' },
        { id: 'platforms',     icon: 'layout-grid',    labelEn: 'Platforms',      labelAr: 'منصات التعلم' },
        { id: 'progress',      icon: 'target',         labelEn: 'Progress',       labelAr: 'تقدمي' },
        { id: 'pricing',       icon: 'credit-card',    labelEn: 'Pricing',        labelAr: 'الأسعار' },
      ]
    },
    {
      titleEn: 'Expert Support', titleAr: 'الدعم المتخصص',
      items: [
        { id: 'mentors',         icon: 'users-round',   labelEn: 'Mentors',        labelAr: 'المرشدين' },
        { id: 'session-booking', icon: 'calendar-days', labelEn: 'Book a Session', labelAr: 'احجز جلسة', lock: !isPremium },
      ]
    },
    {
      titleEn: 'Premium', titleAr: 'Premium',
      items: [
        { id: 'recorded-library', icon: 'library',        labelEn: 'Recorded Library',     labelAr: 'مكتبة الجلسات',        lock: !isPremium },
        { id: 'chat',             icon: 'message-square', labelEn: 'Mentor Chat',           labelAr: 'تواصل مع مرشدك',       lock: !isPremium },
        { id: 'subtrack-test',    icon: 'flask-conical',  labelEn: 'Sub-track Test',        labelAr: 'اختبار التخصص الدقيق',  lock: !sessionDone },
        { id: 'sub-track-result', icon: 'crosshair',      labelEn: 'Sub-track Result',      labelAr: 'تخصصك الدقيق',         lock: !sessionDone },
      ]
    }
  ];

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

        <div style="display:grid;gap:1rem;">
          ${sections.map(sec => `
            <div>
              <div class="eyebrow" style="padding:0 .5rem .5rem;">${isAr ? sec.titleAr : sec.titleEn}</div>
              <div style="display:grid;gap:.3rem;">
                ${sec.items.map(item => {
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
                }).join('')}
              </div>
            </div>
          `).join('')}
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
