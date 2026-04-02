window.renderProfileView = function renderProfileView() {
  const p = state.profile;
  return `
    <section class="surface-panel section-pad" data-aos="fade-up">
      <div class="page-header">
        <div>
          <div class="eyebrow">${t('profileTitle')}</div>
          <h2 class="section-title" style="margin-top:.6rem;">${t('profileTitle')}</h2>
          <p class="text-muted" style="margin-top:.8rem;max-width:720px;">${t('profileDesc')}</p>
        </div>
        <div class="surface-soft section-pad" style="max-width:320px;">
          <div style="font-weight:700;">${t('profileHint')}</div>
        </div>
      </div>
      <form id="profileForm" style="display:grid;gap:1rem;margin-top:1.5rem;">
        <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">
          <div><label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('fullName')}</label><input name="fullName" value="${escapeHtml(p.fullName)}"></div>
          <div><label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('college')}</label><input name="college" value="${escapeHtml(p.college)}"></div>
          <div><label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('year')}</label><input name="year" value="${escapeHtml(p.year)}"></div>
          <div><label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('emailOptional')}</label><input name="email" value="${escapeHtml(p.email)}"></div>
        </div>
        <div style="display:flex;gap:.75rem;flex-wrap:wrap;">
          <button class="btn btn-primary" type="submit">${t('saveContinue')}</button>
          <button class="btn btn-secondary" type="button" onclick="navigateTo('test')">${t('continueToTest')}</button>
        </div>
      </form>
    </section>
  `;
};
