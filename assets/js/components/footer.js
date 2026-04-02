window.renderFooter = function renderFooter() {
  const isAr = state.language === 'ar';
  const links = [
    { id: 'home',     label: t('home')    },
    { id: 'test',     label: t('test')    },
    { id: 'results',  label: t('results') },
    { id: 'pricing',  label: t('pricing') },
    { id: 'progress', label: t('progress')},
    { id: 'platforms',label: t('platforms')},
  ];
  return `
    <footer class="app-footer">
      <div class="container-shell">
        <div class="footer-compact">
          <!-- Brand + tagline -->
          <button class="brand-block" onclick="navigateTo('home')" style="text-decoration:none;">
            <span class="brand-mark">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent)">
                <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
              </svg>
            </span>
            <span class="brand-name" style="font-size:.92rem;">${t('appName')}</span>
          </button>

          <!-- Nav links -->
          <nav class="footer-links-row">
            ${links.map(l => `
              <button class="footer-link ${state.currentView === l.id ? 'footer-link--active' : ''}" onclick="navigateTo('${l.id}')">${l.label}</button>
            `).join('')}
          </nav>

          <!-- Copyright -->
          <span class="footer-copy">
            © ${new Date().getFullYear()} ${t('appName')} &mdash; ${t('footerBeta')}
          </span>
        </div>
      </div>
    </footer>
  `;
};
