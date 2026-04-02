window.renderRecordedLibraryView = function renderRecordedLibraryView() {
  const isAr = state.language === 'ar';

  if (!state.premiumUnlocked) {
    return `
      <div class="surface-panel section-pad" style="text-align:center;max-width:520px;margin:0 auto;" data-aos="fade-up">
        <div style="width:3rem;height:3rem;border-radius:12px;background:var(--accent-soft,rgba(37,99,235,.1));display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;">
          <i data-lucide="lock" style="width:1.3rem;height:1.3rem;color:var(--accent);"></i>
        </div>
        <div style="font-weight:800;font-size:1.1rem;margin-bottom:.5rem;">
          ${isAr ? 'المكتبة متاحة للأعضاء المدفوعين' : 'Library is for Premium Members'}
        </div>
        <p class="text-muted" style="font-size:.9rem;line-height:1.7;margin-bottom:1.2rem;">
          ${isAr
            ? 'اشترك في الباقة المدفوعة للوصول إلى مكتبة جلسات مسجّلة من خبراء في كل تخصص.'
            : 'Upgrade to Premium to access recorded expert sessions covering every engineering specialization.'}
        </p>
        <button class="btn btn-primary" onclick="navigateTo('pricing')">
          ${isAr ? 'اشترك الآن' : 'Upgrade to Premium'}
        </button>
      </div>
    `;
  }

  const sessions = [
    {
      id: 'rl-1',
      trackKey: 'power',
      titleEn: 'Power Systems Fundamentals — What Every Graduate Must Know',
      titleAr: 'أساسيات أنظمة القوى — ما يجب على كل خريج معرفته',
      mentorEn: 'Dr. Ahmed Kamal',
      mentorAr: 'د. أحمد كمال',
      durationMin: 58,
      labelEn: 'Power',
      labelAr: 'قوى',
      color: '#2563eb',
      avatar: 'AK',
      views: 1240
    },
    {
      id: 'rl-2',
      trackKey: 'embedded',
      titleEn: 'Embedded Systems Roadmap — From Arduino to RTOS',
      titleAr: 'خارطة طريق الأنظمة المدمجة — من Arduino إلى RTOS',
      mentorEn: 'Dr. Ahmed Kamal',
      mentorAr: 'د. أحمد كمال',
      durationMin: 64,
      labelEn: 'Embedded',
      labelAr: 'مدمج',
      color: '#7c3aed',
      avatar: 'AK',
      views: 2180
    },
    {
      id: 'rl-3',
      trackKey: 'communications',
      titleEn: 'Communications Engineering — 5G, RF, and Career Paths',
      titleAr: 'هندسة الاتصالات — 5G وRF والمسارات الوظيفية',
      mentorEn: 'Dr. Ahmed Kamal',
      mentorAr: 'د. أحمد كمال',
      durationMin: 52,
      labelEn: 'Comms',
      labelAr: 'اتصالات',
      color: '#059669',
      avatar: 'AK',
      views: 980
    },
    {
      id: 'rl-4',
      trackKey: 'power',
      titleEn: 'How to Land Your First Job in Power Engineering',
      titleAr: 'كيف تحصل على أول وظيفة في هندسة القوى',
      mentorEn: 'Eng. Tarek Salah',
      mentorAr: 'م. طارق صلاح',
      durationMin: 47,
      labelEn: 'Career',
      labelAr: 'مسار مهني',
      color: '#e11d48',
      avatar: 'TS',
      views: 3100
    },
    {
      id: 'rl-5',
      trackKey: 'embedded',
      titleEn: 'Firmware vs Software — Which Path Fits You?',
      titleAr: 'Firmware ولا Software — أيهما يناسبك؟',
      mentorEn: 'Eng. Tarek Salah',
      mentorAr: 'م. طارق صلاح',
      durationMin: 41,
      labelEn: 'Career',
      labelAr: 'مسار مهني',
      color: '#e11d48',
      avatar: 'TS',
      views: 1870
    },
    {
      id: 'rl-6',
      trackKey: 'communications',
      titleEn: 'RF Engineering Deep Dive — Tools, Skills & Market',
      titleAr: 'RF Engineering بعمق — الأدوات والمهارات والسوق',
      mentorEn: 'Dr. Ahmed Kamal',
      mentorAr: 'د. أحمد كمال',
      durationMin: 55,
      labelEn: 'Comms',
      labelAr: 'اتصالات',
      color: '#059669',
      avatar: 'AK',
      views: 760
    }
  ];

  const filter = state.libraryFilter || 'all';
  const filters = [
    { key: 'all',           labelEn: 'All',          labelAr: 'الكل' },
    { key: 'power',         labelEn: 'Power',        labelAr: 'قوى' },
    { key: 'embedded',      labelEn: 'Embedded',     labelAr: 'مدمج' },
    { key: 'communications',labelEn: 'Comms',        labelAr: 'اتصالات' }
  ];

  const filtered = filter === 'all' ? sessions : sessions.filter(s => s.trackKey === filter);
  const watched = state.watchedSessions || [];

  const cards = filtered.map((s, idx) => {
    const isWatched = watched.includes(s.id);
    return `
      <div class="surface-panel" style="overflow:hidden;display:flex;flex-direction:column;" data-aos="fade-up" data-aos-delay="${idx * 60}">
        <!-- Thumbnail -->
        <div style="background:${s.color}18;border-bottom:1px solid var(--border);padding:1.5rem;display:flex;align-items:center;justify-content:center;min-height:110px;position:relative;">
          <div style="width:3.2rem;height:3.2rem;border-radius:50%;background:${s.color};display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;font-size:1rem;">${s.avatar}</div>
          <div style="position:absolute;bottom:.6rem;${isAr?'right':'left'}:.75rem;background:rgba(0,0,0,.55);backdrop-filter:blur(4px);border-radius:6px;padding:.2rem .55rem;font-size:.72rem;font-weight:700;color:#fff;">
            ${s.durationMin} ${isAr ? 'دقيقة' : 'min'}
          </div>
          ${isWatched ? `
            <div style="position:absolute;top:.6rem;${isAr?'left':'right'}:.75rem;background:#16a34a;border-radius:6px;padding:.2rem .55rem;font-size:.7rem;font-weight:700;color:#fff;display:flex;align-items:center;gap:.3rem;">
              <i data-lucide="check" style="width:.65rem;height:.65rem;"></i>${isAr?'شاهدت':'Watched'}
            </div>
          ` : ''}
          <div style="position:absolute;top:.6rem;${isAr?'right':'left'}:.75rem;">
            <span style="background:${s.color};color:#fff;font-size:.68rem;font-weight:700;padding:.2rem .6rem;border-radius:99px;">
              ${isAr ? s.labelAr : s.labelEn}
            </span>
          </div>
        </div>
        <!-- Body -->
        <div class="section-pad" style="flex:1;display:flex;flex-direction:column;gap:.5rem;">
          <div style="font-weight:700;font-size:.93rem;line-height:1.5;">${isAr ? s.titleAr : s.titleEn}</div>
          <div class="text-muted" style="font-size:.8rem;display:flex;align-items:center;gap:.4rem;">
            <i data-lucide="user" style="width:.75rem;height:.75rem;"></i>
            ${isAr ? s.mentorAr : s.mentorEn}
          </div>
          <div class="text-muted" style="font-size:.78rem;display:flex;align-items:center;gap:.4rem;">
            <i data-lucide="play-circle" style="width:.75rem;height:.75rem;"></i>
            ${s.views.toLocaleString()} ${isAr ? 'مشاهدة' : 'views'}
          </div>
          <button
            class="btn ${isWatched ? 'btn-secondary' : 'btn-primary'}"
            style="margin-top:auto;width:100%;"
            onclick="markSessionWatched('${s.id}')">
            <i data-lucide="${isWatched ? 'rotate-ccw' : 'play'}" style="width:.85rem;height:.85rem;"></i>
            ${isWatched ? (isAr ? 'شاهد مرة أخرى' : 'Watch Again') : (isAr ? 'شاهد الآن' : 'Watch Now')}
          </button>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="page-header" data-aos="fade-up">
      <div>
        <div class="eyebrow">${isAr ? 'مكتبة الجلسات' : 'Recorded Library'}</div>
        <h2 class="section-title" style="margin-top:.4rem;">${isAr ? 'جلسات خبراء مسجّلة' : 'Expert Sessions on Demand'}</h2>
        <p class="text-muted" style="font-size:.88rem;margin-top:.4rem;max-width:600px;">
          ${isAr
            ? 'جلسات حقيقية من مرشدين خبراء — شاهد، تعلم، وابدأ مسارك بثقة.'
            : 'Real sessions from expert mentors. Watch at your own pace and start your track with confidence.'}
        </p>
      </div>
    </div>

    <!-- Filter tabs -->
    <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1.25rem;" data-aos="fade-up">
      ${filters.map(f => `
        <button
          class="btn ${filter === f.key ? 'btn-primary' : 'btn-secondary'}"
          style="font-size:.82rem;padding:.35rem .9rem;"
          onclick="setLibraryFilter('${f.key}')">
          ${isAr ? f.labelAr : f.labelEn}
        </button>
      `).join('')}
    </div>

    <!-- Cards grid -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;">
      ${cards || `<p class="text-muted" style="grid-column:1/-1;text-align:center;padding:2rem 0;">${isAr ? 'لا توجد جلسات في هذا التصنيف.' : 'No sessions in this category yet.'}</p>`}
    </div>

    <!-- CTA block -->
    <div class="surface-soft section-pad" style="margin-top:1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;" data-aos="fade-up">
      <div>
        <div style="font-weight:700;font-size:.95rem;">${isAr ? 'هل عايز جلسة مباشرة؟' : 'Want a Live Session Instead?'}</div>
        <p class="text-muted" style="font-size:.84rem;margin-top:.25rem;">
          ${isAr ? 'احجز جلسة 60 دقيقة مع مرشد وافهم مسارك بعمق.' : 'Book a 60-min 1-on-1 with a mentor and go deeper.'}
        </p>
      </div>
      <button class="btn btn-primary" onclick="navigateTo('mentors')">${isAr ? 'اطلع على المرشدين' : 'Browse Mentors'}</button>
    </div>
  `;
};

window.setLibraryFilter = function setLibraryFilter(key) {
  state.libraryFilter = key;
  renderApp();
};

window.markSessionWatched = function markSessionWatched(id) {
  if (!state.watchedSessions) state.watchedSessions = [];
  if (!state.watchedSessions.includes(id)) {
    state.watchedSessions.push(id);
    persistState();
    showToast(
      state.language === 'ar' ? 'تم تسجيل المشاهدة' : 'Session marked as watched',
      '#16a34a'
    );
  }
  renderApp();
};
