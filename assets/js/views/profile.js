window.renderProfileView = function renderProfileView() {
  const p = state.profile;
  const lang = state.language;

  const collegeOptions = (window.COLLEGE_OPTIONS || []).map(opt => {
    const selected = p.college === opt.value ? 'selected' : '';
    return `<option value="${opt.value}" ${selected}>${opt.label[lang]}</option>`;
  }).join('');

  const yearOptions = [
    { value: '1', label: { en: '1st Year', ar: 'السنة الأولى' } },
    { value: '2', label: { en: '2nd Year', ar: 'السنة الثانية' } },
    { value: '3', label: { en: '3rd Year', ar: 'السنة الثالثة' } },
    { value: '4', label: { en: '4th Year', ar: 'السنة الرابعة' } },
    { value: '5', label: { en: '5th Year', ar: 'السنة الخامسة' } },
    { value: 'graduate', label: { en: 'Graduate', ar: 'خريج' } },
    { value: 'postgrad', label: { en: 'Postgraduate', ar: 'دراسات عليا' } },
  ].map(opt => {
    const selected = p.year === opt.value ? 'selected' : '';
    return `<option value="${opt.value}" ${selected}>${opt.label[lang]}</option>`;
  }).join('');

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

      <form id="profileForm" style="display:grid;gap:1.1rem;margin-top:1.5rem;">
        <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">

          <div>
            <label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('fullName')}</label>
            <input name="fullName" value="${escapeHtml(p.fullName)}" placeholder="${lang === 'ar' ? 'الاسم الكامل' : 'e.g. Ahmed Hassan'}">
          </div>

          <div>
            <label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('college')}</label>
            <select name="college">
              <option value="">${lang === 'ar' ? 'اختر الكلية / التخصص' : 'Select college / specialization'}</option>
              ${collegeOptions}
            </select>
          </div>

          <div>
            <label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('year')}</label>
            <select name="year">
              <option value="">${lang === 'ar' ? 'اختر السنة' : 'Select year'}</option>
              ${yearOptions}
            </select>
          </div>

          <div>
            <label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('emailOptional')}</label>
            <input name="email" type="email" value="${escapeHtml(p.email)}" placeholder="${lang === 'ar' ? 'اختياري' : 'Optional'}">
          </div>

        </div>

        <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:.5rem;">
          <button class="btn btn-primary" type="submit">${t('saveContinue')}</button>
          <button class="btn btn-secondary" type="button" onclick="navigateTo('test')">${t('continueToTest')}</button>
        </div>
      </form>
    </section>
  `;
};
