window.renderHomeView = function renderHomeView() {
  const next = nextRecommendedStep();
  const testimonials = [
    { name: t('testimonial1Name'), role: t('testimonial1Role'), text: t('testimonial1Text'), stars: 5 },
    { name: t('testimonial2Name'), role: t('testimonial2Role'), text: t('testimonial2Text'), stars: 5 },
    { name: t('testimonial3Name'), role: t('testimonial3Role'), text: t('testimonial3Text'), stars: 5 }
  ];

  const noiseOffsets = [80, 100, 115, 130, 165, 178, 192, 210];
  const noiseWaves = noiseOffsets.map((y, i) => {
    const a = 18 + (i % 3) * 8;
    return `<path class="wave-noise wave-noise-${i + 1}" d="M0,${y} C60,${y - a} 120,${y + a} 180,${y} S260,${y - a} 300,${y}"/>`;
  }).join('');

  const arrow = state.direction === 'rtl' ? ' ← ' : ' → ';
  const journeySteps = [
    t('profile'), t('test'), t('results'),
    t('roadmap'), t('coursesTitle'), t('progress'),
    t('premium'), t('sessions')
  ].join(arrow);

  const lang = state.language;
  const isAr = lang === 'ar';

  const features = [
    [ 'Quick assessment (5 questions)', 'تقييم سريع (٥ أسئلة)',        true,  true  ],
    [ 'Ranked results (top 3 tracks)',  'نتائج مرتبة (أفضل ٣ مسارات)', true,  true  ],
    [ 'Basic track overview',           'نظرة عامة على المسار',         true,  true  ],
    [ 'Full fit analysis & reasons',    'تحليل كامل مع الأسباب',        false, true  ],
    [ 'Detailed roadmap (step-by-step)','خارطة تطور تفصيلية',           false, true  ],
    [ 'Platform recommendations',       'توصيات منصات التعلم',          false, true  ],
    [ 'Progress tracking',              'تتبع التقدم',                  false, true  ],
    [ 'One-on-one expert sessions',     'جلسات فردية مع خبير',          false, true  ],
  ];

  const check = `<i data-lucide="check" style="width:1rem;height:1rem;color:var(--accent);"></i>`;
  const cross  = `<span style="display:inline-block;width:.5rem;height:1.5px;background:var(--surface-4);border-radius:2px;"></span>`;

  const featureRows = features.map(([en, ar, free, paid]) => `
    <div style="display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:.75rem;
      padding:.7rem 0;border-bottom:1px solid var(--border);">
      <span style="font-size:.88rem;font-weight:500;color:var(--text-muted);">${isAr ? ar : en}</span>
      <div style="display:flex;justify-content:center;width:3.5rem;">${free  ? check : cross}</div>
      <div style="display:flex;justify-content:center;width:3.5rem;">${paid  ? check : cross}</div>
    </div>
  `).join('');

  // Partners data — logos will be swapped for real PNGs later
  // Each partner: id, label, color (brand color for placeholder chip)
  const partners = [
    { id:'udemy',            label:'Udemy',            color:'#a435f0' },
    { id:'coursera',         label:'Coursera',         color:'#0056d2' },
    { id:'iti',              label:'ITI Egypt',        color:'#005f87' },
    { id:'tryhackme',        label:'TryHackMe',        color:'#88cc14' },
    { id:'datacamp',         label:'DataCamp',         color:'#03ef62' },
    { id:'frontend_masters', label:'Frontend Masters', color:'#c02d28' },
    { id:'cybrary',          label:'Cybrary',          color:'#00c0ef' },
    { id:'hackthebox',       label:'Hack The Box',     color:'#9fef00' },
    // duplicated for seamless infinite loop
    { id:'udemy2',           label:'Udemy',            color:'#a435f0' },
    { id:'coursera2',        label:'Coursera',         color:'#0056d2' },
    { id:'iti2',             label:'ITI Egypt',        color:'#005f87' },
    { id:'tryhackme2',       label:'TryHackMe',        color:'#88cc14' },
    { id:'datacamp2',        label:'DataCamp',         color:'#03ef62' },
    { id:'frontend_masters2',label:'Frontend Masters', color:'#c02d28' },
    { id:'cybrary2',         label:'Cybrary',          color:'#00c0ef' },
    { id:'hackthebox2',      label:'Hack The Box',     color:'#9fef00' },
  ];

  // Partner chip — shows placeholder text chip OR <img> if PNG exists in /assets/partners/
  // To swap: drop udemy.png, coursera.png, etc. into assets/partners/ folder
  // The img has onerror fallback to the text chip automatically
  const partnerChip = (p) => `
    <div class="partner-chip">
      <img
        src="./assets/partners/${p.id.replace(/\d+$/,'')}.png"
        alt="${p.label}"
        class="partner-logo-img"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
      />
      <span class="partner-logo-fallback" style="display:none;background:${p.color}18;color:${p.color};border:1px solid ${p.color}33;">
        ${p.label}
      </span>
    </div>
  `;

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
        <div class="signal-scene">
          <div class="signal-grid"></div>
          <div class="signal-scan"></div>
          <svg class="signal-svg" viewBox="0 0 300 300" preserveAspectRatio="none">
            ${noiseWaves}
            <path class="wave-signal" d="M0,150 C60,90 120,210 180,150 S260,90 300,150"/>
            <path class="wave-path"   d="M0,150 L300,150"/>
          </svg>
          <div class="signal-endpoint"></div>
          <span class="signal-label-noise">${t('signalNoise')}</span>
          <span class="signal-label-clear">${t('signalClear')}</span>
        </div>
      </div>
    </section>

    <!-- PARTNERS AUTO-SLIDE -->
    <section class="partners-section" data-aos="fade-up">
      <div class="eyebrow" style="text-align:center;margin-bottom:1.1rem;">${t('partnersTitle')}</div>
      <div class="partners-track-wrap">
        <div class="partners-track">
          ${partners.map(p => partnerChip(p)).join('')}
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

    <!-- NEXT STEP + FREE VS PREMIUM -->
    <section class="hero-grid" data-aos="fade-up">
      <div class="surface-panel section-pad">
        <div class="eyebrow">${t('journeyPreview')}</div>
        <div class="text-muted" style="margin-top:.8rem;line-height:1.8;font-size:.85rem;">${journeySteps}</div>
        <div style="margin-top:1rem;">
          <div class="surface-soft section-pad">
            <div style="font-weight:700;color:var(--accent);">${t('nextStep')}</div>
            <div class="text-muted" style="margin-top:.35rem;">${next.label}</div>
            <button class="btn btn-primary" style="margin-top:.9rem;width:100%;" onclick="navigateTo('${next.view}')">${t('startNow')}</button>
          </div>
        </div>
      </div>

      <div class="surface-panel section-pad">
        <div class="eyebrow" style="margin-bottom:.9rem;">${t('freePaid')}</div>
        <div style="display:grid;grid-template-columns:1fr auto auto;gap:.75rem;align-items:center;
          padding-bottom:.65rem;border-bottom:1px solid var(--border-strong);">
          <span></span>
          <div style="display:flex;flex-direction:column;align-items:center;width:3.5rem;">
            <span style="font-size:.7rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--text-faint);">
              ${isAr ? 'مجاني' : 'Free'}
            </span>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;width:3.5rem;">
            <span style="font-size:.7rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);">
              ${isAr ? 'مدفوع' : 'Premium'}
            </span>
          </div>
        </div>
        ${featureRows}
        <button class="btn btn-primary" style="width:100%;margin-top:1.1rem;" onclick="navigateTo('pricing')">
          ${isAr ? 'شوف الأسعار' : 'View pricing'}
          <i data-lucide="arrow-${isAr ? 'left' : 'right'}" style="width:.9rem;height:.9rem;"></i>
        </button>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section data-aos="fade-up">
      <div class="eyebrow" style="margin-bottom:1.1rem;">${t('testimonials')}</div>
      <div class="testimonials-grid">
        ${testimonials.map(item => `
          <div class="testimonial-card surface-panel section-pad">
            <div class="testimonial-stars">${'&#9733;'.repeat(item.stars)}</div>
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
