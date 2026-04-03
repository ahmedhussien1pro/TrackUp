window.renderPricingView = function renderPricingView() {
  const isPremium = state.premiumUnlocked;
  const isAr      = state.language === 'ar';
  const dark      = state.theme === 'dark';

  /* ── 3 main plans only ── */
  const plans = [
    {
      id: 'free',
      icon: 'sparkles',
      titleEn: 'Free',        titleAr: 'مجاني',
      subEn:   'Start your journey',  subAr: 'ابدأ رحلتك',
      priceEn: 'Free',        priceAr: 'مجاني',
      periodEn: '',           periodAr: '',
      badge: null,
      color: '#64748b',
      features: {
        en: ['Profile setup', '5-question assessment', 'Top 3 ranked results', 'Basic track overview', 'Roadmap preview'],
        ar: ['إعداد الملف الشخصي', 'تقييم خمسة أسئلة', 'أفضل 3 مسارات مرتّبة', 'نظرة عامة على المسار', 'معاينة مسار التطور']
      },
      locked: {
        en: ['Full roadmap steps', 'Learning platforms', 'Progress tracking', 'Session booking'],
        ar: ['خطوات الرودماب كاملة', 'منصات التعلم', 'متابعة تقدمك', 'حجز الجلسات']
      },
      ctaEn: 'Current Plan',  ctaAr: 'الخطة الحالية',
      highlight: false
    },
    {
      id: 'premium',
      icon: 'crown',
      titleEn: 'Premium',     titleAr: 'Premium',
      subEn:   'Full guidance — nothing locked',  subAr: 'توجيه كامل — لا شيء مغلق',
      priceEn: '99',          priceAr: '99',
      periodEn: 'EGP / month', periodAr: 'ج.م / شهر',
      badge: { en: 'Most Popular', ar: 'الأكثر طلباً' },
      color: '#2563eb',
      features: {
        en: ['Everything in Free', 'Full roadmap (all steps)', 'Learning platform picks', 'Progress tracking & streaks', 'Recorded expert sessions', 'Session booking access'],
        ar: ['كل ميزات المجاني', 'مسار تطور كامل', 'أفضل منصات التعلم', 'متابعة تقدمك باستمرار', 'جلسات خبراء مسجّلة', 'صلاحية حجز الجلسات']
      },
      locked: null,
      ctaEn: isPremium ? 'Active' : 'Upgrade Now',
      ctaAr: isPremium ? 'مفعّل' : 'اترقي الآن',
      highlight: true
    },
    {
      id: 'bundle',
      icon: 'package',
      titleEn: 'Bundle',      titleAr: 'باقة متكاملة',
      subEn:   'Premium + 1 live session',  subAr: 'Premium + جلسة مباشرة',
      priceEn: '179',         priceAr: '179',
      periodEn: 'EGP one-time', periodAr: 'ج.م مرة واحدة',
      badge: { en: 'Best Value', ar: 'أفضل قيمة' },
      color: '#7c3aed',
      features: {
        en: ['Everything in Premium', '1 live 1-on-1 session (60 min)', 'Mentor picks for your track', 'Priority booking'],
        ar: ['كل ميزات Premium', 'جلسة مباشرة فردية (60 دقيقة)', 'مرشدون مختارون لمسارك', 'حجز ذو أولوية']
      },
      locked: null,
      ctaEn: (isPremium && state.sessionBooked) ? 'Active' : 'Get Bundle',
      ctaAr: (isPremium && state.sessionBooked) ? 'مفعّل' : 'احصل على الباقة',
      highlight: false
    }
  ];

  const check = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
  const lock  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.35"><rect width="11" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;

  const cards = plans.map((plan, idx) => {
    const isActive  = plan.id === 'premium' && isPremium;
    const isBActive = plan.id === 'bundle'  && isPremium && state.completedMilestones?.sessionBooked;
    const active    = isActive || isBActive;

    const onCta = plan.id === 'free'
      ? `onclick="showToast('${isAr ? "أنت على الخطة المجانية" : "You are on the Free plan"}','#64748b')"`
      : plan.id === 'premium'
        ? (active ? `onclick="navigateTo('progress')"` : `onclick="openPremiumLock('progress')"`)
        : plan.id === 'bundle'
          ? (active ? `onclick="navigateTo('session-booking')"` : `onclick="openBundlePayment()"`)
          : '';

    return `
      <div class="pricing-card ${plan.highlight ? 'is-recommended' : ''}" style="position:relative;${plan.highlight ? 'border:2px solid ' + plan.color + ';' : ''}"
        data-aos="fade-up" data-aos-delay="${idx * 70}">

        <!-- badge -->
        ${plan.badge ? `
          <div style="position:absolute;top:-13px;${isAr ? 'right' : 'left'}:50%;transform:translateX(${isAr ? '50%' : '-50%'});background:${plan.color};color:#fff;font-size:.7rem;font-weight:800;padding:3px 14px;border-radius:99px;white-space:nowrap;">
            ${isAr ? plan.badge.ar : plan.badge.en}
          </div>
        ` : ''}

        <!-- icon + title -->
        <div style="display:flex;align-items:center;gap:.7rem;margin-bottom:.9rem;">
          <div style="width:2.4rem;height:2.4rem;border-radius:10px;background:${plan.color}1a;border:1px solid ${plan.color}33;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i data-lucide="${plan.icon}" style="width:15px;height:15px;color:${plan.color};"></i>
          </div>
          <div>
            <div style="font-weight:800;font-size:1rem;">${isAr ? plan.titleAr : plan.titleEn}</div>
            <div class="text-muted" style="font-size:.78rem;">${isAr ? plan.subAr : plan.subEn}</div>
          </div>
          ${active ? `<div style="margin-${isAr ? 'right' : 'left'}:auto;"><span style="background:#16a34a1a;color:#16a34a;border:1px solid #16a34a33;font-size:.68rem;font-weight:800;padding:.2rem .65rem;border-radius:99px;">ACTIVE</span></div>` : ''}
        </div>

        <!-- price -->
        <div style="padding:1rem 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:1rem;">
          <div style="font-size:2.4rem;font-weight:800;line-height:1;">
            ${plan.id === 'free' ? (isAr ? 'مجاني' : 'Free')
              : `${isAr ? plan.priceAr : plan.priceEn} <span style="font-size:.85rem;font-weight:500;color:var(--text-muted);">EGP</span>`}
          </div>
          ${(isAr ? plan.periodAr : plan.periodEn) ? `<div class="text-muted" style="font-size:.78rem;margin-top:.3rem;">${isAr ? plan.periodAr : plan.periodEn}</div>` : ''}
        </div>

        <!-- features -->
        <ul style="list-style:none;padding:0;margin:0 0 1.2rem;display:grid;gap:.55rem;flex:1;">
          ${(isAr ? plan.features.ar : plan.features.en).map(f => `
            <li style="display:flex;gap:.55rem;align-items:flex-start;font-size:.86rem;">
              ${check}
              <span>${f}</span>
            </li>`).join('')}
          ${(plan.locked ? (isAr ? plan.locked.ar : plan.locked.en) : []).map(f => `
            <li style="display:flex;gap:.55rem;align-items:flex-start;font-size:.86rem;opacity:.38;">
              ${lock}
              <span>${f}</span>
            </li>`).join('')}
        </ul>

        <!-- cta -->
        <button
          class="btn ${(plan.highlight && !active) ? 'btn-primary' : active ? 'btn-secondary' : 'btn-secondary'}"
          style="width:100%;${active ? 'opacity:.7;cursor:default;' : ''}"
          ${onCta}
          ${active ? 'disabled' : ''}>
          ${active ? `<i data-lucide="shield-check" style="width:.85rem;height:.85rem;"></i>` : `<i data-lucide="${plan.icon}" style="width:.85rem;height:.85rem;"></i>`}
          ${isAr ? plan.ctaAr : plan.ctaEn}
        </button>
      </div>
    `;
  }).join('');

  /* ── sessions add-on strip ── */
  const sessionStrip = `
    <div class="surface-panel section-pad" style="margin-top:1rem;" data-aos="fade-up">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <div style="display:flex;align-items:center;gap:.9rem;">
          <div style="width:2.8rem;height:2.8rem;border-radius:12px;background:#7c3aed1a;border:1px solid #7c3aed33;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i data-lucide="calendar-check" style="width:16px;height:16px;color:#7c3aed;"></i>
          </div>
          <div>
            <div style="font-weight:700;font-size:.95rem;">${isAr ? 'جلسة فردية مع مرشد' : '1-on-1 Mentor Session'}</div>
            <div class="text-muted" style="font-size:.82rem;margin-top:.15rem;">${isAr ? '60 دقيقة — مباشر — حسب مسارك' : '60 min — live — tailored to your track'}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;">
          <span style="font-size:1.3rem;font-weight:800;">120 <span style="font-size:.8rem;font-weight:500;color:var(--text-muted);">EGP</span></span>
          <button class="btn btn-secondary" style="font-size:.84rem;" onclick="${isPremium ? "navigateTo('session-booking')" : "openSessionGate()"}">
            <i data-lucide="calendar-plus" style="width:.85rem;height:.85rem;"></i>
            ${isAr ? 'احجز جلسة' : 'Book a Session'}
          </button>
        </div>
      </div>
    </div>
  `;

  /* ── testimonial strip ── */
  const testimonial = `
    <div class="surface-soft section-pad" style="margin-top:1rem;border-${isAr ? 'right' : 'left'}:3px solid #2563eb;" data-aos="fade-up">
      <p style="font-size:.9rem;line-height:1.8;font-style:italic;color:var(--text-muted);">
        &ldquo;${isAr
          ? 'النسخة المجانية كفاية علشان تعرف عملت إيه، بس Premium خلاني أعرف ليه.'
          : 'Free was enough to see where I stood. Premium showed me exactly why — that made all the difference.'}&rdquo;
      </p>
      <div style="font-size:.78rem;color:var(--text-muted);margin-top:.5rem;">— ${isAr ? 'طالب هندسة كهربائية' : 'Electrical Engineering Student'}</div>
    </div>
  `;

  return `
    <!-- header -->
    <div class="page-header" data-aos="fade-up">
      <div>
        <div class="eyebrow">${isAr ? 'الباقات' : 'Pricing'}</div>
        <h2 class="section-title" style="margin-top:.4rem;">${isAr ? 'اختر باقتك' : 'Choose Your Plan'}</h2>
        <p class="text-muted" style="margin-top:.5rem;max-width:600px;">
          ${isAr
            ? 'ابدأ مجاناً، واترق لما تحتاج توجيهاً أعمق.'
            : 'Start free. Upgrade when you need deeper guidance.'}
        </p>
      </div>
      ${isPremium ? `
        <div class="surface-soft section-pad" style="border:1px solid rgba(34,197,94,.25);max-width:240px;">
          <div style="display:flex;gap:.5rem;align-items:center;">
            <i data-lucide="shield-check" style="width:.9rem;height:.9rem;color:#22c55e;"></i>
            <span style="font-weight:700;font-size:.88rem;">${isAr ? 'Premium مفعّل' : 'Premium Active'}</span>
          </div>
          <p class="text-muted" style="font-size:.78rem;margin-top:.3rem;">${isAr ? 'جميع المحتوى مفتوح لك.' : 'All content is unlocked for you.'}</p>
        </div>
      ` : ''}
    </div>

    <!-- 3 cards grid -->
    <div class="pricing-grid" style="margin-top:1rem;">${cards}</div>

    <!-- sessions strip -->
    ${sessionStrip}

    <!-- testimonial -->
    ${testimonial}
  `;
};

/* ── bundle payment ── */
window.openBundlePayment = function openBundlePayment() {
  const isAr = state.language === 'ar';
  const dark  = state.theme === 'dark';
  Swal.fire({
    title: isAr ? 'باقة Premium + جلسة' : 'Bundle: Premium + Session',
    html: `<div style="font-size:.9rem;color:#64748b;text-align:${isAr ? 'right' : 'left'};">${isAr ? 'ستحصل على Premium كامل + جلسة مباشرة 60 دقيقة.' : 'You get full Premium access + 1 live session (60 min).'}</div>`,
    showCancelButton: true,
    confirmButtonText: isAr ? 'ادفع 179 ج.م' : 'Pay 179 EGP',
    cancelButtonText:  isAr ? 'إلغاء' : 'Cancel',
    confirmButtonColor: '#7c3aed',
    background: dark ? '#0a0a0a' : '#ffffff',
    color:      dark ? '#fafafa' : '#09090b',
  }).then(r => {
    if (!r.isConfirmed) return;
    Swal.fire({
      title: isAr ? 'جارٍ المعالجة...' : 'Processing...',
      timer: 1800, timerProgressBar: true, showConfirmButton: false,
      background: dark ? '#0a0a0a' : '#ffffff',
      color: dark ? '#fafafa' : '#09090b',
      didOpen: () => Swal.showLoading()
    }).then(() => {
      updateProgress('premiumUnlocked', true);
      updateProgress('sessionBooked', true);
      persistState();
      showToast(isAr ? 'تم تفعيل الباقة' : 'Bundle activated', '#7c3aed', 'package');
      navigateTo('session-booking');
    });
  });
};
