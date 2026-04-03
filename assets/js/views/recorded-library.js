window.renderRecordedLibraryView = function renderRecordedLibraryView() {
  const isAr = state.language === 'ar';

  /* ── Premium gate ── */
  if (!state.premiumUnlocked) {
    return `
      <div style="max-width:480px;margin:4rem auto;text-align:center;" data-aos="fade-up">
        <div style="width:3.5rem;height:3.5rem;border-radius:16px;background:var(--accent-soft);border:1px solid rgba(37,99,235,.2);display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem;">
          <i data-lucide="lock" style="width:1.4rem;height:1.4rem;color:var(--accent);"></i>
        </div>
        <div style="font-weight:800;font-size:1.15rem;margin-bottom:.5rem;">${isAr ? 'مكتبة الجلسات للأعضاء المدفوعين' : 'Library is for Premium Members'}</div>
        <p class="text-muted" style="font-size:.88rem;line-height:1.75;margin-bottom:1.5rem;">
          ${isAr
            ? 'فعّل Premium للوصول إلى جلسات خبراء مسجّلة في كل تخصص.'
            : 'Upgrade to Premium to access recorded expert sessions for every engineering specialization.'}
        </p>
        <button class="btn btn-primary" onclick="openPremiumLock('recorded-library')">
          <i data-lucide="crown" style="width:.85rem;height:.85rem;"></i>
          ${isAr ? 'فعّل Premium' : 'Upgrade to Premium'}
        </button>
      </div>
    `;
  }

  const sessions = [
    {
      id: 'rl-1', trackKey: 'power', isNew: false,
      titleEn: 'Power Systems Fundamentals — What Every Graduate Must Know',
      titleAr: 'أساسيات أنظمة القوى — ما يجب على كل خريج معرفته',
      mentorEn: 'Dr. Ahmed Kamal', mentorAr: 'د. أحمد كمال',
      durationMin: 58, labelEn: 'Power', labelAr: 'قوى',
      color: '#2563eb', avatar: 'AK', views: 1240, watchedPct: 0
    },
    {
      id: 'rl-2', trackKey: 'embedded', isNew: false,
      titleEn: 'Embedded Systems Roadmap — From Arduino to RTOS',
      titleAr: 'خارطة طريق الأنظمة المدمجة — من Arduino إلى RTOS',
      mentorEn: 'Dr. Ahmed Kamal', mentorAr: 'د. أحمد كمال',
      durationMin: 64, labelEn: 'Embedded', labelAr: 'مدمج',
      color: '#7c3aed', avatar: 'AK', views: 2180, watchedPct: 0
    },
    {
      id: 'rl-3', trackKey: 'communications', isNew: true,
      titleEn: 'Communications Engineering — 5G, RF & Career Paths',
      titleAr: 'هندسة الاتصالات — 5G وRF والمسارات الوظيفية',
      mentorEn: 'Dr. Ahmed Kamal', mentorAr: 'د. أحمد كمال',
      durationMin: 52, labelEn: 'Comms', labelAr: 'اتصالات',
      color: '#059669', avatar: 'AK', views: 980, watchedPct: 0
    },
    {
      id: 'rl-4', trackKey: 'power', isNew: false,
      titleEn: 'How to Land Your First Job in Power Engineering',
      titleAr: 'كيف تحصل على أول وظيفة في هندسة القوى',
      mentorEn: 'Eng. Tarek Salah', mentorAr: 'م. طارق صلاح',
      durationMin: 47, labelEn: 'Career', labelAr: 'مسار مهني',
      color: '#e11d48', avatar: 'TS', views: 3100, watchedPct: 0
    },
    {
      id: 'rl-5', trackKey: 'embedded', isNew: true,
      titleEn: 'Firmware vs Software — Which Path Fits You?',
      titleAr: 'Firmware أم Software — أيهما يناسبك؟',
      mentorEn: 'Eng. Tarek Salah', mentorAr: 'م. طارق صلاح',
      durationMin: 41, labelEn: 'Career', labelAr: 'مسار مهني',
      color: '#e11d48', avatar: 'TS', views: 1870, watchedPct: 0
    },
    {
      id: 'rl-6', trackKey: 'communications', isNew: false,
      titleEn: 'RF Engineering Deep Dive — Tools, Skills & Market',
      titleAr: 'RF Engineering بعمق — الأدوات والمهارات والسوق',
      mentorEn: 'Dr. Ahmed Kamal', mentorAr: 'د. أحمد كمال',
      durationMin: 55, labelEn: 'Comms', labelAr: 'اتصالات',
      color: '#059669', avatar: 'AK', views: 760, watchedPct: 0
    }
  ];

  const filter  = state.libraryFilter || 'all';
  const watched = state.watchedSessions || [];
  const filters = [
    { key: 'all',            labelEn: 'All Sessions', labelAr: 'كل الجلسات' },
    { key: 'power',          labelEn: 'Power',        labelAr: 'قوى' },
    { key: 'embedded',       labelEn: 'Embedded',     labelAr: 'مدمج' },
    { key: 'communications', labelEn: 'Comms',        labelAr: 'اتصالات' }
  ];

  const filtered = filter === 'all' ? sessions : sessions.filter(s => s.trackKey === filter);

  const cards = filtered.map((s, idx) => {
    const isWatched = watched.includes(s.id);
    const pct       = isWatched ? 100 : s.watchedPct;

    return `
      <div class="surface-panel" style="overflow:hidden;display:flex;flex-direction:column;" data-aos="fade-up" data-aos-delay="${idx * 55}">

        <!-- Thumbnail -->
        <div style="position:relative;background:linear-gradient(145deg,#0f172a 0%,#1e293b 100%);border-bottom:3px solid ${s.color};min-height:130px;display:flex;align-items:center;justify-content:center;">

          <!-- center avatar + play ring -->
          <div style="position:relative;">
            <div style="width:3.5rem;height:3.5rem;border-radius:50%;background:${s.color};display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;font-size:1rem;box-shadow:0 0 0 6px ${s.color}22;">${s.avatar}</div>
            <div style="position:absolute;inset:-6px;border-radius:50%;border:1.5px solid ${s.color}44;"></div>
          </div>

          <!-- play overlay on hover (static indicator) -->
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;" class="thumb-hover">
            <div style="width:2.8rem;height:2.8rem;border-radius:50%;background:rgba(255,255,255,.15);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;">
              <i data-lucide="play" style="width:1rem;height:1rem;color:#fff;"></i>
            </div>
          </div>

          <!-- duration badge -->
          <div style="position:absolute;bottom:.55rem;${isAr?'right':'left'}:.65rem;background:rgba(0,0,0,.65);backdrop-filter:blur(4px);border-radius:6px;padding:.2rem .55rem;font-size:.72rem;font-weight:700;color:#fff;display:flex;align-items:center;gap:.3rem;">
            <i data-lucide="clock" style="width:.65rem;height:.65rem;"></i>
            ${s.durationMin} ${isAr ? 'دق' : 'min'}
          </div>

          <!-- track label -->
          <div style="position:absolute;top:.55rem;${isAr?'right':'left'}:.65rem;">
            <span style="background:${s.color};color:#fff;font-size:.67rem;font-weight:700;padding:.2rem .6rem;border-radius:99px;">
              ${isAr ? s.labelAr : s.labelEn}
            </span>
          </div>

          <!-- new badge -->
          ${s.isNew ? `
            <div style="position:absolute;top:.55rem;${isAr?'left':'right'}:.65rem;">
              <span style="background:#f59e0b;color:#000;font-size:.65rem;font-weight:800;padding:.2rem .55rem;border-radius:99px;">NEW</span>
            </div>
          ` : ''}

          <!-- watched badge -->
          ${isWatched ? `
            <div style="position:absolute;top:.55rem;${isAr?'left':'right'}:.65rem;background:#16a34a;border-radius:6px;padding:.2rem .55rem;font-size:.68rem;font-weight:700;color:#fff;display:flex;align-items:center;gap:.3rem;">
              <i data-lucide="check" style="width:.65rem;height:.65rem;"></i>${isAr?'شاهدت':'Watched'}
            </div>
          ` : ''}
        </div>

        <!-- progress bar -->
        ${pct > 0 ? `
          <div style="height:3px;background:var(--border);">
            <div style="height:100%;width:${pct}%;background:${s.color};transition:width .4s;"></div>
          </div>
        ` : ''}

        <!-- Body -->
        <div class="section-pad" style="flex:1;display:flex;flex-direction:column;gap:.55rem;">
          <div style="font-weight:700;font-size:.9rem;line-height:1.5;">${isAr ? s.titleAr : s.titleEn}</div>

          <div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;">
            <div class="text-muted" style="font-size:.78rem;display:flex;align-items:center;gap:.35rem;">
              <i data-lucide="user" style="width:.7rem;height:.7rem;"></i>
              ${isAr ? s.mentorAr : s.mentorEn}
            </div>
            <span style="color:var(--border-strong);">·</span>
            <div class="text-muted" style="font-size:.78rem;display:flex;align-items:center;gap:.35rem;">
              <i data-lucide="eye" style="width:.7rem;height:.7rem;"></i>
              ${s.views.toLocaleString()}
            </div>
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

  const statsBar = `
    <div style="display:flex;gap:1.5rem;flex-wrap:wrap;margin-bottom:1.25rem;" data-aos="fade-up">
      <div style="display:flex;align-items:center;gap:.4rem;font-size:.82rem;color:var(--text-muted);">
        <i data-lucide="video" style="width:.8rem;height:.8rem;color:var(--accent);"></i>
        ${sessions.length} ${isAr ? 'جلسة' : 'sessions'}
      </div>
      <div style="display:flex;align-items:center;gap:.4rem;font-size:.82rem;color:var(--text-muted);">
        <i data-lucide="check-circle" style="width:.8rem;height:.8rem;color:#16a34a;"></i>
        ${watched.length} ${isAr ? 'شاهدتها' : 'watched'}
      </div>
      <div style="display:flex;align-items:center;gap:.4rem;font-size:.82rem;color:var(--text-muted);">
        <i data-lucide="clock" style="width:.8rem;height:.8rem;"></i>
        ${sessions.reduce((a,s) => a + s.durationMin, 0)} ${isAr ? 'دقيقة محتوى' : 'min of content'}
      </div>
    </div>
  `;

  return `
    <div class="page-header" data-aos="fade-up">
      <div>
        <div class="eyebrow">${isAr ? 'مكتبة الجلسات' : 'Recorded Library'}</div>
        <h2 class="section-title" style="margin-top:.4rem;">${isAr ? 'جلسات خبراء مسجّلة' : 'Expert Sessions On Demand'}</h2>
        <p class="text-muted" style="font-size:.86rem;margin-top:.4rem;max-width:560px;">
          ${isAr
            ? 'جلسات حقيقية من مرشدين خبراء — شاهد بالوتيرة التي تناسبك.'
            : 'Real sessions from expert mentors. Watch at your own pace and start your track with confidence.'}
        </p>
      </div>
    </div>

    ${statsBar}

    <!-- filter tabs -->
    <div style="display:flex;gap:.45rem;flex-wrap:wrap;margin-bottom:1.25rem;" data-aos="fade-up">
      ${filters.map(f => `
        <button
          class="btn ${filter === f.key ? 'btn-primary' : 'btn-secondary'}"
          style="font-size:.8rem;padding:.35rem .9rem;"
          onclick="setLibraryFilter('${f.key}')">
          ${isAr ? f.labelAr : f.labelEn}
        </button>
      `).join('')}
    </div>

    <!-- cards 2-col grid -->
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;">
      ${cards || `<p class="text-muted" style="grid-column:1/-1;text-align:center;padding:3rem 0;">${isAr ? 'لا توجد جلسات في هذا التصنيف.' : 'No sessions in this category yet.'}</p>`}
    </div>

    <!-- live session CTA -->
    <div class="surface-soft section-pad" style="margin-top:1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;" data-aos="fade-up">
      <div>
        <div style="font-weight:700;font-size:.93rem;">${isAr ? 'عاوز جلسة مباشرة؟' : 'Want a Live Session?'}</div>
        <p class="text-muted" style="font-size:.82rem;margin-top:.2rem;">${isAr ? 'احجز 60 دقيقة مع مرشد وافهم مسارك بعمق.' : 'Book a 60-min 1-on-1 with a mentor and go deeper.'}</p>
      </div>
      <button class="btn btn-primary" onclick="navigateTo('mentors')">
        <i data-lucide="users-round" style="width:.85rem;height:.85rem;"></i>
        ${isAr ? 'اطلع على المرشدين' : 'Browse Mentors'}
      </button>
    </div>
  `;
};

window.setLibraryFilter = function setLibraryFilter(key) {
  state.libraryFilter = key;
  renderMainOnly();
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
  renderMainOnly();
};
