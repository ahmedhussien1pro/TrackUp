/* ── helpers ── */
function getProfileInitials() {
  const name = (state.profile && state.profile.fullName && state.profile.fullName.trim()) || '';
  if (!name) return '?';
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// ── Dropdown togglers — patch header only, never full re-render ──
window.toggleJourneyMenu = function toggleJourneyMenu() {
  state.journeyOpen  = !state.journeyOpen;
  state.exploreOpen  = false;
  state.accountOpen  = false;
  patchHeader();
  if (state.journeyOpen) _addOutsideClose('.journey-dropdown', '[data-journey]', 'journeyOpen');
};

window.toggleExploreMenu = function toggleExploreMenu() {
  state.exploreOpen  = !state.exploreOpen;
  state.journeyOpen  = false;
  state.accountOpen  = false;
  patchHeader();
  if (state.exploreOpen) _addOutsideClose('.explore-dropdown', '[data-explore]', 'exploreOpen');
};

function _addOutsideClose(dropSel, trigSel, stateKey) {
  setTimeout(() => {
    function outsideHandler(e) {
      const drop = document.querySelector(dropSel);
      const trig = document.querySelector(trigSel);
      if (drop && !drop.contains(e.target) && trig && !trig.contains(e.target)) {
        state[stateKey] = false;
        patchHeader();
        document.removeEventListener('click', outsideHandler, true);
        window.removeEventListener('scroll', scrollHandler, { capture: true });
      }
    }
    function scrollHandler() {
      state[stateKey] = false;
      patchHeader();
      document.removeEventListener('click', outsideHandler, true);
      window.removeEventListener('scroll', scrollHandler, { capture: true });
    }
    document.addEventListener('click', outsideHandler, true);
    window.addEventListener('scroll', scrollHandler, { passive: true, capture: true });
  }, 0);
}

window.toggleMobileMenu = function toggleMobileMenu() {
  state.mobileMenuOpen = !state.mobileMenuOpen;
  patchMobilePanel();
};

window.closeMobileMenu = function closeMobileMenu(event) {
  if (event) event.stopPropagation();
  state.mobileMenuOpen = false;
  patchMobilePanel();
};

window.guardedNavigate = function guardedNavigate(view) {
  if (!guardView(view)) return;
  navigateTo(view);
};

/* ──────────────────────────────────────────────
   Dropdown item definitions
────────────────────────────────────────────── */
function getJourneyItems() {
  return [
    { id: 'profile',  icon: 'user-round',     labelEn: 'Profile',     labelAr: 'ملفي' },
    { id: 'test',     icon: 'clipboard-list', labelEn: 'Assessment',  labelAr: 'الاختبار' },
    { id: 'results',  icon: 'bar-chart-3',    labelEn: 'Results',     labelAr: 'النتائج' },
    { id: 'roadmap',  icon: 'route',          labelEn: 'Roadmap',     labelAr: 'خارطة الطريق' },
    { id: 'progress', icon: 'target',         labelEn: 'Progress',    labelAr: 'تقدمي' },
  ];
}

function getExploreItems(isPro) {
  const sessionDone = state.completedMilestones?.sessionBooked;
  return [
    { id: 'track-details',    icon: 'layers-3',       labelEn: 'Tracks',           labelAr: 'التخصصات',              lock: false },
    { id: 'platforms',        icon: 'layout-grid',    labelEn: 'Platforms',        labelAr: 'منصات التعلم',          lock: false },
    { id: 'mentors',          icon: 'users-round',    labelEn: 'Mentors',          labelAr: 'المرشدون',              lock: false },
    { id: 'recorded-library', icon: 'library',        labelEn: 'Recorded Library', labelAr: 'الجلسات المسجّلة',     lock: !isPro },
    { id: 'subtrack-test',    icon: 'flask-conical',  labelEn: 'Specialization',   labelAr: 'اكتشف تخصصك',          lock: !sessionDone },
  ];
}

/* ── renderHeader ── */
window.renderHeader = function renderHeader() {
  const isAr        = state.language === 'ar';
  const dir         = state.direction;
  const hasProfile  = state.profile?.fullName?.trim();
  const initials    = getProfileInitials();
  const isPro       = state.premiumUnlocked;

  const journeyIds  = getJourneyItems().map(i => i.id);
  const exploreIds  = getExploreItems(isPro).map(i => i.id);
  const isJourneyActive = journeyIds.includes(state.currentView);
  const isExploreActive = exploreIds.includes(state.currentView);
  const isAccountActive = state.currentView === 'profile' || state.currentView === 'auth';

  function ddItem(item, guardFn = 'guardedNavigate') {
    const isActive = state.currentView === item.id;
    return `
      <button
        class="nav-dd-item ${isActive ? 'is-active' : ''} ${item.lock ? 'is-locked' : ''}"
        onclick="${item.lock ? `openPremiumLock('${item.id}')` : `${guardFn}('${item.id}')`}">
        <i data-lucide="${item.lock ? 'lock' : item.icon}" style="width:14px;height:14px;flex-shrink:0;color:${item.lock ? 'var(--text-faint)' : 'var(--accent)'};"></i>
        <span style="flex:1;text-align:start;">${isAr ? item.labelAr : item.labelEn}</span>
        ${item.lock ? `<span style="font-size:.65rem;font-weight:800;color:var(--accent);background:var(--accent-soft);padding:.1rem .45rem;border-radius:99px;">PRO</span>` : ''}
      </button>`;
  }

  function buildDropdown(items, cls, guardFn) {
    return `<div class="nav-dropdown surface-panel fade-up-soft ${cls}"
      style="position:absolute;top:calc(100% + 10px);${dir === 'rtl' ? 'left:0;' : 'right:0;'}min-width:210px;z-index:300;padding:.4rem;">
      ${items.map(i => ddItem(i, guardFn)).join('')}
    </div>`;
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

          <!-- Desktop Nav: Home | Journey | Explore | Pricing (NO Sessions, NO Reset) -->
          <nav class="desktop-nav">

            <button class="nav-link ${state.currentView === 'home' ? 'is-active' : ''}" onclick="navigateTo('home')">
              ${isAr ? 'الرئيسية' : 'Home'}
            </button>

            <!-- Journey dropdown -->
            <div style="position:relative;">
              <button class="nav-link ${isJourneyActive ? 'is-active' : ''}" data-journey="true" onclick="toggleJourneyMenu()">
                <span>${isAr ? 'رحلتي' : 'Journey'}</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                  style="transition:transform .2s;transform:${state.journeyOpen ? 'rotate(180deg)' : 'rotate(0)'}">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              ${state.journeyOpen ? buildDropdown(getJourneyItems(), 'journey-dropdown', 'guardedNavigate') : ''}
            </div>

            <!-- Explore dropdown -->
            <div style="position:relative;">
              <button class="nav-link ${isExploreActive ? 'is-active' : ''}" data-explore="true" onclick="toggleExploreMenu()">
                <span>${isAr ? 'استكشف' : 'Explore'}</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                  style="transition:transform .2s;transform:${state.exploreOpen ? 'rotate(180deg)' : 'rotate(0)'}">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              ${state.exploreOpen ? buildDropdown(getExploreItems(isPro), 'explore-dropdown', 'navigateTo') : ''}
            </div>

            <button class="nav-link ${state.currentView === 'pricing' ? 'is-active' : ''}" onclick="navigateTo('pricing')">
              ${isAr ? 'الباقات' : 'Pricing'}
            </button>

          </nav>

          <!-- Actions: Language + Theme + Account (NO Reset button here) -->
          <div class="header-actions">

            <!-- Language -->
            <button class="btn-icon" onclick="switchLanguage()" title="${state.language === 'en' ? 'العربية' : 'English'}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>
              </svg>
            </button>

            <!-- Theme -->
            <button class="btn-icon" onclick="switchTheme()" title="${state.theme === 'dark' ? (isAr ? 'فاتح' : 'Light') : (isAr ? 'داكن' : 'Dark')}">
              ${state.theme === 'dark'
                ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`
                : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`
              }
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
                <div class="nav-dropdown account-dropdown surface-panel fade-up-soft"
                  style="position:absolute;top:calc(100% + 10px);${dir === 'rtl' ? 'left:0;' : 'right:0;'}min-width:230px;z-index:300;">

                  ${hasProfile ? `
                    <div style="padding:.8rem 1rem .65rem;border-bottom:1px solid var(--border);">
                      <div style="font-weight:700;font-size:.9rem;">${state.profile.fullName}</div>
                      ${state.profile.email ? `<div class="text-muted" style="font-size:.78rem;margin-top:.15rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${state.profile.email}</div>` : ''}
                      ${isPro ? `<div style="display:inline-flex;align-items:center;gap:.3rem;margin-top:.4rem;background:var(--accent-soft);border-radius:99px;padding:.15rem .6rem;"><i data-lucide="crown" style="width:.65rem;height:.65rem;color:var(--accent);"></i><span style="font-size:.68rem;font-weight:800;color:var(--accent);">Premium</span></div>` : ''}
                    </div>
                  ` : ''}

                  <div style="padding:.5rem;display:grid;gap:.15rem;">
                    <button class="nav-dd-item ${state.currentView === 'profile' ? 'is-active' : ''}" onclick="navigateTo('profile')">
                      <i data-lucide="user-round" style="width:14px;height:14px;color:var(--accent);"></i>
                      <span>${isAr ? 'ملفي الشخصي' : 'My Profile'}</span>
                    </button>
                    <button class="nav-dd-item ${state.currentView === 'progress' ? 'is-active' : ''}" onclick="navigateTo('progress')">
                      <i data-lucide="target" style="width:14px;height:14px;color:var(--accent);"></i>
                      <span>${isAr ? 'متابعة تقدمي' : 'My Progress'}</span>
                    </button>

                    ${isPro ? `
                      <div style="border-top:1px solid var(--border);margin:.25rem 0;"></div>
                      <button class="nav-dd-item ${state.currentView === 'recorded-library' ? 'is-active' : ''}" onclick="navigateTo('recorded-library')">
                        <i data-lucide="library" style="width:14px;height:14px;color:var(--accent);"></i>
                        <span>${isAr ? 'الجلسات المسجّلة' : 'Recorded Library'}</span>
                      </button>
                      <button class="nav-dd-item ${state.currentView === 'chat' ? 'is-active' : ''}" onclick="navigateTo('chat')">
                        <i data-lucide="message-square" style="width:14px;height:14px;color:var(--accent);"></i>
                        <span>${isAr ? 'تواصل مع مرشدك' : 'Mentor Chat'}</span>
                      </button>
                      <button class="nav-dd-item ${state.currentView === 'session-booking' ? 'is-active' : ''}" onclick="guardedNavigate('session-booking')">
                        <i data-lucide="calendar-days" style="width:14px;height:14px;color:var(--accent);"></i>
                        <span>${isAr ? 'احجز جلسة' : 'Book a Session'}</span>
                      </button>
                    ` : `
                      <div style="border-top:1px solid var(--border);margin:.25rem 0;"></div>
                      <button class="nav-dd-item" onclick="navigateTo('pricing')" style="color:var(--accent);">
                        <i data-lucide="crown" style="width:14px;height:14px;color:var(--accent);"></i>
                        <span>${isAr ? 'ترقية لـ Premium' : 'Upgrade to Premium'}</span>
                      </button>
                    `}

                    <div style="border-top:1px solid var(--border);margin:.25rem 0;"></div>
                    <button class="nav-dd-item" onclick="navigateTo('auth')">
                      <i data-lucide="log-in" style="width:14px;height:14px;color:var(--text-muted);"></i>
                      <span>${isAr ? 'تسجيل / دخول' : 'Sign In / Up'}</span>
                    </button>
                    <button class="nav-dd-item" onclick="resetDemo()" style="color:var(--danger,#dc2626);">
                      <i data-lucide="rotate-ccw" style="width:14px;height:14px;color:var(--danger,#dc2626);"></i>
                      <span>${isAr ? 'إعادة ضبط' : 'Reset Demo'}</span>
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

/* ── Mobile Panel ── */
window.renderMobilePanel = function renderMobilePanel() {
  const isAr       = state.language === 'ar';
  const isPro      = state.premiumUnlocked;
  const initials   = getProfileInitials();
  const hasProfile = state.profile?.fullName?.trim();
  const sessionDone = state.completedMilestones?.sessionBooked;

  const primaryItems = [
    { id: 'home',      icon: 'house',          labelEn: 'Home',         labelAr: 'الرئيسية' },
    { id: 'test',      icon: 'clipboard-list', labelEn: 'Assessment',   labelAr: 'الاختبار' },
    { id: 'results',   icon: 'bar-chart-3',    labelEn: 'Results',      labelAr: 'النتائج' },
    { id: 'roadmap',   icon: 'route',          labelEn: 'Roadmap',      labelAr: 'خارطة الطريق' },
    { id: 'progress',  icon: 'target',         labelEn: 'Progress',     labelAr: 'متابعة تقدمي' },
    { id: 'mentors',   icon: 'users-round',    labelEn: 'Mentors',      labelAr: 'المرشدون' },
    { id: 'pricing',   icon: 'credit-card',    labelEn: 'Pricing',      labelAr: 'الباقات' },
  ];

  const premiumItems = [
    { id: 'session-booking',  icon: 'calendar-days',  labelEn: 'Book a Session',   labelAr: 'احجز جلسة',             lock: !isPro },
    { id: 'recorded-library', icon: 'library',         labelEn: 'Recorded Library', labelAr: 'الجلسات المسجّلة',     lock: !isPro },
    { id: 'chat',             icon: 'message-square',  labelEn: 'Mentor Chat',      labelAr: 'تواصل مع مرشدك',        lock: !isPro },
    { id: 'subtrack-test',    icon: 'flask-conical',   labelEn: 'Specialization',   labelAr: 'اكتشف تخصصك',          lock: !sessionDone },
    { id: 'sub-track-result', icon: 'crosshair',       labelEn: 'Sub-track Result', labelAr: 'تخصصك الدقيق',         lock: !sessionDone },
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
        ${locked ? `<span class="nav-lock-badge">${isAr ? 'مدفوع' : 'PRO'}</span>` : ''}
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
          <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem;background:var(--surface-2,var(--surface));border-radius:14px;margin-bottom:1rem;border:1px solid var(--border);">
            <div class="nav-avatar ${isPro ? 'nav-avatar--pro' : ''}" style="pointer-events:none;">
              <span class="nav-avatar-initials">${initials}</span>
              ${isPro ? `<span class="nav-avatar-badge">PRO</span>` : ''}
            </div>
            <div>
              <div style="font-weight:700;font-size:.9rem;">${state.profile.fullName}</div>
              ${isPro
                ? `<div style="font-size:.72rem;font-weight:700;color:var(--accent);margin-top:.1rem;">Premium</div>`
                : `<div class="text-muted" style="font-size:.78rem;">${isAr ? 'مجاني' : 'Free Plan'}</div>`}
            </div>
            ${!isPro ? `<button class="btn btn-primary" style="margin-${isAr?'right':'left'}:auto;font-size:.75rem;padding:.3rem .75rem;" onclick="navigateTo('pricing');closeMobileMenu();">${isAr?'ترقية':'Upgrade'}</button>` : ''}
          </div>
        ` : ''}

        <div style="display:grid;gap:1.2rem;">
          <div style="display:grid;gap:.3rem;">
            <div class="eyebrow" style="padding:0 .5rem .4rem;">${isAr ? 'التنقل' : 'Navigation'}</div>
            ${primaryItems.map(renderItem).join('')}
          </div>
          <div>
            <div class="eyebrow" style="padding:0 .5rem .4rem;display:flex;align-items:center;gap:.4rem;">
              <i data-lucide="crown" style="width:11px;height:11px;color:var(--accent);"></i>
              ${isAr ? 'المميزات المدفوعة' : 'Premium Features'}
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

/* ── Bottom Nav (mobile) ── */
window.renderBottomNav = function renderBottomNav() {
  const isAr = state.language === 'ar';
  const items = [
    { id: 'home',    icon: 'house',          labelEn: 'Home',     labelAr: 'الرئيسية' },
    { id: 'test',    icon: 'clipboard-list', labelEn: 'Test',     labelAr: 'الاختبار' },
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
