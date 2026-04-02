window.renderResultsView = function renderResultsView() {
  if (!state.rankedTracks.length) {
    return `
      <section class="surface-panel section-pad">
        <h2 class="section-title">${t('resultsTitle')}</h2>
        <p class="text-muted" style="margin-top:.8rem;">${t('noResults')}</p>
        <button class="btn btn-primary" style="margin-top:1rem;" onclick="navigateTo('test')">${t('startAssessment')}</button>
      </section>
    `;
  }
  const [top, second, third] = state.rankedTracks;
  const topTrack = TRACKS[top.id];
  return `
    <section style="display:grid;gap:1.25rem;">
      ${renderProgressStrip()}
      <div class="page-grid-2">
        <div class="result-featured" data-aos="fade-up">
          <div class="page-header">
            <div>
              <div class="badge badge-accent">${t('topMatch')}</div>
              <h2 class="section-title" style="margin-top:1rem;">${safeProfileName()}, ${topTrack.title[state.language]} ${state.language === 'ar' ? 'هو المسار الأقرب لك الآن.' : 'is your strongest current fit.'}</h2>
              <p class="text-muted" style="margin-top:.85rem;max-width:720px;">${t('resultsDesc')}</p>
            </div>
            ${renderMetricRing(top.percent, t('match'))}
          </div>
          <div class="surface-soft section-pad" style="margin-top:1.2rem;">
            <div class="eyebrow">${t('whyFits')}</div>
            <div style="font-size:1.05rem;font-weight:700;margin-top:.65rem;">${topTrack.reasons[state.language][0]}</div>
            <div class="text-muted" style="margin-top:.55rem;line-height:1.8;">${t('scoreGuide')}</div>
            <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1rem;">${top.tags.map(tag => `<span class="badge">${tag}</span>`).join('')}</div>
          </div>
          <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.25rem;">
            <button class="btn btn-primary" onclick="openTrack('${top.id}')">${t('viewDetails')}</button>
            <button class="btn btn-secondary" onclick="openRoadmapFor('${top.id}')">${t('viewRoadmap')}</button>
            <button class="btn btn-ghost" onclick="openPremiumLock('pricing')">${t('unlockFullAnalysis')}</button>
          </div>
        </div>

        <div class="side-rail">
          <div class="surface-panel section-pad" data-aos="fade-up" data-aos-delay="80">
            <div class="eyebrow">${t('topAction')}</div>
            <div style="font-weight:800;font-size:1.15rem;margin-top:.6rem;">${t('continueJourney')}</div>
            <p class="text-muted" style="margin-top:.6rem;">${t('openRoadmap')}</p>
            <button class="btn btn-primary" style="margin-top:1rem;width:100%;" onclick="openRoadmapFor('${top.id}')">${t('viewRoadmap')}</button>
          </div>
          <div class="fit-rail-card" data-aos="fade-up" data-aos-delay="120">
            <div class="eyebrow">${t('premiumTitle')}</div>
            <div style="font-weight:800;font-size:1.1rem;margin-top:.65rem;">${t('premiumUnlocks')}</div>
            <p class="text-muted" style="margin-top:.6rem;">${t('strongerPaid')}</p>
            <button class="btn btn-secondary" style="margin-top:1rem;width:100%;" onclick="openPremiumLock('pricing')">${t('upgradeNow')}</button>
          </div>
        </div>
      </div>
      <div class="page-grid-3">
        ${[second, third].filter(Boolean).map((item, idx) => {
          const tr = TRACKS[item.id];
          return `
            <div class="result-secondary" data-aos="fade-up" data-aos-delay="${180 + idx * 60}">
              <div class="page-header">
                <div>
                  <div class="eyebrow">${t('rank')} ${idx + 2}</div>
                  <div style="font-size:1.15rem;font-weight:800;margin-top:.4rem;">${tr.title[state.language]}</div>
                </div>
                <div class="badge">${item.percent}% ${t('match')}</div>
              </div>
              <p class="text-muted" style="margin-top:.8rem;line-height:1.8;">${tr.reasons[state.language][1] || tr.reasons[state.language][0]}</p>
              <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1rem;">
                <button class="btn btn-secondary" onclick="openTrack('${item.id}')">${t('viewDetails')}</button>
                <button class="btn btn-ghost" onclick="openPremiumLock('pricing')">${t('premium')}</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
};
