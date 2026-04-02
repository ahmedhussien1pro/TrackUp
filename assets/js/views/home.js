window.renderHomeView = function renderHomeView() {
  const next = nextRecommendedStep();
  const testimonials = [
    { name: t('testimonial1Name'), role: t('testimonial1Role'), text: t('testimonial1Text'), stars: 5 },
    { name: t('testimonial2Name'), role: t('testimonial2Role'), text: t('testimonial2Text'), stars: 5 },
    { name: t('testimonial3Name'), role: t('testimonial3Role'), text: t('testimonial3Text'), stars: 5 }
  ];
  return `
    <!-- HERO -->
    <section class="home-hero" data-aos="fade-up">
      <div class="home-hero-content">
        <span class="badge badge-accent" style="margin-bottom:1rem;">${t('homeBadge')}</span>
        <h1 class="home-hero-title">${t('heroTagline').replace('\\n','<br>')}</h1>
        <p class="home-hero-sub">${t('heroSub')}</p>
        <p class="text-muted" style="margin-top:1rem;max-width:560px;line-height:1.8;">${t('homeDesc')}</p>
        <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.75rem;">
          <button class="btn btn-primary" onclick="navigateTo('profile')">${t('startAssessment')}</button>
          <button class="btn btn-accent-outline" onclick="navigateTo('pricing')">${t('viewPricing')}</button>
        </div>
      </div>
      <div class="home-hero-visual" aria-hidden="true">
        <div class="orbit-scene">
          <div class="orbit-ring orbit-ring-1"></div>
          <div class="orbit-ring orbit-ring-2"></div>
          <div class="orbit-ring orbit-ring-3"></div>
          <div class="orbit-core">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent)">
              <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
            </svg>
          </div>
          <div class="orbit-dot dot-1"></div>
          <div class="orbit-dot dot-2"></div>
          <div class="orbit-dot dot-3"></div>
          <div class="orbit-label label-power">Power</div>
          <div class="orbit-label label-embedded">Embedded</div>
          <div class="orbit-label label-comms">Comms</div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section data-aos="fade-up">
      <div class="eyebrow" style="margin-bottom:1rem;">${t('quickSteps')}</div>
      <div class="kpi-row">
        <div class="kpi-card"><div class="eyebrow">01</div><div style="font-weight:700;margin-top:.5rem;color:var(--accent);">${t('step1')}</div><div class="text-muted" style="margin-top:.4rem;font-size:.92rem;">${t('step1d')}</div></div>
        <div class="kpi-card"><div class="eyebrow">02</div><div style="font-weight:700;margin-top:.5rem;color:var(--accent);">${t('step2')}</div><div class="text-muted" style="margin-top:.4rem;font-size:.92rem;">${t('step2d')}</div></div>
        <div class="kpi-card"><div class="eyebrow">03</div><div style="font-weight:700;margin-top:.5rem;color:var(--accent);">${t('step3')}</div><div class="text-muted" style="margin-top:.4rem;font-size:.92rem;">${t('step3d')}</div></div>
      </div>
    </section>

    <!-- NEXT STEP + FREE VS PAID -->
    <section class="hero-grid" data-aos="fade-up">
      <div class="surface-panel section-pad">
        <div class="eyebrow">${t('journeyPreview')}</div>
        <div class="text-muted" style="margin-top:.8rem;line-height:1.8;font-size:.88rem;">Profile → Test → Results → Track Details → Roadmap → Learning → Progress → Premium → Session</div>
        <div style="margin-top:1rem;">
          <div class="surface-soft section-pad">
            <div style="font-weight:700;color:var(--accent);">${t('nextStep')}</div>
            <div class="text-muted" style="margin-top:.35rem;">${next.label}</div>
            <button class="btn btn-primary" style="margin-top:.9rem;width:100%;" onclick="navigateTo('${next.view}')">${t('startNow')}</button>
          </div>
        </div>
      </div>
      <div class="surface-panel section-pad">
        <div class="eyebrow">${t('freePaid')}</div>
        <p class="text-muted" style="margin-top:.8rem;line-height:1.8;">${t('freePaidDesc')}</p>
        <div style="display:grid;gap:.75rem;margin-top:1rem;">
          <div class="surface-soft section-pad"><span class="badge">${t('free')}</span><div class="text-muted" style="margin-top:.65rem;">${t('freeAccess')}</div></div>
          <div class="fit-rail-card"><span class="badge badge-accent">${t('premium')}</span><div class="text-muted" style="margin-top:.65rem;">${t('paidAccess')}</div></div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section data-aos="fade-up">
      <div class="eyebrow" style="margin-bottom:1.1rem;">${t('testimonials')}</div>
      <div class="testimonials-grid">
        ${testimonials.map(item => `
          <div class="testimonial-card surface-panel section-pad">
            <div class="testimonial-stars">${'★'.repeat(item.stars)}</div>
            <p class="testimonial-text">&ldquo;${item.text}&rdquo;</p>
            <div class="testimonial-author">
              <div class="testimonial-avatar">${item.name.charAt(0)}</div>
              <div>
                <div style="font-weight:700;font-size:.9rem;color:var(--accent);">${item.name}</div>
                <div class="text-muted" style="font-size:.8rem;">${item.role}</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
};
