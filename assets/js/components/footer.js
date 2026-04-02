window.renderFooter = function renderFooter() {
  const isRTL = state.direction === 'rtl';
  return `
    <footer class="app-footer">
      <div class="container-shell">
        <div class="footer-bar">
          <!-- Logo side -->
          <button class="brand-block" onclick="navigateTo('home')">
            <span class="brand-mark">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent)">
                <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
              </svg>
            </span>
            <span class="brand-name" style="font-size:.9rem;">${t('appName')}</span>
          </button>

          <!-- Copyright side -->
          <span class="footer-copy">
            &copy; ${new Date().getFullYear()} ${t('appName')} &mdash; ${t('footerBeta')}
          </span>
        </div>
      </div>
    </footer>
  `;
};
