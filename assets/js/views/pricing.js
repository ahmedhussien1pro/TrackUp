window.renderPricingView = function renderPricingView() {
  const isPremium = state.premiumUnlocked;
  const isAr = state.language === 'ar';

  const cards = PRICING.map((plan, idx) => {
    const isActive      = plan.id === 'premium' && isPremium;
    const isHighlight   = plan.id === 'bundle';
    const isRecommended = plan.id === 'premium' || plan.id === 'bundle';

    let btnLabel, btnAction, btnDisabled = false;

    if (isActive) {
      btnLabel    = isAr ? 'مفعّل' : 'Active';
      btnAction   = `onclick="navigateTo('progress')"`;
      btnDisabled = true;
    } else if (plan.id === 'free') {
      btnLabel    = isPremium ? (isAr ? 'الخطة الحالية' : 'Current Plan') : (isAr ? plan.cta.ar : plan.cta.en);
      btnAction   = `onclick="activatePlan('free')"`;
      btnDisabled = isPremium;
    } else if (plan.id === 'premium') {
      btnLabel  = isAr ? plan.cta.ar : plan.cta.en;
      btnAction = `onclick="openPremiumLock('progress')"`;
    } else if (plan.id === 'session') {
      btnLabel  = isAr ? plan.cta.ar : plan.cta.en;
      btnAction = isPremium ? `onclick="navigateTo('mentors')"` : `onclick="openPremiumLock('mentors')"`;
    } else if (plan.id === 'full-session') {
      btnLabel  = isAr ? plan.cta.ar : plan.cta.en;
      btnAction = isPremium ? `onclick="navigateTo('session-booking')"` : `onclick="openPremiumLock('session-booking')"`;
    } else if (plan.id === 'bundle') {
      btnLabel  = isAr ? plan.cta.ar : plan.cta.en;
      btnAction = `onclick="activatePlan('bundle')"`;
    } else {
      btnLabel  = isAr ? plan.cta.ar : plan.cta.en;
      btnAction = `onclick="activatePlan('${plan.id}')"`;
    }

    const priceDisplay = plan.id === 'free'
      ? (isAr ? 'مجاني' : 'Free')
      : `${isAr ? plan.price.ar : plan.price.en} <span style="font-size:1rem;font-weight:500;color:var(--text-muted);">${plan.currency ? (isAr ? plan.currency.ar : plan.currency.en) : ''}</span>`;

    const borderStyle = isActive
      ? 'border:1.5px solid var(--accent);'
      : isHighlight ? 'border:1.5px solid var(--brand,#7c3aed);' : '';

    return `
      <div
        class="pricing-card ${isRecommended ? 'is-recommended' : ''}"
        style="${borderStyle}position:relative;"
        data-aos="fade-up" data-aos-delay="${idx * 60}">

        ${plan.badge ? `
          <div style="position:absolute;top:-12px;${isAr ? 'right' : 'left'}:50%;transform:translateX(${isAr ? '50%' : '-50%'});background:${isHighlight ? 'var(--brand,#7c3aed)' : 'var(--accent)'};color:#fff;font-size:.72rem;font-weight:800;padding:3px 14px;border-radius:99px;white-space:nowrap;">
            ${isAr ? plan.badge.ar : plan.badge.en}
          </div>
        ` : ''}

        <div style="margin-bottom:.5rem;">
          <div style="font-weight:800;font-size:1.05rem;">${isAr ? plan.title.ar : plan.title.en}</div>
          <div class="text-muted" style="font-size:.84rem;margin-top:.2rem;">${isAr ? plan.subtitle.ar : plan.subtitle.en}</div>
        </div>

        <div style="margin:1rem 0;padding:1rem 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
          <span style="font-size:2.2rem;font-weight:800;line-height:1;">${priceDisplay}</span>
          <div class="text-muted" style="font-size:.8rem;margin-top:.3rem;">${isAr ? plan.period.ar : plan.period.en}</div>
          ${plan.note ? `<div style="font-size:.75rem;color:#f59e0b;margin-top:.3rem;font-weight:600;">* ${isAr ? plan.note.ar : plan.note.en}</div>` : ''}
        </div>

        <ul style="list-style:none;padding:0;margin:0 0 1rem;display:grid;gap:.55rem;flex:1;">
          ${(isAr ? plan.features.ar : plan.features.en).map(f => `
            <li style="display:flex;gap:.6rem;align-items:flex-start;font-size:.86rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-top:.2rem;flex-shrink:0;"><path d="M20 6 9 17l-5-5"/></svg>
              ${f}
            </li>
          `).join('')}
          ${plan.locked ? (isAr ? plan.locked.ar : plan.locked.en).map(f => `
            <li style="display:flex;gap:.6rem;align-items:flex-start;font-size:.86rem;opacity:.4;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-top:.2rem;flex-shrink:0;"><rect width="11" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              ${f}
            </li>
          `).join('') : ''}
        </ul>

        <button
          class="btn ${(isRecommended && !isActive) ? 'btn-primary' : 'btn-secondary'}"
          style="width:100%;${btnDisabled ? 'opacity:.65;cursor:default;' : ''}"
          ${btnAction}
          ${btnDisabled ? 'disabled' : ''}>
          ${isActive ? `<i data-lucide="shield-check" style="width:.9rem;height:.9rem;"></i>` : ''}
          ${btnLabel}
        </button>
      </div>
    `;
  }).join('');

  return `
    <div class="page-header" data-aos="fade-up">
      <div>
        <div class="eyebrow">${isAr ? 'الباقات' : 'Plans'}</div>
        <h2 class="section-title" style="margin-top:.5rem;">${isAr ? 'ابدأ مجاناً، طوّر نفسك بجدية' : 'Start Free. Grow Seriously.'}</h2>
        <p class="text-muted" style="margin-top:.6rem;max-width:600px;line-height:1.8;">
          ${isAr
            ? 'اختبار التوجيه مجاني دائماً. Premium يفتح لك الخارطة الكاملة والجلسات مع الخبراء.'
            : 'The assessment is always free. Premium unlocks your full roadmap, expert sessions, and more.'}
        </p>
      </div>
      ${isPremium ? `
        <div class="surface-soft section-pad" style="border:1px solid rgba(59,130,246,.3);max-width:240px;">
          <div style="display:flex;gap:.5rem;align-items:center;margin-bottom:.3rem;">
            <i data-lucide="shield-check" style="width:.9rem;height:.9rem;color:var(--accent);"></i>
            <span style="font-weight:700;font-size:.9rem;">Premium ${isAr ? 'مفعّل' : 'Active'}</span>
          </div>
          <p class="text-muted" style="font-size:.8rem;">${isAr ? 'كل المراحل مفتوحة.' : 'All stages are unlocked.'}</p>
        </div>
      ` : ''}
    </div>

    <!-- Plans grid: max 3 per row -->
    <div class="pricing-grid" style="margin-top:1rem;">
      ${cards}
    </div>

    <!-- Sessions upsell strip -->
    <div class="surface-soft section-pad" style="margin-top:1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;border:1px solid var(--border);" data-aos="fade-up">
      <div style="display:flex;gap:.75rem;align-items:center;">
        <div style="width:2.4rem;height:2.4rem;border-radius:10px;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i data-lucide="calendar-days" style="width:1rem;height:1rem;color:var(--accent);"></i>
        </div>
        <div>
          <div style="font-weight:700;font-size:.95rem;">${isAr ? 'جلسة مع خبير — 60 دقيقة' : '1-on-1 Expert Session — 60 min'}</div>
          <p class="text-muted" style="font-size:.82rem;margin-top:.15rem;">
            ${isAr ? 'احجز جلسة مباشرة مع مرشد متخصص في مسارك.' : 'Book a live session with a mentor specialized in your track.'}
          </p>
        </div>
      </div>
      <button class="btn btn-primary" onclick="${isPremium ? "navigateTo('session-booking')" : "openPremiumLock('session-booking')"}">
        ${isAr ? 'احجز الآن' : 'Book Now'}
      </button>
    </div>

    <!-- Testimonial -->
    <div class="surface-panel section-pad" style="margin-top:1rem;" data-aos="fade-up">
      <div style="display:flex;gap:1rem;align-items:flex-start;">
        <div style="width:2.2rem;height:2.2rem;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;font-size:.85rem;flex-shrink:0;">A</div>
        <div>
          <p style="font-size:.92rem;line-height:1.8;font-style:italic;color:var(--text);">
            &ldquo;${isAr
              ? 'النسخة المجانية كفاية علشان تعرف مكانك، بس Premium خلاني أعرف ليه وإزاي.'
              : 'Free was enough to know where I stood. Premium showed me why — that made all the difference.'}&rdquo;
          </p>
          <div style="font-size:.78rem;color:var(--text-muted);margin-top:.45rem;">— ${isAr ? 'طالب هندسة، القاهرة' : 'Engineering Student, Cairo'}</div>
        </div>
      </div>
    </div>
  `;
};

// ── activatePlan ──────────────────────────────────────────────
window.activatePlan = function activatePlan(planId) {
  const isAr = state.language === 'ar';

  if (planId === 'free') {
    showToast(isAr ? 'أنت على الخطة المجانية.' : 'You are on the Free plan.', '#2563eb');
    return;
  }

  if (planId === 'premium' || planId === 'bundle') {
    openPremiumLock(planId === 'bundle' ? 'progress' : 'progress');
    return;
  }

  showToast(isAr ? 'اختار مرشدك لحجز الجلسة.' : 'Choose a mentor to book your session.', '#7c3aed');
  navigateTo('mentors');
};
