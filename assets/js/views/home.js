window.renderHomeView = function renderHomeView() {
  const next = nextRecommendedStep();
  const isAr = state.language === 'ar';

  /* ── Star helper ───────────────────────────────────────── */
  function starSVG(filled) {
    return `<svg width="13" height="13" viewBox="0 0 24 24" fill="${filled ? '#f59e0b' : 'none'}" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;flex-shrink:0;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  }
  function renderStars(n) {
    return Array.from({ length: 5 }, (_, i) => starSVG(i < n)).join('');
  }

  /* ── Partners scroll ─────────────────────────────────── */
  const partnersList = [
    { id:'udemy',            label:'Udemy',            color:'#a435f0' },
    { id:'coursera',         label:'Coursera',         color:'#0056d2' },
    { id:'iti',              label:'ITI Egypt',        color:'#005f87' },
    { id:'tryhackme',        label:'TryHackMe',        color:'#88cc14' },
    { id:'datacamp',         label:'DataCamp',         color:'#03ef62' },
    { id:'frontend_masters', label:'Frontend Masters', color:'#c02d28' },
    { id:'cybrary',          label:'Cybrary',          color:'#00c0ef' },
    { id:'hackthebox',       label:'Hack The Box',     color:'#9fef00' },
  ];
  const partnerChip = (p) => `
    <div class="partner-chip">
      <img src="./assets/partners/${p.id}.png" alt="${p.label}" class="partner-logo-img"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
      <span class="partner-logo-fallback" style="display:none;background:${p.color}18;color:${p.color};border:1px solid ${p.color}33;">${p.label}</span>
    </div>`;

  /* ── How-it-works steps ──────────────────────────────── */
  const steps = [
    {
      num: '01',
      icon: 'clipboard-list',
      titleEn: 'Take the Assessment',
      titleAr: 'ابدأ التقييم',
      descEn:  '5 targeted questions reveal which engineering track fits you best.',
      descAr:  '5 أسئلة دقيقة تكشف أنسب مسار هندسي لك.'
    },
    {
      num: '02',
      icon: 'bar-chart-3',
      titleEn: 'See Your Ranked Results',
      titleAr: 'شوف نتائجك مرتّبة',
      descEn:  'Get your top 3 tracks with fit percentages and clear explanations.',
      descAr:  'أفضل 3 مسارات بنسب توافق واضحة وأسباب حقيقية.'
    },
    {
      num: '03',
      icon: 'route',
      titleEn: 'Follow Your Roadmap',
      titleAr: 'اتبع مسار تطورك',
      descEn:  'A step-by-step roadmap, resources, and expert sessions guide your growth.',
      descAr:  'خارطة تطور تفصيلية وموارد وجلسات خبراء ترشدك خطوة بخطوة.'
    }
  ];

  /* ── Free vs Premium features ────────────────────────── */
  const freeFeatures  = [
    isAr ? 'تقييم سريع (5 أسئلة)' : 'Quick assessment (5 questions)',
    isAr ? 'أفضل 3 مسارات مرتّبة'  : 'Top 3 ranked tracks',
    isAr ? 'نظرة عامة على المسار'  : 'Basic track overview',
  ];
  const premFeatures  = [
    isAr ? 'عرض كامل وتحليل عميق'  : 'Full fit analysis & deep insights',
    isAr ? 'خارطة مسار تفصيلية'    : 'Detailed step-by-step roadmap',
    isAr ? 'توصيات منصات التعلم'   : 'Platform recommendations',
    isAr ? 'متابعة تقدمك'          : 'Progress tracking',
    isAr ? 'جلسات فردية مع خبير'   : '1-on-1 expert sessions',
    isAr ? 'مكتبة جلسات مسجّلة'   : 'Recorded sessions library',
  ];
  const check = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

  /* ── Testimonials ─────────────────────────────────────── */
  const testimonials = [
    { name: t('testimonial1Name'), role: t('testimonial1Role'), text: t('testimonial1Text'), stars: 5 },
    { name: t('testimonial2Name'), role: t('testimonial2Role'), text: t('testimonial2Text'), stars: 5 },
    { name: t('testimonial3Name'), role: t('testimonial3Role'), text: t('testimonial3Text'), stars: 5 }
  ];

  /* ── Stats strip ───────────────────────────────────────── */
  const stats = [
    { valEn: '500+', valAr: '500+', labelEn: 'Students guided',   labelAr: 'طالب استفاد' },
    { valEn: '3',    valAr: '3',    labelEn: 'Engineering tracks', labelAr: 'مسار هندسي' },
    { valEn: '10+',  valAr: '10+',  labelEn: 'Expert mentors',    labelAr: 'مرشد خبير' },
    { valEn: '98%',  valAr: '98%',  labelEn: 'Satisfaction rate', labelAr: 'نسبة رضا' },
  ];

  const noiseOffsets = [80, 100, 115, 130, 165, 178, 192, 210];
  const noiseWaves = noiseOffsets.map((y, i) => {
    const a = 18 + (i % 3) * 8;
    return `<path class="wave-noise wave-noise-${i + 1}" d="M0,${y} C60,${y - a} 120,${y + a} 180,${y} S260,${y - a} 300,${y}"/>`;
  }).join('');

  return `
    <!-- ──────────────────── HERO ──────────────────── -->
    <section class="home-hero" data-aos="fade-up">
      <div class="home-hero-content">
        <span class="badge badge-accent" style="margin-bottom:1rem;">
          ${isAr ? 'دليلك لاختيار التخصص الصحيح' : 'Your engineering career, decided.'}
        </span>
        <h1 class="home-hero-title">
          ${isAr
            ? 'بتخصص في دقيقتين.<br>بدون تخمين ولا حيرة.'
            : 'Find your engineering<br>track in 2 minutes.'}
        </h1>
        <p class="home-hero-sub">
          ${isAr
            ? 'TrackUp يحلل إجاباتك ويرتّب أفضل 3 مسارات هندسية لك — ثم يرشدك خطوة بخطوة.'
            : 'TrackUp analyzes your answers and ranks the top 3 engineering specializations for you — then guides you step by step.'}
        </p>
        <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.75rem;">
          <button class="btn btn-primary" onclick="navigateTo('profile')">${isAr ? 'ابدأ التقييم' : 'Start Assessment'}</button>
          <button class="btn btn-accent-outline" onclick="navigateTo('pricing')">${isAr ? 'شوف الباقات' : 'View Plans'}</button>
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

    <!-- ──────────────────── STATS ──────────────────── -->
    <section class="surface-soft" style="padding:1.25rem;border-radius:16px;" data-aos="fade-up">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;text-align:center;">
        ${stats.map(s => `
          <div>
            <div style="font-size:1.7rem;font-weight:900;color:var(--accent);line-height:1;">${isAr ? s.valAr : s.valEn}</div>
            <div class="text-muted" style="font-size:.78rem;margin-top:.35rem;line-height:1.4;">${isAr ? s.labelAr : s.labelEn}</div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- ──────────────────── HOW IT WORKS ──────────────────── -->
    <section data-aos="fade-up">
      <div class="eyebrow" style="text-align:center;margin-bottom:1.25rem;">${isAr ? 'كيف يشتغل TrackUp' : 'How it works'}</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;position:relative;">
        ${steps.map((s, i) => `
          <div class="surface-panel section-pad" style="position:relative;" data-aos="fade-up" data-aos-delay="${i * 80}">
            <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.85rem;">
              <div style="width:2.4rem;height:2.4rem;border-radius:10px;background:var(--accent-soft);border:1px solid rgba(37,99,235,.18);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i data-lucide="${s.icon}" style="width:1rem;height:1rem;color:var(--accent);"></i>
              </div>
              <span style="font-size:.72rem;font-weight:800;letter-spacing:.08em;color:var(--text-faint);text-transform:uppercase;">${s.num}</span>
            </div>
            <div style="font-weight:700;font-size:.97rem;margin-bottom:.4rem;">${isAr ? s.titleAr : s.titleEn}</div>
            <div class="text-muted" style="font-size:.86rem;line-height:1.7;">${isAr ? s.descAr : s.descEn}</div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- ──────────────────── NEXT STEP (smart) + FREE vs PREMIUM ──────────────────── -->
    <section class="hero-grid" data-aos="fade-up">

      <!-- Next step card -->
      <div class="surface-panel section-pad">
        <div class="eyebrow" style="margin-bottom:.75rem;">${isAr ? 'أين أنت الآن' : 'Your next step'}</div>
        <div class="surface-soft" style="padding:1rem;border-radius:14px;border:1px solid var(--accent);">
          <div style="display:flex;align-items:center;gap:.65rem;margin-bottom:.5rem;">
            <div style="width:2rem;height:2rem;border-radius:8px;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;">
              <i data-lucide="navigation" style="width:.9rem;height:.9rem;color:var(--accent);"></i>
            </div>
            <span style="font-weight:700;font-size:.9rem;color:var(--accent);">${isAr ? 'الخطوة التالية' : 'Recommended action'}</span>
          </div>
          <div style="font-size:.92rem;font-weight:600;margin-bottom:.75rem;">${next.label}</div>
          <button class="btn btn-primary" style="width:100%;" onclick="navigateTo('${next.view}')">
            ${isAr ? 'ابدأ الآن' : "Let's go"}
            <i data-lucide="arrow-${isAr ? 'left' : 'right'}" style="width:.85rem;height:.85rem;"></i>
          </button>
        </div>
      </div>

      <!-- Free vs Premium -->
      <div class="surface-panel section-pad">
        <div class="eyebrow" style="margin-bottom:.85rem;">${isAr ? 'ماذا يفتح لك Premium' : 'Free vs Premium'}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.65rem;margin-bottom:1rem;">
          <!-- Free -->
          <div style="background:var(--surface-2,var(--surface-soft));border:1px solid var(--border);border-radius:14px;padding:.85rem;">
            <div style="font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--text-faint);margin-bottom:.65rem;">${isAr ? 'مجاني' : 'Free'}</div>
            <div style="display:grid;gap:.45rem;">
              ${freeFeatures.map(f => `
                <div style="display:flex;gap:.45rem;align-items:flex-start;font-size:.82rem;">${check}<span>${f}</span></div>
              `).join('')}
            </div>
          </div>
          <!-- Premium -->
          <div style="background:var(--accent-soft);border:1.5px solid rgba(37,99,235,.3);border-radius:14px;padding:.85rem;">
            <div style="font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin-bottom:.65rem;">Premium</div>
            <div style="display:grid;gap:.45rem;">
              ${premFeatures.map(f => `
                <div style="display:flex;gap:.45rem;align-items:flex-start;font-size:.82rem;">${check}<span>${f}</span></div>
              `).join('')}
            </div>
          </div>
        </div>
        <button class="btn btn-primary" style="width:100%;" onclick="navigateTo('pricing')">
          ${isAr ? 'شوف الباقات' : 'View Plans'}
          <i data-lucide="arrow-${isAr ? 'left' : 'right'}" style="width:.85rem;height:.85rem;"></i>
        </button>
      </div>
    </section>

    <!-- ──────────────────── PARTNERS ──────────────────── -->
    <section class="partners-section" data-aos="fade-up">
      <div class="eyebrow" style="text-align:center;margin-bottom:1.1rem;">${t('partnersTitle')}</div>
      <div class="partners-track-wrap">
        <div class="partners-track" id="partnersTrack">
          ${partnersList.map(p => partnerChip(p)).join('')}
        </div>
      </div>
    </section>

    <!-- ──────────────────── TESTIMONIALS ──────────────────── -->
    <section data-aos="fade-up">
      <div class="eyebrow" style="margin-bottom:1.1rem;">${t('testimonials')}</div>
      <div class="testimonials-grid">
        ${testimonials.map(item => `
          <div class="testimonial-card surface-panel section-pad">
            <div style="display:flex;align-items:center;gap:2px;margin-bottom:.6rem;">
              ${renderStars(item.stars)}
            </div>
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

// ── Partners Scroll ──────────────────────────────────────────────
window.initPartnersScroll = function initPartnersScroll() {
  const track = document.getElementById('partnersTrack');
  if (!track) return;
  if (window._partnersRAF) cancelAnimationFrame(window._partnersRAF);
  const originals = Array.from(track.children);
  track.querySelectorAll('[data-clone]').forEach(el => el.remove());
  originals.forEach(chip => {
    const clone = chip.cloneNode(true);
    clone.setAttribute('data-clone', '1');
    track.appendChild(clone);
  });
  const speed = 0.5;
  let pos = 0;
  let paused = false;
  track.addEventListener('mouseenter', () => { paused = true; });
  track.addEventListener('mouseleave', () => { paused = false; });
  function getHalfWidth() { return track.scrollWidth / 2; }
  function loop() {
    if (!paused) {
      pos -= speed;
      const half = getHalfWidth();
      if (Math.abs(pos) >= half) pos = 0;
      track.style.transform = `translateX(${pos}px)`;
    }
    window._partnersRAF = requestAnimationFrame(loop);
  }
  loop();
};
