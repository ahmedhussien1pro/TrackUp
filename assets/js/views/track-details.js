window.renderTrackDetailsView = function renderTrackDetailsView() {
  if (!ensureResultsOrPrompt()) return '';
  const track = getCurrentTrack();
  const lang = state.language;
  const isPremium = state.premiumUnlocked;
  const top = state.rankedTracks.find(item => item.id === track.id) || state.rankedTracks[0];

  const premiumSideCard = isPremium
    ? `
      <div class="surface-panel section-pad" data-aos="fade-up" data-aos-delay="140" style="border:1px solid rgba(21,150,242,.25);">
        <div style="display:flex;align-items:center;gap:.55rem;margin-bottom:.65rem;">
          <i data-lucide="shield-check" style="width:1rem;height:1rem;color:var(--brand);"></i>
          <span style="font-weight:700;font-size:.9rem;">${lang === 'ar' ? 'التحليل المتقدم مفعّل' : 'Premium analysis active'}</span>
        </div>
        <p class="text-muted" style="font-size:.85rem;line-height:1.7;margin-bottom:.9rem;">${lang === 'ar' ? 'جميع تفاصيل التحليل المعمّق متاحة الآن.' : 'All advanced analysis details are now visible.'}</p>
        <button class="btn btn-secondary" style="width:100%;" onclick="navigateTo('session-booking')">${t('bookSession')}</button>
      </div>
    `
    : `
      <div class="surface-panel section-pad" data-aos="fade-up" data-aos-delay="140">
        <div class="eyebrow">${t('premiumTitle')}</div>
        <div style="font-weight:800;font-size:1.1rem;margin-top:.65rem;">${t('premiumUnlocks')}</div>
        <p class="text-muted" style="margin-top:.65rem;line-height:1.8;">${t('premiumDesc')}</p>
        <button class="btn btn-secondary" style="margin-top:1rem;width:100%;" onclick="openPremiumLock('pricing')">${t('upgradeNow')}</button>
      </div>
    `;

  const actionButtons = isPremium
    ? `
        <button class="btn btn-primary" onclick="navigateTo('roadmap')">${t('viewRoadmap')}</button>
        <button class="btn btn-secondary" onclick="navigateTo('courses')">${t('startLearning')}</button>
        <button class="btn btn-secondary" onclick="navigateTo('session-booking')">${t('bookSession')}</button>
      `
    : `
        <button class="btn btn-primary" onclick="navigateTo('roadmap')">${t('viewRoadmap')}</button>
        <button class="btn btn-secondary" onclick="navigateTo('courses')">${t('startLearning')}</button>
        <button class="btn btn-secondary" onclick="guardedNavigate('session-booking')">${t('bookSession')}</button>
        <button class="btn btn-ghost" onclick="openPremiumLock('pricing')">${t('unlockFullAnalysis')}</button>
      `;

  return `
    <section class="page-grid-2">
      <div class="surface-panel section-pad" data-aos="fade-up">
        <div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;margin-bottom:.4rem;">
          <div class="eyebrow">${t('detailsTitle')}</div>
          ${isPremium ? `<span class="badge badge-accent" style="display:inline-flex;align-items:center;gap:.3rem;"><i data-lucide="shield-check" style="width:.7rem;height:.7rem;"></i>${lang === 'ar' ? 'مفعّل' : 'Premium'}</span>` : ''}
        </div>
        <div class="page-header" style="margin-top:.4rem;">
          <div>
            <h2 class="section-title">${track.title[lang]}</h2>
            <p class="text-muted" style="margin-top:.85rem;max-width:740px;line-height:1.85;">${track.short[lang]}</p>
          </div>
          <div class="badge badge-accent">${top.percent}% ${t('match')}</div>
        </div>

        <div style="display:grid;gap:1rem;margin-top:1.5rem;">
          <div class="surface-soft section-pad">
            <div class="eyebrow">${t('workNature')}</div>
            <p class="text-muted" style="margin-top:.6rem;line-height:1.8;">${track.workNature[lang]}</p>
          </div>
          <div class="surface-soft section-pad">
            <div class="eyebrow">${t('whoItFits')}</div>
            <p class="text-muted" style="margin-top:.6rem;line-height:1.8;">${track.fits[lang]}</p>
          </div>
          <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">
            <div class="surface-soft section-pad">
              <div class="eyebrow">${t('requiredSkills')}</div>
              <div class="text-muted" style="margin-top:.6rem;line-height:1.8;">${track.skills[lang].map(i => `• ${i}`).join('<br>')}</div>
            </div>
            <div class="surface-soft section-pad">
              <div class="eyebrow">${t('salarySnapshot')}</div>
              <div class="text-muted" style="margin-top:.6rem;line-height:1.8;">${track.salary[lang]}</div>
            </div>
          </div>
          <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">
            <div class="surface-soft section-pad">
              <div class="eyebrow">${t('pros')}</div>
              <div class="text-muted" style="margin-top:.6rem;line-height:1.8;">${track.pros[lang].map(i => `• ${i}`).join('<br>')}</div>
            </div>
            <div class="surface-soft section-pad">
              <div class="eyebrow">${t('cons')}</div>
              <div class="text-muted" style="margin-top:.6rem;line-height:1.8;">${track.cons[lang].map(i => `• ${i}`).join('<br>')}</div>
            </div>
          </div>
          <div class="surface-soft section-pad">
            <div class="eyebrow">${t('futureOutlook')}</div>
            <p class="text-muted" style="margin-top:.6rem;line-height:1.8;">${track.future[lang]}</p>
          </div>
          <div class="surface-soft section-pad">
            <div class="eyebrow">${t('firstSteps')}</div>
            <div class="text-muted" style="margin-top:.6rem;line-height:1.8;">${track.firstSteps[lang].map(i => `• ${i}`).join('<br>')}</div>
          </div>
        </div>
      </div>

      <aside class="side-rail">
        <div class="fit-rail-card" data-aos="fade-up" data-aos-delay="60">
          <div class="eyebrow">${t('personalizedFit')}</div>
          <div style="font-size:1.2rem;font-weight:800;margin-top:.7rem;">${track.reasons[lang][0]}</div>
          <p class="text-muted" style="margin-top:.7rem;line-height:1.8;">${safeProfileName()} — ${t('scoreGuide')}</p>
        </div>
        <div class="surface-panel section-pad" data-aos="fade-up" data-aos-delay="100">
          <div class="eyebrow">${t('progressSnapshot')}</div>
          <div style="margin-top:.8rem;">${renderProgressStrip()}</div>
        </div>
        ${premiumSideCard}
        <div class="surface-panel section-pad" data-aos="fade-up" data-aos-delay="180">
          <div class="eyebrow">${t('topAction')}</div>
          <div style="display:grid;gap:.65rem;margin-top:1rem;">
            ${actionButtons}
          </div>
        </div>
      </aside>
    </section>
  `;
};
