window.renderHomeView = function renderHomeView() {
  const next = nextRecommendedStep();
  const testimonials = [
    { name: t('testimonial1Name'), role: t('testimonial1Role'), text: t('testimonial1Text'), stars: 5 },
    { name: t('testimonial2Name'), role: t('testimonial2Role'), text: t('testimonial2Text'), stars: 5 },
    { name: t('testimonial3Name'), role: t('testimonial3Role'), text: t('testimonial3Text'), stars: 5 }
  ];

  /* —— 8 noise wave paths at different vertical offsets —— */
  const noiseOffsets = [80, 100, 115, 130, 165, 178, 192, 210];
  const noiseWaves = noiseOffsets.map((y, i) => {
    const a = 18 + (i % 3) * 8;   /* amplitude */
    const half = 150;
    return `<path class="wave-noise wave-noise-${i + 1}"
      d="M0,${y} C60,${y - a} 120,${y + a} 180,${y} S260,${y - a} 300,${y}"
    />`;
  }).join('');

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

      <!-- Signal Detection Visual -->
      <div class="home-hero-visual" aria-hidden="true">
        <div class="signal-scene">
          <!-- oscilloscope grid -->
          <div class="signal-grid"></div>
          <!-- scan sweep line -->
          <div class="signal-scan"></div>

          <svg class="signal-svg" viewBox="0 0 300 300" preserveAspectRatio="none">
            <!-- noise waves -->
            ${noiseWaves}

            <!-- the ONE clear signal emerging -->
            <path class="wave-signal"
              d="M0,150 C60,90 120,210 180,150 S260,90 300,150"
            />

            <!-- path line that forms after signal clears -->
            <path class="wave-path"
              d="M0,150 L300,150"
            />
          </svg>

          <!-- endpoint glow dot -->
          <div class="signal-endpoint"></div>

          <!-- labels -->
          <span class="signal-label-noise">noise</span>
          <span class="signal-label-clear">clear signal</span>
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
        <div class="text-muted" style="margin-top:.8rem;line-height:1.8;font-size:.88rem;">Profile → Test → Results → Roadmap → Learning → Progress → Premium → Session</div>
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
