/* ── helpers ── */
function getProfileInitials() {
  const name = (state.profile && state.profile.fullName && state.profile.fullName.trim()) || '';
  if (!name) return '?';
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

window.renderHeader = function renderHeader() {
  const nav = getOrderedNav();
  const primaryNav = nav.filter(item => item.group === 'primary');
  const journeyNav = nav.filter(item => item.group === 'journey');

  const journeyViews = journeyNav.map(i => i.id);
  const isJourneyActive = journeyViews.includes(state.currentView);
  const hasProfile = state.profile && state.profile.fullName && state.profile.fullName.trim();
  const initials = getProfileInitials();
  const isPro = state.premiumUnlocked;

  return `
    <header class="app-header">
      <div class="container-shell">
        <div class="header-row">
          <button class="brand-block" onclick="navigateTo('home')">
            <span class="brand-mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent)">
                <path d="M3 3v18h18"/>
                <path d="m19 9-5 5-4-4-3 3"/>
              </svg>
            </span>
            <span class="brand-name">TrackUp</span>
          </button>

          <nav class="desktop-nav">
            ${primaryNav.map(item => `
              <button class="nav-link ${state.currentView === item.id ? 'is-active' : ''}" onclick="guardedNavigate('${item.id}')">${item.label}</button>
            `).join('')}

            <!-- Journey dropdown -->
            <div style="position:relative;">
              <button class="nav-link ${isJourneyActive ? 'is-active' : ''}" data-journey="true" onclick="toggleJourneyMenu()">
                <span>${t('journey')}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition:transform .2s ease;transform:${state.journeyOpen ? 'rotate(180deg)' : 'rotate(0deg)'}">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              ${state.journeyOpen ? `
                <div class="journey-dropdown surface-panel fade-up-soft" style="position:absolute;top:calc(100% + 8px);${state.direction === 'rtl' ? 'left:0;' : 'right:0;'}min-width:220px;">
                  <div class="journey-dropdown-header">
                    <span class="eyebrow">${t('openJourney')}</span>
                  </div>
                  <div class="journey-dropdown-items">
                    ${journeyNav.map(item => {
                      const isActive = state.currentView === item.id;
                      const isLocked = item.lock;
                      return `
                        <button
                          class="journey-item ${isActive ? 'is-active' : ''} ${isLocked ? 'is-locked' : ''}"
                          onclick="guardedNavigate('${item.id}')"
                          style="${isLocked ? 'opacity:.5;' : ''}">
                          <i data-lucide="${isLocked ? 'lock' : item.icon}" style="width:15px;height:15px;flex-shrink:0;color:${isLocked ? 'var(--text-muted)' : 'inherit'};"></i>
                          <span style="flex:1;text-align:start;">${item.label}</span>
                          ${isLocked ? `<span style="font-size:.65rem;font-weight:700;color:var(--text-muted);background:var(--surface-2);border:1px solid var(--border);border-radius:4px;padding:.1rem .4rem;flex-shrink:0;">${state.language === 'ar' ? 'مقفول' : 'LOCKED'}</span>` : ''}
                        </button>`;
                    }).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          </nav>

          <div class="header-actions">
            ${hasProfile ? `
              <button class="nav-avatar ${isPro ? 'nav-avatar--pro' : ''}" onclick="navigateTo('profile')" title="${state.profile.fullName}">
                <span class="nav-avatar-initials">${initials}</span>
                ${isPro ? `<span class="nav-avatar-badge">PRO</span>` : ''}
              </button>
            ` : ''}
            <button class="btn-icon" onclick="switchLanguage()" title="${state.language === 'en' ? 'العربية' : 'English'}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>
              </svg>
            </button>
            <button class="btn-icon" onclick="switchTheme()" title="${state.theme === 'dark' ? t('light') : t('dark')}">
              ${state.theme === 'dark'
                ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`
                : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`
              }
            </button>
            <button class="btn-icon" onclick="resetDemo()" title="Reset">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
            <button class="btn btn-secondary mobile-toggle" onclick="toggleMobileMenu()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  `;
};

window.renderMobilePanel = function renderMobilePanel() {
  const nav = getOrderedNav();
  // Mobile panel shows primary + journey only (not footer)
  const mobileNav = nav.filter(item => item.group === 'primary' || item.group === 'journey');
  const initials = getProfileInitials();
  const hasProfile = state.profile && state.profile.fullName && state.profile.fullName.trim();
  const isPro = state.premiumUnlocked;

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
                ? `<div class="eyebrow" style="color:var(--accent);font-size:.7rem;">${t('premiumActive')}</div>`
                : `<div class="text-muted" style="font-size:.78rem;">${t('free')}</div>`}
            </div>
          </div>
        ` : ''}
        <div style="display:grid;gap:.5rem;">
          ${mobileNav.map(item => {
            const isActive = state.currentView === item.id;
            const isLocked = item.lock;
            return `
              <button
                class="btn ${isActive ? 'btn-secondary' : 'btn-ghost'}"
                style="justify-content:flex-start;gap:.6rem;${isLocked ? 'opacity:.5;' : ''}"
                onclick="guardedNavigate('${item.id}')">
                <i data-lucide="${isLocked ? 'lock' : item.icon}" style="width:16px;height:16px;flex-shrink:0;"></i>
                <span style="flex:1;text-align:start;">${item.label}</span>
                ${isLocked ? `<span style="font-size:.65rem;font-weight:700;color:var(--text-muted);">${state.language === 'ar' ? 'مقفول' : 'LOCKED'}</span>` : ''}
              </button>`;
          }).join('')}
        </div>
      </div>
    </div>
  `;
};

window.renderBottomNav = function renderBottomNav() {
  const items = [
    { id: 'home',    icon: 'house',          label: t('home') },
    { id: 'test',    icon: 'clipboard-list', label: t('test') },
    { id: 'results', icon: 'bar-chart-3',    label: t('results') },
    { id: 'progress',icon: 'target',         label: t('progress') },
    { id: 'profile', icon: 'user-round',     label: t('profile') }
  ];
  return `
    <div class="mobile-bottom-nav">
      <div class="mobile-bottom-grid">
        ${items.map(item => `
          <button class="mobile-bottom-item ${state.currentView === item.id ? 'is-active' : ''}" onclick="guardedNavigate('${item.id}')">
            <i data-lucide="${item.icon}" style="width:20px;height:20px;"></i>
            <span>${item.label}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
};
