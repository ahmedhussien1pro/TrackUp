window.renderHomeView = function renderHomeView() {
  const next = nextRecommendedStep();
  return `
    <section class="hero-grid">
      <div class="surface-panel section-pad" data-aos="fade-up">
        <div class="badge badge-accent">${t('homeBadge')}</div>
        <h1 class="section-title" style="margin-top:1rem;max-width:760px;">${t('homeTitle')}</h1>
        <p class="text-muted" style="margin-top:1rem;max-width:760px;line-height:1.8;">${t('homeDesc')}</p>
        <p class="text-faint" style="margin-top:.7rem;">${t('judgeFlow')}</p>
        <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.5rem;">
          <button class="btn btn-primary" onclick="navigateTo('profile')">${t('startAssessment')}</button>
          <button class="btn btn-secondary" onclick="navigateTo('pricing')">${t('viewPricing')}</button>
        </div>
        <div class="kpi-row" style="margin-top:1.6rem;">
          <div class="kpi-card"><div class="eyebrow">01</div><div style="font-weight:700;margin-top:.5rem;">${t('step1')}</div><div class="text-muted" style="margin-top:.4rem;font-size:.92rem;">${t('step1d')}</div></div>
          <div class="kpi-card"><div class="eyebrow">02</div><div style="font-weight:700;margin-top:.5rem;">${t('step2')}</div><div class="text-muted" style="margin-top:.4rem;font-size:.92rem;">${t('step2d')}</div></div>
          <div class="kpi-card"><div class="eyebrow">03</div><div style="font-weight:700;margin-top:.5rem;">${t('step3')}</div><div class="text-muted" style="margin-top:.4rem;font-size:.92rem;">${t('step3d')}</div></div>
        </div>
      </div>
      <div style="display:grid;gap:1rem;align-content:start;">
        <div class="surface-panel section-pad" data-aos="fade-up" data-aos-delay="80">
          <div class="eyebrow">${t('journeyPreview')}</div>
          <div class="text-muted" style="margin-top:.8rem;line-height:1.8;">Profile → Test → Results → Track Details → Roadmap → Learning → Progress → Premium → Session</div>
          <div style="margin-top:1rem;display:grid;gap:.65rem;">
            <div class="surface-soft section-pad"><div style="font-weight:700;">${t('nextStep')}</div><div class="text-muted" style="margin-top:.35rem;">${next.label}</div><button class="btn btn-primary" style="margin-top:.9rem;width:100%;" onclick="navigateTo('${next.view}')">${t('startNow')}</button></div>
          </div>
        </div>
        <div class="surface-panel section-pad" data-aos="fade-up" data-aos-delay="140">
          <div class="eyebrow">${t('freePaid')}</div>
          <p class="text-muted" style="margin-top:.8rem;line-height:1.8;">${t('freePaidDesc')}</p>
          <div style="display:grid;gap:.75rem;margin-top:1rem;">
            <div class="surface-soft section-pad"><span class="badge">${t('free')}</span><div class="text-muted" style="margin-top:.65rem;">${t('freeAccess')}</div></div>
            <div class="fit-rail-card"><span class="badge badge-accent">${t('premium')}</span><div class="text-muted" style="margin-top:.65rem;">${t('paidAccess')}</div></div>
          </div>
        </div>
      </div>
    </section>
  `;
};
