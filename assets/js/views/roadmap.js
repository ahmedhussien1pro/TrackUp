window.renderRoadmapView = function renderRoadmapView() {
  if (!ensureResultsOrPrompt()) return '';
  const track = getCurrentTrack();
  const steps = ROADMAP[state.selectedTrack];
  return `
    <section class="surface-panel section-pad">
      <div class="page-header" data-aos="fade-up">
        <div>
          <div class="eyebrow">${t('roadmapTitle')}</div>
          <h2 class="section-title" style="margin-top:.6rem;">${track.title[state.language]} — ${t('roadmapTitle')}</h2>
          <p class="text-muted" style="margin-top:.8rem;">${t('roadmapPreview')}</p>
        </div>
        <button class="btn btn-secondary" onclick="openPremiumLock('pricing')">${t('unlockFullAnalysis')}</button>
      </div>
      <div style="display:grid;gap:1rem;margin-top:1.4rem;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));">
        ${steps.map((step, idx) => {
          const done = !!state.roadmapProgress[`${state.selectedTrack}_${step.step}`];
          const locked = !state.premiumUnlocked && idx > 1;
          return `
            <div class="step-card ${locked ? 'locked' : ''}" data-aos="fade-up" data-aos-delay="${idx * 70}">
              <div class="page-header">
                <div>
                  <div class="eyebrow">${state.language === 'ar' ? `الخطوة ${step.step}` : `Step ${step.step}`}</div>
                  <div style="font-size:1.15rem;font-weight:800;margin-top:.45rem;">${step.title[state.language]}</div>
                </div>
                <div class="badge ${done ? 'badge-success' : locked ? 'badge-accent' : ''}">${done ? t('completed') : locked ? t('locked') : idx === 0 ? t('current') : t('upcoming')}</div>
              </div>
              <p class="text-muted" style="margin-top:.8rem;line-height:1.8;">${step.note[state.language]}</p>
              <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1rem;">
                ${locked ? `<button class="btn btn-primary" onclick="openPremiumLock('pricing')">${t('upgradeNow')}</button>` : `<button class="btn ${done ? 'btn-secondary' : 'btn-primary'}" onclick="completeRoadmapStep('${state.selectedTrack}', ${step.step})">${done ? t('completed') : step.action[state.language]}</button>`}
                <button class="btn btn-ghost" onclick="navigateTo('courses')">${t('startLearning')}</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
};
