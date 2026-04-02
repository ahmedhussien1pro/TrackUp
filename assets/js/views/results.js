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

  const isPremium = state.premiumUnlocked;
  const lang = state.language;
  const [top, second, third] = state.rankedTracks;
  const topTrack = TRACKS[top.id];
  const topHeadline = lang === 'ar'
    ? `${topTrack.title[lang]} — ${t('topMatch')}`
    : `${safeProfileName()}, ${topTrack.title[lang]} is your strongest fit.`;

  const premiumBadge = isPremium
    ? `<span class="badge badge-accent" style="display:inline-flex;align-items:center;gap:.3rem;">
        <i data-lucide="shield-check" style="width:.75rem;height:.75rem;"></i>
        ${t('premiumActiveBadge')}
       </span>`
    : '';

  const topCTAs = isPremium
    ? `
        <button class="btn btn-primary" onclick="openTrack('${top.id}')">${t('viewDetails')}</button>
        <button class="btn btn-secondary" onclick="openRoadmapFor('${top.id}')">${t('viewRoadmap')}</button>
        <button class="btn btn-secondary" onclick="navigateTo('platforms')">
          <i data-lucide="layout-grid" style="width:.9rem;height:.9rem;"></i>
          ${t('explorePlatformsBtn')}
        </button>
        <button class="btn btn-ghost" onclick="navigateTo('session-booking')">${t('bookSession')}</button>
      `
    : `
        <button class="btn btn-primary" onclick="openTrack('${top.id}')">${t('viewDetails')}</button>
        <button class="btn btn-secondary" onclick="openRoadmapFor('${top.id}')">${t('viewRoadmap')}</button>
        <button class="btn btn-ghost" onclick="openPremiumLock('pricing')">${t('unlockFullAnalysis')}</button>
      `;

  const premiumRailCard = isPremium
    ? `
        <div class="fit-rail-card" style="border-color:rgba(21,150,242,.3);" data-aos="fade-up" data-aos-delay="120">
          <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.6rem;">
            <i data-lucide="shield-check" style="width:1rem;height:1rem;color:var(--brand);"></i>
            <span style="font-weight:700;font-size:.9rem;">${t('premiumAnalysisActive')}</span>
          </div>
          <p class="text-muted" style="font-size:.85rem;line-height:1.7;">${t('premiumAnalysisDesc')}</p>
          <button class="btn btn-secondary" style="margin-top:.9rem;width:100%;" onclick="navigateTo('platforms')">
            <i data-lucide="layout-grid" style="width:.85rem;height:.85rem;"></i>
            ${t('explorePlatformsBtn')}
          </button>
        </div>
      `
    : `
        <div class="fit-rail-card" data-aos="fade-up" data-aos-delay="120">
          <div class="eyebrow">${t('premiumTitle')}</div>
          <div style="font-weight:800;font-size:1.05rem;margin-top:.5rem;">${t('unlockOrBook')}</div>
          <p class="text-muted" style="margin-top:.5rem;">${t('unlockOrBookDesc')}</p>
          <div style="display:grid;gap:.55rem;margin-top:.9rem;">
            <button class="btn btn-secondary" style="width:100%;" onclick="navigateTo('pricing')">${t('upgradeNow')}</button>
            <button class="btn btn-ghost" style="width:100%;" onclick="navigateTo('mentors')">${t('browseMentors')}</button>
          </div>
        </div>
      `;

  return `
    <section style="display:grid;gap:1rem;">
      <div class="page-grid-2">
        <div class="result-featured" data-aos="fade-up">
          <div class="page-header">
            <div>
              <div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;">
                <div class="badge badge-accent">${t('topMatch')}</div>
                ${premiumBadge}
              </div>
              <h2 class="section-title" style="margin-top:.75rem;">${topHeadline}</h2>
              <p class="text-muted" style="margin-top:.65rem;max-width:720px;">${t('resultsDesc')}</p>
            </div>
            ${renderMetricRing(top.percent, t('match'))}
          </div>
          <div class="surface-soft section-pad" style="margin-top:1rem;">
            <div class="eyebrow">${t('whyFits')}</div>
            <div style="font-size:1.05rem;font-weight:700;margin-top:.55rem;">${topTrack.reasons[lang][0]}</div>
            <div class="text-muted" style="margin-top:.45rem;line-height:1.8;">${
              isPremium
                ? (topTrack.reasons[lang][2] || topTrack.reasons[lang][1] || t('scoreGuide'))
                : t('scoreGuide')
            }</div>
            <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.9rem;">${top.tags.map(tag => `<span class="badge">${tag}</span>`).join('')}</div>
          </div>
          <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1rem;">
            ${topCTAs}
          </div>
        </div>

        <div class="side-rail">
          <div class="surface-panel section-pad" data-aos="fade-up" data-aos-delay="80">
            <div class="eyebrow">${t('topAction')}</div>
            <div style="font-weight:800;font-size:1.1rem;margin-top:.5rem;">${t('continueJourney')}</div>
            <p class="text-muted" style="margin-top:.5rem;">${t('openRoadmap')}</p>
            <button class="btn btn-primary" style="margin-top:.9rem;width:100%;" onclick="openRoadmapFor('${top.id}')">${t('viewRoadmap')}</button>
          </div>
          ${premiumRailCard}
        </div>
      </div>

      ${!isPremium ? `
        <div class="surface-soft section-pad" data-aos="fade-up">
          <div class="page-header" style="align-items:center;gap:1rem;">
            <div>
              <div class="eyebrow">${t('nextStepLabel')}</div>
              <div style="font-weight:800;font-size:1.05rem;margin-top:.35rem;">${t('twoMovesTitle')}</div>
              <p class="text-muted" style="margin-top:.4rem;line-height:1.7;max-width:720px;">${t('twoMovesDesc')}</p>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;margin-top:1rem;">
            <div class="surface-panel section-pad">
              <div style="font-weight:700;">${t('unlockPremiumLabel')}</div>
              <p class="text-muted" style="margin-top:.35rem;font-size:.86rem;line-height:1.7;">${t('unlockPremiumDesc')}</p>
              <button class="btn btn-primary" style="margin-top:.85rem;width:100%;" onclick="navigateTo('pricing')">${t('viewPlans')}</button>
            </div>
            <div class="surface-panel section-pad">
              <div style="font-weight:700;">${t('introSessionLabel')}</div>
              <p class="text-muted" style="margin-top:.35rem;font-size:.86rem;line-height:1.7;">${t('introSessionDesc')}</p>
              <button class="btn btn-secondary" style="margin-top:.85rem;width:100%;" onclick="navigateTo('mentors')">${t('browseMentors')}</button>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="page-grid-3">
        ${[second, third].filter(Boolean).map((item, idx) => {
          const tr = TRACKS[item.id];
          const secondaryCTA = isPremium
            ? `
                <button class="btn btn-secondary" onclick="openTrack('${item.id}')">${t('viewDetails')}</button>
                <button class="btn btn-ghost" onclick="openRoadmapFor('${item.id}')">${t('viewRoadmap')}</button>
              `
            : `
                <button class="btn btn-secondary" onclick="openTrack('${item.id}')">${t('viewDetails')}</button>
                <button class="btn btn-ghost" onclick="openPremiumLock('pricing')">${t('unlockAnalysis')}</button>
              `;
          const reason = isPremium
            ? (tr.reasons[lang][2] || tr.reasons[lang][1] || tr.reasons[lang][0])
            : tr.reasons[lang][1] || tr.reasons[lang][0];
          return `
            <div class="result-secondary" data-aos="fade-up" data-aos-delay="${160 + idx * 50}">
              <div class="page-header">
                <div>
                  <div class="eyebrow">${t('rank')} ${idx + 2}</div>
                  <div style="font-size:1.1rem;font-weight:800;margin-top:.3rem;">${tr.title[lang]}</div>
                </div>
                <div class="badge">${item.percent}% ${t('match')}</div>
              </div>
              <p class="text-muted" style="margin-top:.65rem;line-height:1.75;">${reason}</p>
              <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:.9rem;">
                ${secondaryCTA}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
};
