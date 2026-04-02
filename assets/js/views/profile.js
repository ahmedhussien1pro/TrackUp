window.renderProfileView = function renderProfileView() {
  const p = state.profile;
  const isAr = state.language === 'ar';
  const lang = isAr ? 'ar' : 'en';
  const m = state.completedMilestones;

  // Avatar initials
  const initials = p.fullName
    ? p.fullName
        .trim()
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('')
    : isAr
      ? 'أن'
      : 'AN';

  // Completion badges
  const badges = [
    { key: 'profileCompleted', icon: '👤', en: 'Profile', ar: 'بروفايل' },
    { key: 'testCompleted', icon: '✅', en: 'Test', ar: 'الاختبار' },
    { key: 'resultsViewed', icon: '📊', en: 'Results', ar: 'النتائج' },
    { key: 'premiumUnlocked', icon: '⭐', en: 'Premium', ar: 'بريميوم' },
    { key: 'sessionBooked', icon: '🎤', en: 'Mentored', ar: 'جلسة' },
  ];

  const collegeOptions = (window.COLLEGE_OPTIONS || [])
    .map((opt) => {
      const selected = p.college === opt.value ? 'selected' : '';
      return `<option value="${opt.value}" ${selected}>${opt.label[lang]}</option>`;
    })
    .join('');

  const yearOptions = [
    { value: '1', label: { en: '1st Year', ar: 'السنة الأولى' } },
    { value: '2', label: { en: '2nd Year', ar: 'السنة الثانية' } },
    { value: '3', label: { en: '3rd Year', ar: 'السنة الثالثة' } },
    { value: '4', label: { en: '4th Year', ar: 'السنة الرابعة' } },
    { value: '5', label: { en: '5th Year', ar: 'السنة الخامسة' } },
    { value: 'graduate', label: { en: 'Graduate', ar: 'خريج' } },
    { value: 'postgrad', label: { en: 'Postgraduate', ar: 'دراسات عليا' } },
  ]
    .map(
      (opt) =>
        `<option value="${opt.value}" ${p.year === opt.value ? 'selected' : ''}>${opt.label[lang]}</option>`,
    )
    .join('');

  // Filled field count for progress ring
  const filled = [p.fullName, p.college, p.year, p.email].filter(
    Boolean,
  ).length;
  const pct = Math.round((filled / 4) * 100);
  const circumference = 2 * Math.PI * 28;
  const dash = Math.round((pct / 100) * circumference);

  return `
    <div style="display:grid;gap:1.25rem;">

      <!-- Profile card with avatar -->
      <div class="surface-panel section-pad" data-aos="fade-up">
        <div style="display:flex;align-items:flex-start;gap:1.25rem;flex-wrap:wrap;">

          <!-- Avatar -->
          <div style="position:relative;flex-shrink:0;">
            <svg width="72" height="72" viewBox="0 0 72 72" style="transform:rotate(-90deg);">
              <circle cx="36" cy="36" r="28" fill="none" stroke="var(--border)" stroke-width="4"/>
              <circle cx="36" cy="36" r="28" fill="none" stroke="var(--accent)" stroke-width="4"
                stroke-dasharray="${dash} ${circumference}" stroke-linecap="round"
                style="transition:stroke-dasharray .5s ease;"/>
            </svg>
            <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
              font-weight:900;font-size:1.15rem;color:var(--accent);letter-spacing:.05em;">${initials}</div>
          </div>

          <!-- Info -->
          <div style="flex:1;min-width:200px;">
            <div style="font-weight:800;font-size:1.15rem;">${escapeHtml(p.fullName || (isAr ? 'اسمك هنا' : 'Your Name Here'))}</div>
            <div class="text-muted" style="font-size:.87rem;margin-top:.25rem;">
              ${(COLLEGE_OPTIONS || []).find((c) => c.value === p.college)?.label[lang] || (isAr ? 'لم يتم تحديد الكلية' : 'College not set')}
              ${
                p.year
                  ? ` &mdash; ${
                      [
                        { value: '1', label: { en: 'Year 1', ar: 'سنة 1' } },
                        { value: '2', label: { en: 'Year 2', ar: 'سنة 2' } },
                        { value: '3', label: { en: 'Year 3', ar: 'سنة 3' } },
                        { value: '4', label: { en: 'Year 4', ar: 'سنة 4' } },
                        { value: '5', label: { en: 'Year 5', ar: 'سنة 5' } },
                        {
                          value: 'graduate',
                          label: { en: 'Graduate', ar: 'خريج' },
                        },
                        {
                          value: 'postgrad',
                          label: { en: 'Postgrad', ar: 'دراسات عليا' },
                        },
                      ].find((y) => y.value === p.year)?.label[lang] || ''
                    }`
                  : ''
              }
            </div>
            ${p.email ? `<div class="text-muted" style="font-size:.8rem;margin-top:.2rem;">${escapeHtml(p.email)}</div>` : ''}
            <!-- Completion bar -->
            <div style="margin-top:.7rem;">
              <div style="font-size:.75rem;color:var(--text-muted);margin-bottom:.3rem;">
                ${isAr ? `متامة البروفايل: ${pct}%` : `Profile completion: ${pct}%`}
              </div>
              <div style="background:var(--border);border-radius:99px;height:5px;overflow:hidden;width:180px;">
                <div style="height:100%;width:${pct}%;background:var(--accent);border-radius:99px;transition:width .4s ease;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Achievement badges -->
        <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.1rem;padding-top:1rem;border-top:1px solid var(--border);">
          ${badges
            .map(
              (b) => `
            <div class="profile-badge ${m[b.key] ? 'profile-badge--earned' : 'profile-badge--locked'}">
              <span>${b.icon}</span>
              <span>${isAr ? b.ar : b.en}</span>
              ${m[b.key] ? '' : '<span style="font-size:.65rem;opacity:.5">🔒</span>'}
            </div>
          `,
            )
            .join('')}
        </div>
      </div>

      <!-- Edit form -->
      <div class="surface-panel section-pad" data-aos="fade-up">
        <div class="eyebrow" style="margin-bottom:.85rem;">${isAr ? 'تعديل البيانات' : 'Edit Details'}</div>
        <form id="profileForm" style="display:grid;gap:1rem;">
          <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">

            <div>
              <label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('fullName')}</label>
              <input name="fullName" value="${escapeHtml(p.fullName)}" placeholder="${isAr ? 'الاسم الكامل' : 'e.g. Ahmed Hassan'}">
            </div>

            <div>
              <label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('college')}</label>
              <select name="college">
                <option value="">${isAr ? 'اختر الكلية / التخصص' : 'Select college / specialization'}</option>
                ${collegeOptions}
              </select>
            </div>

            <div>
              <label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('year')}</label>
              <select name="year">
                <option value="">${isAr ? 'اختر السنة' : 'Select year'}</option>
                ${yearOptions}
              </select>
            </div>

            <div>
              <label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('emailOptional')}</label>
              <input name="email" type="email" value="${escapeHtml(p.email)}" placeholder="${isAr ? 'اختياري' : 'Optional'}">
            </div>

          </div>
          <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:.25rem;">
            <button class="btn btn-primary" type="submit">${t('saveContinue')}</button>
            <button class="btn btn-secondary" type="button" onclick="navigateTo('test')">${t('continueToTest')}</button>
          </div>
        </form>
      </div>

      <!-- Quick links -->
      <div class="surface-panel section-pad" data-aos="fade-up">
        <div class="eyebrow" style="margin-bottom:.85rem;">${isAr ? 'وصلات سريعة' : 'Quick Links'}</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:.6rem;">
          ${[
            {
              view: 'test',
              icon: 'clipboard-list',
              en: 'Take Test',
              ar: 'ابدأ الاختبار',
              show: true,
            },
            {
              view: 'results',
              icon: 'bar-chart-3',
              en: 'My Results',
              ar: 'نتائجي',
              show: m.testCompleted,
            },
            {
              view: 'roadmap',
              icon: 'route',
              en: 'Roadmap',
              ar: 'خارطة تطوري',
              show: m.resultsViewed,
            },
            {
              view: 'platforms',
              icon: 'layout-grid',
              en: 'Platforms',
              ar: 'منصات التعلم',
              show: true,
            },
            {
              view: 'mentors',
              icon: 'users-round',
              en: 'Mentors',
              ar: 'المرشدون',
              show: true,
            },
            {
              view: 'progress',
              icon: 'target',
              en: 'Progress',
              ar: 'تقدمي',
              show: true,
            },
          ]
            .filter((l) => l.show)
            .map(
              (l) => `
            <button class="btn btn-secondary" style="display:flex;align-items:center;gap:.5rem;justify-content:flex-start;font-size:.83rem;"
              onclick="navigateTo('${l.view}')">
              <i data-lucide="${l.icon}" style="width:.9rem;height:.9rem;flex-shrink:0;"></i>
              ${isAr ? l.ar : l.en}
            </button>
          `,
            )
            .join('')}
        </div>
      </div>

    </div>
  `;
};
