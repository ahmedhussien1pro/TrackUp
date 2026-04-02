window.renderFooter = function renderFooter() {
  const isAr = state.language === 'ar';
  const links = [
    { view: 'about',   icon: 'info',          labelEn: 'About',   labelAr: 'عن المنصة' },
    { view: 'contact', icon: 'mail',           labelEn: 'Contact', labelAr: 'تواصل' },
    { view: 'pricing', icon: 'credit-card',    labelEn: 'Pricing', labelAr: 'الأسعار' },
    { view: 'auth',    icon: 'log-in',         labelEn: 'Sign In', labelAr: 'تسجيل دخول' },
  ];
  return `
    <footer class="app-footer">
      <div class="container-shell">
        <div class="footer-bar">

          <!-- Logo -->
          <button class="brand-block" onclick="navigateTo('home')">
            <span class="brand-mark">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent)">
                <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
              </svg>
            </span>
            <span class="brand-name" style="font-size:.9rem;">${t('appName')}</span>
          </button>

          <!-- Footer links -->
          <nav style="display:flex;align-items:center;gap:.15rem;flex-wrap:wrap;">
            ${links.map(l => `
              <button
                class="footer-link ${state.currentView === l.view ? 'is-active' : ''}"
                onclick="navigateTo('${l.view}')">
                <i data-lucide="${l.icon}" style="width:13px;height:13px;"></i>
                ${isAr ? l.labelAr : l.labelEn}
              </button>
            `).join('')}
          </nav>

          <!-- Copyright -->
          <span class="footer-copy">
            &copy; ${new Date().getFullYear()} ${t('appName')} &mdash; ${t('footerBeta')}
          </span>
        </div>
      </div>
    </footer>
  `;
};
