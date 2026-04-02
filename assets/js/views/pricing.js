window.renderPricingView = function renderPricingView() {
  return `
    <section class="surface-panel section-pad">
      <div class="page-header" data-aos="fade-up">
        <div>
          <div class="eyebrow">${t('pricingTitle')}</div>
          <h2 class="section-title" style="margin-top:.6rem;">${t('pricingTitle')}</h2>
          <p class="text-muted" style="margin-top:.8rem;max-width:780px;">${t('pricingDesc')}</p>
        </div>
        <div class="surface-soft section-pad" style="max-width:300px;">
          <div style="font-weight:700;">${t('sessionsPaid')}</div>
          <div class="text-muted" style="margin-top:.5rem;">${t('whyPaid')}</div>
        </div>
      </div>
      <div class="pricing-grid" style="margin-top:1.4rem;">
        ${PRICING.map((plan, idx) => `
          <div class="pricing-card ${plan.id === 'premium' ? 'is-recommended' : ''}" data-aos="fade-up" data-aos-delay="${idx * 70}">
            <div class="page-header">
              <div>
                <div style="font-weight:800;">${plan.title[state.language]}</div>
                <div class="text-muted" style="margin-top:.35rem;font-size:.92rem;">${plan.label[state.language]}</div>
              </div>
              ${plan.id === 'premium' ? `<span class="badge badge-accent">${t('recommended')}</span>` : ''}
            </div>
            <div style="font-size:2rem;font-weight:800;margin-top:1rem;">${plan.price[state.language]}</div>
            <div class="text-muted" style="margin-top:1rem;line-height:1.8;flex:1;">${plan.features[state.language].map(i => `• ${i}`).join('<br>')}</div>
            <button class="btn ${plan.id === 'free' ? 'btn-secondary' : 'btn-primary'}" style="margin-top:1.1rem;width:100%;" onclick="activatePlan('${plan.id}')">${plan.id === 'session' ? t('bookSession') : plan.id === 'free' ? t('startNow') : t('upgradeNow')}</button>
          </div>
        `).join('')}
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
