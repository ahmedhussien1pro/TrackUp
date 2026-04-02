/*
  renderQuickLinks(links)
  ─────────────────────────────────────────────────────────────
  Shared contextual quick-links bar used at the bottom of views.

  Each link:
  { id, icon, labelEn, labelAr, lock? }

  Usage:
    ${renderQuickLinks([...])}
*/
window.renderQuickLinks = function renderQuickLinks(links) {
  if (!links || !links.length) return '';
  const isAr = state.language === 'ar';

  const items = links.map(link => {
    const locked  = !!link.lock;
    const active  = state.currentView === link.id;
    const label   = isAr ? link.labelAr : link.labelEn;

    return `
      <button
        class="ql-item ${active ? 'ql-item--active' : ''} ${locked ? 'ql-item--locked' : ''}"
        onclick="${locked ? `openPremiumLock('${link.id}')` : `guardedNavigate('${link.id}')`}"
        title="${label}">
        <i data-lucide="${locked ? 'lock' : link.icon}" class="ql-icon"></i>
        <span class="ql-label">${label}</span>
        ${locked ? `<span class="nav-lock-badge" style="margin-inline-start:auto;">${isAr ? 'مقفول' : 'PRO'}</span>` : ''}
      </button>`;
  }).join('');

  return `
    <div class="ql-bar" data-aos="fade-up">
      <span class="eyebrow" style="white-space:nowrap;">
        <i data-lucide="arrow-right-left" style="width:11px;height:11px;"></i>
        ${isAr ? 'اذهب إلى' : 'Quick access'}
      </span>
      <div class="ql-items">${items}</div>
    </div>`;
};
