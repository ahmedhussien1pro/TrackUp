window.renderPricingView = function renderPricingView() {
  const isPremium = state.premiumUnlocked;
  const isAr = state.language === 'ar';

  const revenueStreams = [
    {
      icon: 'credit-card',
      titleEn: 'Subscriptions',
      titleAr: 'اشتراكات شهرية',
      descEn: 'Monthly recurring revenue from Premium plan subscribers.',
      descAr: 'دخل شهري متكرّر من مشتركي الباقة المدفوعة.',
      color: '#2563eb'
    },
    {
      icon: 'calendar-check',
      titleEn: 'Session Fees',
      titleAr: 'رسوم الجلسات',
      descEn: 'Platform takes 20% commission on every booked mentor session.',
      descAr: 'المنصة تأخذ 20% عمولة من كل جلسة تُحجز.',
      color: '#7c3aed'
    },
    {
      icon: 'tag',
      titleEn: 'Affiliate Commissions',
      titleAr: 'عمولات الشراكات',
      descEn: 'Revenue share with ITI, Udemy, and career centers via promo codes.',
      descAr: 'حصة من اشتراكات ITI وUdemy ومراكز التدريب عبر برومو كودات.',
      color: '#059669'
    }
  ];

  const cards = PRICING.map((plan, idx) => {
    const isActive = (plan.id === 'premium') && isPremium;
    const isRecommended = plan.id === 'premium';
    const isSession = plan.id === 'session';

    let btnLabel, btnAction, btnDisabled = false;
    if (isActive) {
      btnLabel = isAr ? 'مفعّل ✓' : 'Active ✓';
      btnAction = `onclick="navigateTo('progress')"`;  
      btnDisabled = true;
    } else if (plan.id === 'free') {
      btnLabel = isPremium ? (isAr ? 'مستخدمٌ حاليًا' : 'Currently Using') : plan.cta[isAr ? 'ar' : 'en'];
      btnAction = `onclick="activatePlan('free')"`;  
      btnDisabled = isPremium;
    } else if (isSession) {
      btnLabel = plan.cta[isAr ? 'ar' : 'en'];
      btnAction = isPremium ? `onclick="navigateTo('mentors')"` : `onclick="activatePlan('premium')"`;  
    } else {
      btnLabel = plan.cta[isAr ? 'ar' : 'en'];
      btnAction = `onclick="activatePlan('${plan.id}')"`;  
    }

    const priceDisplay = plan.id === 'free'
      ? (isAr ? 'مجاني' : 'Free')
      : `${isAr ? plan.price.ar : plan.price.en} <span style="font-size:1rem;font-weight:500;color:var(--text-muted);">${isAr ? 'ج.م' : 'EGP'}</span>`;

    return `
      <div
        class="pricing-card ${isRecommended ? 'is-recommended' : ''}"
        style="${isActive ? 'border:1.5px solid var(--accent);' : ''}position:relative;"
        data-aos="fade-up" data-aos-delay="${idx * 80}">

        ${plan.badge ? `
          <div style="position:absolute;top:-12px;${isAr ? 'right' : 'left'}:50%;transform:translateX(${isAr ? '50%' : '-50%'});background:var(--accent);color:#fff;font-size:.72rem;font-weight:800;padding:3px 14px;border-radius:99px;white-space:nowrap;">
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
          ${isSession && plan.note ? `<div style="font-size:.75rem;color:#f59e0b;margin-top:.3rem;font-weight:600;">* ${isAr ? plan.note.ar : plan.note.en}</div>` : ''}
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
          class="btn ${isRecommended && !isActive ? 'btn-primary' : 'btn-secondary'}"
          style="width:100%;${btnDisabled ? 'opacity:.65;cursor:default;' : ''}"
          ${btnAction}
          ${btnDisabled ? 'disabled' : ''}>
          ${btnLabel}
        </button>
      </div>
    `;
  }).join('');

  return `
    <div class="page-header" data-aos="fade-up">
      <div>
        <div class="eyebrow">${t('pricingTitle')}</div>
        <h2 class="section-title" style="margin-top:.5rem;">${t('pricingTitle')}</h2>
        <p class="text-muted" style="margin-top:.6rem;max-width:680px;">${t('pricingDesc')}</p>
      </div>
      ${isPremium ? `
        <div class="surface-soft section-pad" style="border:1px solid rgba(59,130,246,.3);max-width:260px;">
          <div style="display:flex;gap:.5rem;align-items:center;margin-bottom:.3rem;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span style="font-weight:700;font-size:.9rem;">${isAr ? 'عضو مدفوع 👑' : 'Premium Active 👑'}</span>
          </div>
          <p class="text-muted" style="font-size:.8rem;">${isAr ? 'جميع المراحل مفتوحة لك.' : 'All stages are unlocked.'}</p>
        </div>
      ` : ''}
    </div>

    <!-- Pricing Cards -->
    <div class="pricing-grid" style="margin-top:1rem;">
      ${cards}
    </div>

    <!-- Business Model Section -->
    <div class="surface-panel section-pad" style="margin-top:1.5rem;" data-aos="fade-up">
      <div class="eyebrow" style="margin-bottom:1rem;">${isAr ? 'كيف تربح المنصة' : 'How TrackUp makes money'}</div>
      <div style="display:grid;gap:1rem;">
        ${revenueStreams.map(r => `
          <div style="display:flex;gap:1rem;align-items:flex-start;">
            <div style="width:2.2rem;height:2.2rem;border-radius:10px;background:${r.color}18;border:1px solid ${r.color}33;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i data-lucide="${r.icon}" style="width:15px;height:15px;color:${r.color};"></i>
            </div>
            <div>
              <div style="font-weight:700;font-size:.92rem;">${isAr ? r.titleAr : r.titleEn}</div>
              <div class="text-muted" style="font-size:.84rem;margin-top:.2rem;line-height:1.6;">${isAr ? r.descAr : r.descEn}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Comparison hint -->
    <div class="page-grid-2" style="margin-top:1rem;">
      <div class="surface-soft section-pad" data-aos="fade-up">
        <div class="eyebrow">${t('freePaid')}</div>
        <p class="text-muted" style="margin-top:.6rem;line-height:1.8;font-size:.9rem;">${t('freePaidDesc')}</p>
      </div>
      <div class="fit-rail-card" data-aos="fade-up" data-aos-delay="80">
        <div class="eyebrow">${isAr ? 'رأي طالب' : 'Student quote'}</div>
        <p class="text-muted" style="margin-top:.6rem;line-height:1.8;font-size:.9rem;font-style:italic;">
          &ldquo;${isAr
            ? 'النسخة المجانية كفاية علشان تعرف عملت إيه، بس المدفوع خلاني أعرف ليه.'
            : 'Free was enough to know where I stood. Premium showed me why — that made all the difference.'}&rdquo;
        </p>
        <div style="font-size:.78rem;color:var(--text-muted);margin-top:.5rem;">— ${isAr ? 'طالب هندسة برمجيات' : 'Software Engineering Student'}</div>
      </div>
    </div>
  `;
};
