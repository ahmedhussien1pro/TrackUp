window.renderProgressStrip = function renderProgressStrip() {
  const next = nextRecommendedStep();
  return `
    <div class="progress-strip" data-aos="fade-up">
      <div>
        <div class="eyebrow">${t('progressTitle')}</div>
        <div class="mt-2 text-sm text-muted">${t('stageLabel')}: ${next.label}</div>
      </div>
      <div style="min-width:min(100%,320px);flex:1;">
        <div class="flex items-center justify-between text-xs text-muted mb-2">
          <span>${t('progressSnapshot')}</span>
          <span>${progressPercentage()}%</span>
        </div>
        <div class="progress-bar"><span style="width:${progressPercentage()}%"></span></div>
      </div>
      <button class="btn btn-secondary" onclick="navigateTo('${next.view}')">${t('startNow')}</button>
    </div>
  `;
};

window.renderMetricRing = function renderMetricRing(value, label) {
  return `
    <div class="metric-ring metric-pulse" style="--value:${value};">
      <div>
        <div style="font-size:1.4rem;font-weight:800;">${value}%</div>
        <div class="text-faint" style="font-size:.72rem;">${label}</div>
      </div>
    </div>
  `;
};

window.renderMilestoneList = function renderMilestoneList() {
  const milestones = getMilestones();
  const currentIndex = milestones.findIndex(item => !state.completedMilestones[item.key]);
  return milestones.map((item, idx) => {
    const done = !!state.completedMilestones[item.key];
    const current = !done && currentIndex === idx;
    return `
      <div class="milestone-item ${done ? 'is-done' : current ? 'is-current' : ''}" ${idx < 5 ? 'data-aos="fade-up"' : ''}>
        <div style="display:flex;align-items:center;gap:.8rem;">
          <div class="badge ${done ? 'badge-success' : current ? 'badge-accent' : ''}">
            <i data-lucide="${done ? 'check-check' : current ? 'clock-3' : 'circle'}" style="width:14px;height:14px;"></i>
            <span>${done ? t('completed') : current ? t('current') : t('upcoming')}</span>
          </div>
          <div>
            <div style="font-weight:600;">${item.label}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
};

/**
 * renderQuickLinks — renders a grid of shortcut buttons
 * @param {Array<{id, icon, labelEn, labelAr}>} items
 */
window.renderQuickLinks = function renderQuickLinks(items) {
  const isAr = state.language === 'ar';
  return `
    <section data-aos="fade-up">
      <div class="eyebrow" style="margin-bottom:1rem;">
        ${isAr ? 'روابط سريعة' : 'Quick Links'}
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:.6rem;">
        ${items.map(item => `
          <button
            class="surface-panel btn-ghost"
            style="display:flex;flex-direction:column;align-items:center;gap:.5rem;padding:.9rem .5rem;border-radius:14px;cursor:pointer;transition:background .15s;"
            onclick="guardedNavigate('${item.id}')">
            <i data-lucide="${item.icon}" style="width:20px;height:20px;color:var(--accent);"></i>
            <span style="font-size:.82rem;font-weight:600;">${isAr ? item.labelAr : item.labelEn}</span>
          </button>
        `).join('')}
      </div>
    </section>
  `;
};
