window.renderFooter = function renderFooter() {
  const links = [
    { id: 'home', label: t('home') },
    { id: 'test', label: t('test') },
    { id: 'results', label: t('results') },
    { id: 'pricing', label: t('pricing') },
    { id: 'progress', label: t('progress') }
  ];
  return `
    <footer class="app-footer">
      <div class="container-shell">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="brand-block" style="pointer-events:none;">
              <span class="brand-mark">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent)">
                  <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
                </svg>
              </span>
              <span class="brand-name">${t('appName')}</span>
            </div>
            <p class="text-muted" style="margin-top:.65rem;font-size:.85rem;max-width:220px;line-height:1.7;">${t('footerTagline')}</p>
            <p style="margin-top:.5rem;font-size:.75rem;color:var(--accent);opacity:.7;">${t('footerBeta')}</p>
          </div>
          <div>
            <div class="eyebrow" style="margin-bottom:.85rem;">${t('footerLinks')}</div>
            <div style="display:grid;gap:.5rem;">
              ${links.map(l => `<button class="footer-link" onclick="navigateTo('${l.id}')">${l.label}</button>`).join('')}
            </div>
          </div>
          <div>
            <div class="eyebrow" style="margin-bottom:.85rem;">${t('footerContact')}</div>
            <p class="text-muted" style="font-size:.85rem;line-height:1.7;">trackup.app@gmail.com</p>
          </div>
        </div>
        <div class="footer-bottom">
          <span class="text-muted" style="font-size:.78rem;">© ${new Date().getFullYear()} ${t('appName')} — ${t('footerRights')}</span>
        </div>
      </div>
    </footer>
  `;
};
