window.renderPricingView = function renderPricingView() {
  const isPremium = state.premiumUnlocked;
  const lang = state.language;

  return `
    <section class="surface-panel section-pad">
      <div class="page-header" data-aos="fade-up">
        <div>
          <div class="eyebrow">${t('pricingTitle')}</div>
          <h2 class="section-title" style="margin-top:.6rem;">${t('pricingTitle')}</h2>
          <p class="text-muted" style="margin-top:.8rem;max-width:780px;">${t('pricingDesc')}</p>
        </div>
        ${isPremium ? `
          <div class="surface-soft section-pad" style="max-width:280px;border:1px solid rgba(21,150,242,.25);">
            <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.4rem;">
              <i data-lucide="shield-check" style="width:.95rem;height:.95rem;color:var(--brand);"></i>
              <span style="font-weight:700;font-size:.9rem;">${lang === 'ar' ? 'الخطة المدفوعة مفعّلة' : 'Premium plan active'}</span>
            </div>
            <p class="text-muted" style="font-size:.82rem;line-height:1.65;">${lang === 'ar' ? 'أنت تستخدم الخطة المدفوعة. كل مرحلة مفتوحة.' : 'You are on the Premium plan. All stages are unlocked.'}</p>
          </div>
        ` : `
          <div class="surface-soft section-pad" style="max-width:300px;">
            <div style="font-weight:700;">${t('sessionsPaid')}</div>
            <div class="text-muted" style="margin-top:.5rem;">${t('whyPaid')}</div>
          </div>
        `}
      </div>

      <div class="pricing-grid" style="margin-top:1.4rem;">
        ${PRICING.map((plan, idx) => {
          const isActivePlan = (plan.id === 'premium' || plan.id === 'pro') && isPremium;
          const isFree = plan.id === 'free';

          // Button logic: if this plan is already active, show "Active" state instead of CTA
          let btnLabel, btnClass, btnAction;
          if (isActivePlan) {
            btnLabel = lang === 'ar' ? 'مفعّل ✓' : 'Active \u2713';
            btnClass = 'btn-secondary';
            btnAction = `onclick="navigateTo('progress')"`;  // take them to progress to see what changed
          } else if (isFree) {
            btnLabel = isPremium ? (lang === 'ar' ? 'الخطة المجانية' : 'Free plan') : t('startNow');
            btnClass = 'btn-secondary';
            btnAction = `onclick="activatePlan('free')"${isPremium ? ' disabled' : ''}`;
          } else if (plan.id === 'session') {
            btnLabel = t('bookSession');
            btnClass = 'btn-primary';
            btnAction = `onclick="activatePlan('session')"${!isPremium ? ` title="${lang === 'ar' ? 'يتطلب الخطة المدفوعة أولاً' : 'Requires Premium first'}"` : ''}`;
          } else {
            btnLabel = t('upgradeNow');
            btnClass = 'btn-primary';
            btnAction = `onclick="activatePlan('${plan.id}')"`;  
          }

          return `
            <div
              class="pricing-card ${plan.id === 'premium' ? 'is-recommended' : ''}"
              style="${isActivePlan ? 'border:1.5px solid rgba(21,150,242,.4);' : ''}"
              data-aos="fade-up" data-aos-delay="${idx * 70}"
            >
              <div class="page-header">
                <div>
                  <div style="font-weight:800;">${plan.title[lang]}</div>
                  <div class="text-muted" style="margin-top:.35rem;font-size:.92rem;">${plan.label[lang]}</div>
                </div>
                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.35rem;">
                  ${plan.id === 'premium' ? `<span class="badge badge-accent">${t('recommended')}</span>` : ''}
                  ${isActivePlan ? `<span class="badge" style="background:rgba(21,150,242,.15);color:var(--brand);border:1px solid rgba(21,150,242,.3);"><i data-lucide="check" style="width:.7rem;height:.7rem;"></i>&nbsp;${lang === 'ar' ? 'مفعّل' : 'Active'}</span>` : ''}
                </div>
              </div>
              <div style="font-size:2rem;font-weight:800;margin-top:1rem;">${plan.price[lang]}</div>
              <div class="text-muted" style="margin-top:1rem;line-height:1.8;flex:1;">
                ${plan.features[lang].map(i => `• ${i}`).join('<br>')}
              </div>
              <button
                class="btn ${btnClass}"
                style="margin-top:1.1rem;width:100%;${isActivePlan ? 'opacity:.75;cursor:default;' : ''}"
                ${btnAction}
              >${btnLabel}</button>
            </div>
          `;
        }).join('')}
      </div>

      <div class="page-grid-2" style="margin-top:1.4rem;">
        <div class="surface-soft section-pad" data-aos="fade-up">
          <div class="eyebrow">${t('freePaid')}</div>
          <p class="text-muted" style="margin-top:.7rem;line-height:1.8;">${t('freePaidDesc')}</p>
        </div>
        <div class="fit-rail-card" data-aos="fade-up" data-aos-delay="80">
          <div class="eyebrow">${t('whyPaid')}</div>
          <p class="text-muted" style="margin-top:.7rem;line-height:1.8;">${t('strongerPaid')}</p>
        </div>
      </div>
    </section>
  `;
};
