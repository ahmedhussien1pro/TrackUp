window.renderSessionBookingView = function renderSessionBookingView() {
  const track = getCurrentTrack();
  return `
    <section class="page-grid-2">
      <div class="surface-panel section-pad" data-aos="fade-up">
        <div class="eyebrow">${t('sessionTitle')}</div>
        <h2 class="section-title" style="margin-top:.6rem;">${t('sessionTitle')}</h2>
        <p class="text-muted" style="margin-top:.8rem;line-height:1.8;">${t('sessionDesc')}</p>
        <div class="fit-rail-card" style="margin-top:1rem;">
          <div class="eyebrow">${t('sessionValue')}</div>
          <p class="text-muted" style="margin-top:.6rem;line-height:1.8;">${t('sessionValueDesc')}</p>
        </div>
        <div class="surface-soft section-pad" style="margin-top:1rem;">
          <div class="eyebrow">${t('chooseTrack')}</div>
          <div style="font-weight:800;font-size:1.1rem;margin-top:.6rem;">${track.title[state.language]}</div>
        </div>
        ${!state.premiumUnlocked ? `
          <div class="surface-soft section-pad" style="margin-top:1rem;">
            <div style="font-weight:800;">${t('sessionsPaid')}</div>
            <p class="text-muted" style="margin-top:.6rem;line-height:1.8;">${t('premiumReason')}</p>
            <button class="btn btn-primary" style="margin-top:1rem;" onclick="openPremiumLock('session-booking')">${t('upgradeNow')}</button>
          </div>
        ` : ''}
      </div>
      <div class="surface-panel section-pad" data-aos="fade-up" data-aos-delay="90">
        <form id="sessionForm" style="display:grid;gap:1rem;">
          <div><label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('fullName')}</label><input name="fullName" value="${escapeHtml(state.profile.fullName || '')}"></div>
          <div><label style="display:block;margin-bottom:.5rem;font-weight:600;">Email</label><input name="email" value="${escapeHtml(state.profile.email || '')}"></div>
          <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));">
            <div><label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('password')}</label><input name="password" type="password"></div>
            <div><label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('confirmPassword')}</label><input name="confirmPassword" type="password"></div>
          </div>
          <div><label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('specialization')}</label><input name="specialization" value="${escapeHtml(state.profile.college || '')}"></div>
          <div>
            <label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('topic')}</label>
            <select name="topic">
              <option value="">${t('topic')}</option>
              <option value="${track.title[state.language]}">${track.title[state.language]}</option>
              <option value="${state.language === 'ar' ? 'مراجعة النتيجة' : 'Result review'}">${state.language === 'ar' ? 'مراجعة النتيجة' : 'Result review'}</option>
              <option value="${state.language === 'ar' ? 'تخطيط الخارطة' : 'Roadmap planning'}">${state.language === 'ar' ? 'تخطيط الخارطة' : 'Roadmap planning'}</option>
              <option value="${state.language === 'ar' ? 'بداية التعلم' : 'Learning start'}">${state.language === 'ar' ? 'بداية التعلم' : 'Learning start'}</option>
            </select>
          </div>
          <div style="display:flex;gap:.75rem;flex-wrap:wrap;">
            <button class="btn btn-primary" type="submit">${t('submitBooking')}</button>
            <button class="btn btn-secondary" type="button" onclick="navigateTo('pricing')">${t('viewPricing')}</button>
          </div>
        </form>
      </div>
    </section>
  `;
};
