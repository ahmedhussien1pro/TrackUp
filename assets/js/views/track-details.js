window.renderTrackDetailsView = function renderTrackDetailsView() {
  if (!ensureResultsOrPrompt()) return '';
  const track = getCurrentTrack();
  const top = state.rankedTracks.find(item => item.id === track.id) || state.rankedTracks[0];
  return `
    <section class="page-grid-2">
      <div class="surface-panel section-pad" data-aos="fade-up">
        <div class="eyebrow">${t('detailsTitle')}</div>
        <div class="page-header" style="margin-top:.8rem;">
          <div>
            <h2 class="section-title">${track.title[state.language]}</h2>
            <p class="text-muted" style="margin-top:.85rem;max-width:740px;line-height:1.85;">${track.short[state.language]}</p>
          </div>
          <div class="badge badge-accent">${top.percent}% ${t('match')}</div>
        </div>

        <div style="display:grid;gap:1rem;margin-top:1.5rem;">
          <div class="surface-soft section-pad">
            <div class="eyebrow">${t('workNature')}</div>
            <p class="text-muted" style="margin-top:.6rem;line-height:1.8;">${track.workNature[state.language]}</p>
          </div>
          <div class="surface-soft section-pad">
            <div class="eyebrow">${t('whoItFits')}</div>
            <p class="text-muted" style="margin-top:.6rem;line-height:1.8;">${track.fits[state.language]}</p>
          </div>
          <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">
            <div class="surface-soft section-pad"><div class="eyebrow">${t('requiredSkills')}</div><div class="text-muted" style="margin-top:.6rem;line-height:1.8;">${track.skills[state.language].map(i => `• ${i}`).join('<br>')}</div></div>
            <div class="surface-soft section-pad"><div class="eyebrow">${t('salarySnapshot')}</div><div class="text-muted" style="margin-top:.6rem;line-height:1.8;">${track.salary[state.language]}</div></div>
          </div>
          <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">
            <div class="surface-soft section-pad"><div class="eyebrow">${t('pros')}</div><div class="text-muted" style="margin-top:.6rem;line-height:1.8;">${track.pros[state.language].map(i => `• ${i}`).join('<br>')}</div></div>
            <div class="surface-soft section-pad"><div class="eyebrow">${t('cons')}</div><div class="text-muted" style="margin-top:.6rem;line-height:1.8;">${track.cons[state.language].map(i => `• ${i}`).join('<br>')}</div></div>
          </div>
          <div class="surface-soft section-pad"><div class="eyebrow">${t('futureOutlook')}</div><p class="text-muted" style="margin-top:.6rem;line-height:1.8;">${track.future[state.language]}</p></div>
          <div class="surface-soft section-pad"><div class="eyebrow">${t('firstSteps')}</div><div class="text-muted" style="margin-top:.6rem;line-height:1.8;">${track.firstSteps[state.language].map(i => `• ${i}`).join('<br>')}</div></div>
        </div>
      </div>

      <aside class="side-rail">
        <div class="fit-rail-card" data-aos="fade-up" data-aos-delay="60">
          <div class="eyebrow">${t('personalizedFit')}</div>
          <div style="font-size:1.2rem;font-weight:800;margin-top:.7rem;">${track.reasons[state.language][0]}</div>
          <p class="text-muted" style="margin-top:.7rem;line-height:1.8;">${safeProfileName()} — ${t('scoreGuide')}</p>
        </div>
        <div class="surface-panel section-pad" data-aos="fade-up" data-aos-delay="100">
          <div class="eyebrow">${t('progressSnapshot')}</div>
          <div style="margin-top:.8rem;">${renderProgressStrip()}</div>
        </div>
        <div class="surface-panel section-pad" data-aos="fade-up" data-aos-delay="140">
          <div class="eyebrow">${t('premiumTitle')}</div>
          <div style="font-weight:800;font-size:1.1rem;margin-top:.65rem;">${t('premiumUnlocks')}</div>
          <p class="text-muted" style="margin-top:.65rem;line-height:1.8;">${t('premiumDesc')}</p>
          <button class="btn btn-secondary" style="margin-top:1rem;width:100%;" onclick="openPremiumLock('pricing')">${t('upgradeNow')}</button>
        </div>
        <div class="surface-panel section-pad" data-aos="fade-up" data-aos-delay="180">
          <div class="eyebrow">${t('topAction')}</div>
          <div style="display:grid;gap:.65rem;margin-top:1rem;">
            <button class="btn btn-primary" onclick="navigateTo('roadmap')">${t('viewRoadmap')}</button>
            <button class="btn btn-secondary" onclick="navigateTo('courses')">${t('startLearning')}</button>
            <button class="btn btn-secondary" onclick="guardedNavigate('session-booking')">${t('bookSession')}</button>
            <button class="btn btn-ghost" onclick="openPremiumLock('pricing')">${t('unlockFullAnalysis')}</button>
          </div>
        </div>
      </aside>
    </section>
  `;
};
