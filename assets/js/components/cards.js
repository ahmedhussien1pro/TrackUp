/* cards.js — shared card components */

/**
 * renderQuickLinks — used in roadmap sidebar only.
 * All other views use direct btn-ghost links inline.
 */
window.renderQuickLinks = function renderQuickLinks(items) {
  if (!items || !items.length) return '';
  const isAr = state.language === 'ar';
  return `
    <div class="surface-soft section-pad" style="border:1px solid var(--border);">
      <div class="eyebrow" style="margin-bottom:.75rem;">${isAr ? 'روابط سريعة' : 'Quick links'}</div>
      <div style="display:grid;gap:.3rem;">
        ${items.map(item => `
          <button
            class="btn btn-ghost"
            style="justify-content:flex-start;gap:.6rem;font-size:.85rem;${item.lock ? 'opacity:.45;' : ''}"
            onclick="${item.lock ? `openPremiumLock('${item.id}')` : `navigateTo('${item.id}')`}">
            <i data-lucide="${item.lock ? 'lock' : item.icon}" style="width:.85rem;height:.85rem;color:var(--text-muted);"></i>
            <span>${isAr ? (item.labelAr || item.labelEn) : item.labelEn}</span>
            ${item.lock ? `<span class="nav-lock-badge" style="margin-${isAr ? 'right' : 'left'}:auto;">PRO</span>` : ''}
          </button>
        `).join('')}
      </div>
    </div>
  `;
};

/* Progress strip — appears in JOURNEY_VIEWS above main content */
window.renderProgressStrip = function renderProgressStrip() {
  const pct   = progressPercentage();
  const next  = nextRecommendedStep();
  const isAr  = state.language === 'ar';
  return `
    <div class="progress-strip" style="margin-bottom:1rem;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:.65rem;">
          <div style="font-size:.78rem;font-weight:700;color:var(--text-muted);">
            ${isAr ? 'رحلتك' : 'Journey'}
          </div>
          <div style="background:var(--border);border-radius:99px;height:5px;width:120px;overflow:hidden;">
            <div style="height:100%;width:${pct}%;background:var(--accent);border-radius:99px;transition:width .4s;"></div>
          </div>
          <span style="font-size:.78rem;font-weight:800;color:var(--accent);">${pct}%</span>
        </div>
        <button
          class="btn btn-ghost"
          style="font-size:.8rem;padding:.3rem .7rem;gap:.4rem;"
          onclick="navigateTo('${next.view}')">
          <i data-lucide="navigation" style="width:.75rem;height:.75rem;color:var(--accent);"></i>
          ${next.label}
        </button>
      </div>
    </div>
  `;
};
