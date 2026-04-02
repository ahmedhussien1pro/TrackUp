window.renderHeader = function renderHeader() {
  const nav = getOrderedNav();
  const primaryNav = nav.filter(item => ['home', 'profile', 'test', 'results', 'pricing'].includes(item.id));
  const journeyNav = nav.filter(item => !['home', 'profile', 'test', 'results', 'pricing'].includes(item.id));

  return `
    <header class="app-header">
      <div class="container-shell">
        <div class="header-row">
          <button class="brand-block" onclick="navigateTo('home')">
            <span class="brand-mark"><i data-lucide="map-pinned" style="width:18px;height:18px;"></i></span>
            <span>
              <span style="display:block;font-weight:800;letter-spacing:-.02em;">${t('appName')}</span>
              <span class="text-muted" style="display:block;font-size:.78rem;">${t('appTag')}</span>
            </span>
          </button>

          <nav class="desktop-nav">
            ${primaryNav.map(item => `
              <button class="${state.currentView === item.id ? 'is-active' : ''}" onclick="guardedNavigate('${item.id}')">${item.label}</button>
            `).join('')}
            <div style="position:relative;">
              <button class="${['track-details','roadmap','progress','session-booking'].includes(state.currentView) ? 'is-active' : ''}" onclick="toggleJourneyMenu()">
                <i data-lucide="route" style="width:15px;height:15px;"></i>
                <span>${t('journey')}</span>
              </button>
              ${state.journeyOpen ? `
                <div class="surface-panel section-pad fade-up-soft" style="position:absolute;top:calc(100% + 10px);${state.direction === 'rtl' ? 'left:0;' : 'right:0;'}min-width:260px;z-index:70;">
                  <div class="eyebrow">${t('openJourney')}</div>
                  <div style="display:grid;gap:.4rem;margin-top:.85rem;">
                    ${journeyNav.map(item => `
                      <button class="btn btn-ghost" style="justify-content:flex-start;" onclick="guardedNavigate('${item.id}')">
                        <i data-lucide="${item.icon}" style="width:16px;height:16px;"></i>${item.label}
                      </button>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          </nav>

          <div class="header-actions">
            <button class="btn btn-ghost" onclick="switchLanguage()">${state.language === 'en' ? 'العربية' : 'English'}</button>
            <button class="btn btn-ghost" onclick="switchTheme()"><i data-lucide="${state.theme === 'dark' ? 'sun' : 'moon'}" style="width:16px;height:16px;"></i>${state.theme === 'dark' ? t('light') : t('dark')}</button>
            <button class="btn btn-ghost" onclick="resetDemo()"><i data-lucide="rotate-ccw" style="width:16px;height:16px;"></i></button>
            <button class="btn btn-secondary mobile-toggle" onclick="toggleMobileMenu()"><i data-lucide="menu" style="width:16px;height:16px;"></i>${t('mobileMenu')}</button>
          </div>
        </div>
      </div>
    </header>
  `;
};

window.renderMobilePanel = function renderMobilePanel() {
  const nav = getOrderedNav();
  return `
    <div class="mobile-panel ${state.mobileMenuOpen ? 'is-open' : ''}" onclick="closeMobileMenu(event)">
      <div class="mobile-sheet" onclick="event.stopPropagation()">
        <div class="page-header" style="margin-bottom:1rem;">
          <div>
            <div class="eyebrow">${t('journey')}</div>
            <div class="section-title" style="font-size:1.4rem;">${t('appName')}</div>
          </div>
          <button class="btn btn-ghost" onclick="toggleMobileMenu()"><i data-lucide="x" style="width:16px;height:16px;"></i></button>
        </div>
        <div style="display:grid;gap:.6rem;">
          ${nav.map(item => `
            <button class="btn ${state.currentView === item.id ? 'btn-secondary' : 'btn-ghost'}" style="justify-content:flex-start;" onclick="guardedNavigate('${item.id}')">
              <i data-lucide="${item.icon}" style="width:16px;height:16px;"></i>${item.label}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
};

window.renderBottomNav = function renderBottomNav() {
  const items = [
    { id: 'home', icon: 'house', label: t('home') },
    { id: 'test', icon: 'clipboard-list', label: t('test') },
    { id: 'results', icon: 'bar-chart-3', label: t('results') },
    { id: 'progress', icon: 'target', label: t('progress') },
    { id: 'profile', icon: 'user-round', label: t('profile') }
  ];
  return `
    <div class="mobile-bottom-nav">
      <div class="mobile-bottom-grid">
        ${items.map(item => `
          <button class="mobile-bottom-item ${state.currentView === item.id ? 'is-active' : ''}" onclick="guardedNavigate('${item.id}')">
            <i data-lucide="${item.icon}" style="width:16px;height:16px;"></i>
            <span>${item.label}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
};
