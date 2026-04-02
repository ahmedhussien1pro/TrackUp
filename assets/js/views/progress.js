window.renderProgressView = function renderProgressView() {
  const next = nextRecommendedStep();
  return `
    <section style="display:grid;gap:1.25rem;">
      ${renderProgressStrip()}
      <div class="page-grid-2">
        <div class="surface-panel section-pad" data-aos="fade-up">
          <div class="page-header">
            <div>
              <div class="eyebrow">${t('progressTitle')}</div>
              <h2 class="section-title" style="margin-top:.6rem;">${t('progressTitle')}</h2>
              <p class="text-muted" style="margin-top:.8rem;">${t('progressDesc')}</p>
            </div>
            ${renderMetricRing(progressPercentage(), t('progressTitle'))}
          </div>
          <div class="surface-soft section-pad" style="margin-top:1.25rem;">
            <div class="eyebrow">${t('topAction')}</div>
            <div style="font-size:1.15rem;font-weight:800;margin-top:.6rem;">${next.label}</div>
            <button class="btn btn-primary" style="margin-top:1rem;" onclick="navigateTo('${next.view}')">${t('startNow')}</button>
          </div>
        </div>
        <div class="surface-panel section-pad" data-aos="fade-up" data-aos-delay="80">
          <div class="eyebrow">${t('profile')}</div>
          <div style="font-weight:800;font-size:1.15rem;margin-top:.7rem;">${state.profile.fullName ? safeProfileName() : t('noProfile')}</div>
          <div class="text-muted" style="margin-top:.45rem;">${state.profile.college || ''}</div>
          <div class="text-muted" style="margin-top:.85rem;">${t('stageLabel')}: ${next.label}</div>
        </div>
      </div>
      <div class="surface-panel section-pad">
        <div class="page-header" data-aos="fade-up">
          <div>
            <div class="eyebrow">${t('progressSnapshot')}</div>
            <div style="font-size:1.35rem;font-weight:800;margin-top:.55rem;">${t('continueJourney')}</div>
          </div>
          <button class="btn btn-secondary" onclick="navigateTo('${next.view}')">${t('startNow')}</button>
        </div>
        <div style="display:grid;gap:.8rem;margin-top:1rem;">
          ${renderMilestoneList()}
        </div>
      </div>
    </section>
  `;
};
