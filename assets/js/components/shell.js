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
    { id: 'profile',  icon: 'user-round',     labelEn: 'Profile',     labelAr: 'ملفي الشخصي' },
    { id: 'test',     icon: 'clipboard-list', labelEn: 'Assessment',  labelAr: 'الاختبار' },
    { id: 'results',  icon: 'bar-chart-3',    labelEn: 'My Results',  labelAr: 'نتائجي' },
    { id: 'roadmap',  icon: 'route',          labelEn: 'Roadmap',     labelAr: 'مسار التطور' },
    { id: 'progress', icon: 'target',         labelEn: 'My Progress', labelAr: 'متابعة تقدمي' },
  ];
}

function getExploreItems(isPro) {
  const sessionDone = state.completedMilestones?.sessionBooked;
  return [
    { id: 'track-details',    icon: 'layers-3',       labelEn: 'Tracks',           labelAr: 'التخصصات',        lock: false },
    { id: 'platforms',        icon: 'layout-grid',    labelEn: 'Platforms',        labelAr: 'منصات التعلم',    lock: false },
    { id: 'mentors',          icon: 'users-round',    labelEn: 'Mentors',          labelAr: 'المرشدون',        lock: false },
    { id: 'recorded-library', icon: 'library',        labelEn: 'Recorded Library', labelAr: 'مكتبة الجلسات',  lock: !isPro },
    { id: 'subtrack-test',    icon: 'flask-conical',  labelEn: 'Specialization',   labelAr: 'اكتشف تخصصك',    lock: !sessionDone },
  ];
}

/* ──────────────────────────────────────────────
   Dropdown builders
────────────────────────────────────────────── */
function buildJourneyDropdown(isAr) {
  const items = getJourneyItems();
  return `
    <div class="nav-dropdown journey-dropdown" role="menu">
      <div class="nav-dd-header">
        <i data-lucide="compass" class="nav-dd-header-icon"></i>
        <span>${isAr ? 'مسيرتي' : 'My Journey'}</span>
      </div>
      <div class="nav-dd-body">
        ${items.map(item => {
          const isActive = state.currentView === item.id;
          return `
            <button class="nav-dd-item ${isActive ? 'is-active' : ''}" role="menuitem"
              onclick="guardedNavigate('${item.id}')">
              <span class="nav-dd-item-icon">
                <i data-lucide="${item.icon}"></i>
              </span>
              <span class="nav-dd-item-label">${isAr ? item.labelAr : item.labelEn}</span>
              ${isActive ? '<span class="nav-dd-item-dot"></span>' : ''}
            </button>`;
        }).join('')}
      </div>
    </div>`;
}

function buildExploreDropdown(isAr, isPro) {
  const items = getExploreItems(isPro);
  const free   = items.filter(i => !i.lock);
  const locked = items.filter(i =>  i.lock);

  function item(i) {
    const isActive = state.currentView === i.id;
    return `
      <button class="nav-dd-item ${isActive ? 'is-active' : ''} ${i.lock ? 'is-locked' : ''}" role="menuitem"
        onclick="${i.lock ? `openPremiumLock('${i.id}')` : `navigateTo('${i.id}')` }">
        <span class="nav-dd-item-icon">
          <i data-lucide="${i.lock ? 'lock' : i.icon}"></i>
        </span>
        <span class="nav-dd-item-label">${isAr ? i.labelAr : i.labelEn}</span>
        ${i.lock ? `<span class="nav-dd-pro-badge">PRO</span>` : ''}
        ${isActive && !i.lock ? '<span class="nav-dd-item-dot"></span>' : ''}
      </button>`;
  }

  return `
    <div class="nav-dropdown explore-dropdown nav-dd--wide" role="menu">
      <div class="nav-dd-header">
        <i data-lucide="telescope" class="nav-dd-header-icon"></i>
        <span>${isAr ? 'استكشف' : 'Explore'}</span>
      </div>
      <div class="nav-dd-body">
        <div class="nav-dd-section-label">${isAr ? 'متاح للجميع' : 'Available for all'}</div>
        ${free.map(item).join('')}
        ${locked.length ? `
          <div class="nav-dd-divider"></div>
          <div class="nav-dd-section-label">
            <i data-lucide="crown" style="width:10px;height:10px;color:var(--accent);"></i>
            ${isAr ? 'حصري Premium' : 'Premium only'}
          </div>
          ${locked.map(item).join('')}
        ` : ''}
      </div>
    </div>`;
}

/* ── renderHeader ── */
window.renderHeader = function renderHeader() {
  const isAr        = state.language === 'ar';
  const dir         = state.direction;
  const hasProfile  = state.profile?.fullName?.trim();
  const initials    = getProfileInitials();
  const isPro       = state.premiumUnlocked;

  const journeyIds      = getJourneyItems().map(i => i.id);
  const exploreIds      = getExploreItems(isPro).map(i => i.id);
  const isJourneyActive = journeyIds.includes(state.currentView);
  const isExploreActive = exploreIds.includes(state.currentView);
  const isAccountActive = state.currentView === 'profile' || state.currentView === 'auth';

  return `
    <header class="app-header">
      <div class="container-shell">
        <div class="header-row">

          <!-- Brand -->
          <button class="brand-block" onclick="navigateTo('home')" aria-label="TrackUp home">
            <span class="brand-mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent)" aria-hidden="true">
                <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
              </svg>
            </span>
            <span class="brand-name">TrackUp</span>
          </button>

          <!-- Desktop Nav -->
          <nav class="desktop-nav" aria-label="Main navigation">

            <button class="nav-link ${state.currentView === 'home' ? 'is-active' : ''}" onclick="navigateTo('home')">
              ${isAr ? 'الرئيسية' : 'Home'}
            </button>

            <!-- Journey dropdown -->
            <div class="nav-dd-wrapper">
              <button class="nav-link ${isJourneyActive ? 'is-active' : ''}" data-journey="true"
                onclick="toggleJourneyMenu()" aria-haspopup="true" aria-expanded="${state.journeyOpen}">
                <span>${isAr ? 'رحلتي' : 'Journey'}</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
                  style="transition:transform .2s;transform:${state.journeyOpen ? 'rotate(180deg)' : 'rotate(0)'}">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              ${state.journeyOpen ? buildJourneyDropdown(isAr) : ''}
            </div>

            <!-- Explore dropdown -->
            <div class="nav-dd-wrapper">
              <button class="nav-link ${isExploreActive ? 'is-active' : ''}" data-explore="true"
                onclick="toggleExploreMenu()" aria-haspopup="true" aria-expanded="${state.exploreOpen}">
                <span>${isAr ? 'استكشف' : 'Explore'}</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
                  style="transition:transform .2s;transform:${state.exploreOpen ? 'rotate(180deg)' : 'rotate(0)'}">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              ${state.exploreOpen ? buildExploreDropdown(isAr, isPro) : ''}
            </div>

            <button class="nav-link ${state.currentView === 'pricing' ? 'is-active' : ''}" onclick="navigateTo('pricing')">
              ${isAr ? 'الباقات' : 'Pricing'}
            </button>

            <button class="nav-link ${state.currentView === 'session-booking' ? 'is-active' : ''}" onclick="guardedNavigate('session-booking')">
              ${isAr ? 'احجز جلسة' : 'Sessions'}
            </button>

          </nav>

          <!-- Actions -->
          <div class="header-actions">

            <!-- Language -->
            <button class="btn-icon" onclick="switchLanguage()" title="${state.language === 'en' ? 'العربية' : 'English'}" aria-label="Switch language">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>
              </svg>
            </button>

            <!-- Theme -->
            <button class="btn-icon" onclick="switchTheme()" title="${state.theme === 'dark' ? (isAr ? 'فاتح' : 'Light') : (isAr ? 'داكن' : 'Dark')}" aria-label="Toggle theme">
              ${state.theme === 'dark'
                ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`
                : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`
              }
            </button>

            <!-- Reset -->
            <button class="btn-icon" onclick="resetDemo()" title="${isAr ? 'إعادة ضبط' : 'Reset'}" aria-label="Reset demo">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>

            <!-- Account dropdown -->
            <div class="nav-dd-wrapper" style="position:relative;">
              <button
                class="nav-avatar ${isPro ? 'nav-avatar--pro' : ''} ${isAccountActive ? 'is-active' : ''}"
                data-account="true"
                onclick="toggleAccountMenu()"
                aria-haspopup="true"
                aria-expanded="${state.accountOpen}"
                aria-label="${hasProfile ? state.profile.fullName : (isAr ? 'الحساب' : 'Account')}">
                ${hasProfile
                  ? `<span class="nav-avatar-initials">${initials}</span>${isPro ? `<span class="nav-avatar-badge">PRO</span>` : ''}`
                  : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`
                }
              </button>

              ${state.accountOpen ? `
                <div class="nav-dropdown account-dropdown" role="menu"
                  style="${dir === 'rtl' ? 'left:0;' : 'right:0;'}">

                  ${hasProfile ? `
                    <div class="nav-dd-profile">
                      <div class="nav-dd-profile-avatar ${isPro ? 'nav-avatar--pro' : ''}">
                        <span class="nav-avatar-initials" style="font-size:.82rem;">${initials}</span>
                        ${isPro ? `<span class="nav-avatar-badge">PRO</span>` : ''}
                      </div>
                      <div class="nav-dd-profile-info">
                        <div class="nav-dd-profile-name">${state.profile.fullName}</div>
                        ${state.profile.email ? `<div class="nav-dd-profile-email">${state.profile.email}</div>` : ''}
                        ${isPro ? `<div class="nav-dd-pro-chip"><i data-lucide="crown" style="width:.6rem;height:.6rem;"></i>Premium</div>` : ''}
                      </div>
                    </div>
                  ` : ''}

                  <div class="nav-dd-body">

                    <div class="nav-dd-section-label">${isAr ? 'حسابي' : 'Account'}</div>
                    <button class="nav-dd-item ${state.currentView === 'profile' ? 'is-active' : ''}" onclick="navigateTo('profile')" role="menuitem">
                      <span class="nav-dd-item-icon"><i data-lucide="user-round"></i></span>
                      <span class="nav-dd-item-label">${isAr ? 'ملفي الشخصي' : 'My Profile'}</span>
                    </button>
                    <button class="nav-dd-item ${state.currentView === 'progress' ? 'is-active' : ''}" onclick="navigateTo('progress')" role="menuitem">
                      <span class="nav-dd-item-icon"><i data-lucide="target"></i></span>
                      <span class="nav-dd-item-label">${isAr ? 'متابعة تقدمي' : 'My Progress'}</span>
                    </button>

                    ${isPro ? `
                      <div class="nav-dd-divider"></div>
                      <div class="nav-dd-section-label">
                        <i data-lucide="crown" style="width:10px;height:10px;color:var(--accent);"></i>
                        ${isAr ? 'مميزات Premium' : 'Premium'}
                      </div>
                      <button class="nav-dd-item ${state.currentView === 'recorded-library' ? 'is-active' : ''}" onclick="navigateTo('recorded-library')" role="menuitem">
                        <span class="nav-dd-item-icon"><i data-lucide="library"></i></span>
                        <span class="nav-dd-item-label">${isAr ? 'مكتبة الجلسات' : 'Recorded Library'}</span>
                      </button>
                      <button class="nav-dd-item ${state.currentView === 'chat' ? 'is-active' : ''}" onclick="navigateTo('chat')" role="menuitem">
                        <span class="nav-dd-item-icon"><i data-lucide="message-square"></i></span>
                        <span class="nav-dd-item-label">${isAr ? 'تواصل مع مرشدك' : 'Mentor Chat'}</span>
                      </button>
                      <button class="nav-dd-item ${state.currentView === 'session-booking' ? 'is-active' : ''}" onclick="guardedNavigate('session-booking')" role="menuitem">
                        <span class="nav-dd-item-icon"><i data-lucide="calendar-days"></i></span>
                        <span class="nav-dd-item-label">${isAr ? 'احجز جلسة' : 'Book a Session'}</span>
                      </button>
                    ` : `
                      <div class="nav-dd-divider"></div>
                      <button class="nav-dd-item nav-dd-item--upgrade" onclick="navigateTo('pricing')" role="menuitem">
                        <span class="nav-dd-item-icon"><i data-lucide="crown"></i></span>
                        <span class="nav-dd-item-label">${isAr ? 'ترقية لـ Premium' : 'Upgrade to Premium'}</span>
                        <i data-lucide="arrow-${isAr ? 'left' : 'right'}" style="width:12px;height:12px;flex-shrink:0;"></i>
                      </button>
                    `}

                    <div class="nav-dd-divider"></div>
                    <button class="nav-dd-item" onclick="navigateTo('auth')" role="menuitem">
                      <span class="nav-dd-item-icon"><i data-lucide="log-in"></i></span>
                      <span class="nav-dd-item-label">${isAr ? 'تسجيل / دخول' : 'Sign In / Up'}</span>
                    </button>
                    <button class="nav-dd-item nav-dd-item--danger" onclick="resetDemo()" role="menuitem">
                      <span class="nav-dd-item-icon"><i data-lucide="rotate-ccw"></i></span>
                      <span class="nav-dd-item-label">${isAr ? 'إعادة ضبط' : 'Reset Demo'}</span>
                    </button>

                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Mobile hamburger -->
            <button class="btn-icon mobile-toggle" onclick="toggleMobileMenu()" aria-label="Open menu">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
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

  const journeyItems = [
    { id: 'profile',  icon: 'user-round',     labelEn: 'My Profile',   labelAr: 'ملفي الشخصي' },
    { id: 'test',     icon: 'clipboard-list', labelEn: 'Assessment',   labelAr: 'الاختبار' },
    { id: 'results',  icon: 'bar-chart-3',    labelEn: 'My Results',   labelAr: 'نتائجي' },
    { id: 'roadmap',  icon: 'route',          labelEn: 'Roadmap',      labelAr: 'مسار التطور' },
    { id: 'progress', icon: 'target',         labelEn: 'My Progress',  labelAr: 'متابعة تقدمي' },
  ];

  const exploreItems = [
    { id: 'track-details', icon: 'layers-3',    labelEn: 'Tracks',    labelAr: 'التخصصات', lock: false },
    { id: 'platforms',     icon: 'layout-grid', labelEn: 'Platforms', labelAr: 'منصات التعلم', lock: false },
    { id: 'mentors',       icon: 'users-round', labelEn: 'Mentors',   labelAr: 'المرشدون', lock: false },
    { id: 'pricing',       icon: 'credit-card', labelEn: 'Pricing',   labelAr: 'الباقات', lock: false },
  ];

  const premiumItems = [
    { id: 'session-booking',  icon: 'calendar-days',  labelEn: 'Book a Session',   labelAr: 'احجز جلسة',        lock: !isPro },
    { id: 'recorded-library', icon: 'library',         labelEn: 'Recorded Library', labelAr: 'مكتبة الجلسات',    lock: !isPro },
    { id: 'chat',             icon: 'message-square',  labelEn: 'Mentor Chat',      labelAr: 'تواصل مع مرشدك',  lock: !isPro },
    { id: 'subtrack-test',    icon: 'flask-conical',   labelEn: 'Specialization',   labelAr: 'اكتشف تخصصك',     lock: !sessionDone },
    { id: 'sub-track-result', icon: 'crosshair',       labelEn: 'Sub-track Result', labelAr: 'تخصصك الدقيق',    lock: !sessionDone },
  ];

  function renderItem(item) {
    const isActive = state.currentView === item.id;
    const locked   = item.lock;
    return `
      <button
        class="mobile-nav-item ${isActive ? 'is-active' : ''} ${locked ? 'is-locked' : ''}"
        onclick="${locked ? `openPremiumLock('${item.id}')` : `guardedNavigate('${item.id}')`}">
        <span class="mobile-nav-item-icon">
          <i data-lucide="${locked ? 'lock' : item.icon}"></i>
        </span>
        <span class="mobile-nav-item-label">${isAr ? item.labelAr : item.labelEn}</span>
        ${locked ? `<span class="nav-lock-badge">${isAr ? 'مدفوع' : 'PRO'}</span>` : ''}
        ${isActive ? `<i data-lucide="chevron-${isAr ? 'left' : 'right'}" class="mobile-nav-item-chevron"></i>` : ''}
      </button>`;
  }

  return `
    <div class="mobile-panel ${state.mobileMenuOpen ? 'is-open' : ''}" onclick="closeMobileMenu(event)" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <div class="mobile-sheet" onclick="event.stopPropagation()">

        <!-- Sheet header -->
        <div class="mobile-sheet-header">
          <div class="brand-block" style="pointer-events:none;">
            <span class="brand-mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent)" aria-hidden="true">
                <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
              </svg>
            </span>
            <span class="brand-name">TrackUp</span>
          </div>
          <button class="btn-icon" onclick="toggleMobileMenu()" aria-label="Close menu">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <!-- Profile strip -->
        ${hasProfile ? `
          <div class="mobile-profile-strip">
            <div class="nav-avatar ${isPro ? 'nav-avatar--pro' : ''}" style="pointer-events:none;flex-shrink:0;">
              <span class="nav-avatar-initials">${initials}</span>
              ${isPro ? `<span class="nav-avatar-badge">PRO</span>` : ''}
            </div>
            <div style="flex:1;min-width:0;">
              <div class="mobile-profile-name">${state.profile.fullName}</div>
              ${isPro
                ? `<div class="mobile-profile-plan mobile-profile-plan--pro">${isAr ? 'Premium' : 'Premium'}</div>`
                : `<div class="mobile-profile-plan">${isAr ? 'مجاني' : 'Free Plan'}</div>`}
            </div>
            ${!isPro ? `<button class="btn btn-primary" style="font-size:.75rem;padding:.3rem .8rem;min-height:auto;flex-shrink:0;" onclick="navigateTo('pricing');closeMobileMenu();">${isAr ? 'ترقية' : 'Upgrade'}</button>` : ''}
          </div>
        ` : ''}

        <!-- Nav groups -->
        <div class="mobile-nav-groups">

          <div class="mobile-nav-group">
            <div class="mobile-nav-group-label">
              <i data-lucide="compass" style="width:11px;height:11px;"></i>
              ${isAr ? 'رحلتي' : 'My Journey'}
            </div>
            ${journeyItems.map(renderItem).join('')}
          </div>

          <div class="mobile-nav-group">
            <div class="mobile-nav-group-label">
              <i data-lucide="telescope" style="width:11px;height:11px;"></i>
              ${isAr ? 'استكشف' : 'Explore'}
            </div>
            ${exploreItems.map(renderItem).join('')}
          </div>

          <div class="mobile-nav-group">
            <div class="mobile-nav-group-label">
              <i data-lucide="crown" style="width:11px;height:11px;color:var(--accent);"></i>
              ${isAr ? 'المميزات المدفوعة' : 'Premium Features'}
            </div>
            ${premiumItems.map(renderItem).join('')}
          </div>

          <!-- Utility -->
          <div class="mobile-nav-group">
            <button class="mobile-nav-item" onclick="navigateTo('about');closeMobileMenu();">
              <span class="mobile-nav-item-icon"><i data-lucide="info"></i></span>
              <span class="mobile-nav-item-label">${isAr ? 'عن TrackUp' : 'About'}</span>
            </button>
            <button class="mobile-nav-item" onclick="navigateTo('contact');closeMobileMenu();">
              <span class="mobile-nav-item-icon"><i data-lucide="mail"></i></span>
              <span class="mobile-nav-item-label">${isAr ? 'تواصل معنا' : 'Contact'}</span>
            </button>
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
    <div class="mobile-bottom-nav" role="navigation" aria-label="Quick navigation">
      <div class="mobile-bottom-grid">
        ${items.map(item => `
          <button class="mobile-bottom-item ${state.currentView === item.id ? 'is-active' : ''}" onclick="guardedNavigate('${item.id}')" aria-label="${item.labelEn}">
            <i data-lucide="${item.icon}" style="width:20px;height:20px;"></i>
            <span>${isAr ? item.labelAr : item.labelEn}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
};
