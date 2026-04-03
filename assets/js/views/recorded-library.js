window.renderRecordedLibraryView = function renderRecordedLibraryView() {
  const isAr = state.language === 'ar';

  if (!state.premiumUnlocked) {
    return `
      <div class="surface-panel section-pad" style="text-align:center;max-width:520px;margin:0 auto;" data-aos="fade-up">
        <div style="width:3.5rem;height:3.5rem;border-radius:14px;background:var(--accent-soft);border:1px solid rgba(37,99,235,.2);display:flex;align-items:center;justify-content:center;margin:0 auto 1.1rem;">
          <i data-lucide="lock" style="width:1.4rem;height:1.4rem;color:var(--accent);"></i>
        </div>
        <div style="font-weight:800;font-size:1.1rem;margin-bottom:.5rem;">
          ${isAr ? 'مكتبة الجلسات لأعضاء Premium' : 'Library is for Premium Members'}
        </div>
        <p class="text-muted" style="font-size:.9rem;line-height:1.7;margin-bottom:1.2rem;">
          ${isAr
            ? 'فعّل Premium للوصول إلى جلسات خبراء مسجّلة لكل تخصص.'
            : 'Upgrade to Premium to access expert recorded sessions for every engineering specialization.'}
        </p>
        <button class="btn btn-primary" onclick="openPremiumLock('recorded-library')">
          <i data-lucide="crown" style="width:.85rem;height:.85rem;"></i>
          ${isAr ? 'افتح Premium' : 'Unlock Premium'}
        </button>
      </div>
    `;
  }

  const sessions = [
    { id:'rl-1', trackKey:'power',          titleEn:'Power Systems Fundamentals — What Every Graduate Must Know', titleAr:'أساسيات أنظمة القوى — ما يجب على كل خريج معرفته', mentorEn:'Dr. Ahmed Kamal', mentorAr:'د. أحمد كمال', durationMin:58, labelEn:'Power',  labelAr:'قوى',      color:'#2563eb', avatar:'AK', views:1240, isNew:false },
    { id:'rl-2', trackKey:'embedded',       titleEn:'Embedded Systems Roadmap — From Arduino to RTOS',             titleAr:'مسار الأنظمة المدمجة — من Arduino إلى RTOS',       mentorEn:'Dr. Ahmed Kamal', mentorAr:'د. أحمد كمال', durationMin:64, labelEn:'Embedded',labelAr:'مدمج',    color:'#7c3aed', avatar:'AK', views:2180, isNew:true  },
    { id:'rl-3', trackKey:'communications', titleEn:'Communications Engineering — 5G, RF & Career Paths',          titleAr:'هندسة الاتصالات — 5G وRF والمسارات المهنية',         mentorEn:'Dr. Ahmed Kamal', mentorAr:'د. أحمد كمال', durationMin:52, labelEn:'Comms',   labelAr:'اتصالات', color:'#059669', avatar:'AK', views:980,  isNew:false },
    { id:'rl-4', trackKey:'power',          titleEn:'How to Land Your First Job in Power Engineering',              titleAr:'كيف تحصل على أول وظيفة في هندسة القوى',                mentorEn:'Eng. Tarek Salah', mentorAr:'م. طارق صلاح', durationMin:47, labelEn:'Career',  labelAr:'مسار مهني', color:'#e11d48', avatar:'TS', views:3100, isNew:false },
    { id:'rl-5', trackKey:'embedded',       titleEn:'Firmware vs Software — Which Path Fits You?',                titleAr:'Firmware أم Software — أيهما يناسبك؟',                        mentorEn:'Eng. Tarek Salah', mentorAr:'م. طارق صلاح', durationMin:41, labelEn:'Career',  labelAr:'مسار مهني', color:'#e11d48', avatar:'TS', views:1870, isNew:true  },
    { id:'rl-6', trackKey:'communications', titleEn:'RF Engineering Deep Dive — Tools, Skills & Market',           titleAr:'RF Engineering بعمق — الأدوات والمهارات والسوق',            mentorEn:'Dr. Ahmed Kamal', mentorAr:'د. أحمد كمال', durationMin:55, labelEn:'Comms',   labelAr:'اتصالات', color:'#059669', avatar:'AK', views:760,  isNew:false },
  ];

  const filterKey = state.libraryFilter || 'all';
  const filters = [
    { key:'all',            labelEn:'All Sessions', labelAr:'كل الجلسات' },
    { key:'power',          labelEn:'Power',        labelAr:'قوى' },
    { key:'embedded',       labelEn:'Embedded',     labelAr:'مدمج' },
    { key:'communications', labelEn:'Comms',        labelAr:'اتصالات' },
  ];

  const filtered = filterKey === 'all' ? sessions : sessions.filter(s => s.trackKey === filterKey);
  const watched  = state.watchedSessions || [];

  const cards = filtered.map((s, idx) => {
    const isWatched = watched.includes(s.id);
    return `
      <div class="surface-panel" style="overflow:hidden;display:flex;flex-direction:column;" data-aos="fade-up" data-aos-delay="${idx * 50}">

        <!-- Thumbnail -->
        <div style="
          position:relative;
          background:linear-gradient(135deg,#0f172a 60%,${s.color}22 100%);
          border-bottom:3px solid ${s.color};
          padding:1.4rem 1.25rem;
          min-height:120px;
          display:flex;
          flex-direction:column;
          justify-content:space-between;
        ">
          <!-- Top row: track badge + new badge -->
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <span style="background:${s.color};color:#fff;font-size:.68rem;font-weight:700;padding:.18rem .6rem;border-radius:6px;">${isAr ? s.labelAr : s.labelEn}</span>
            <div style="display:flex;gap:.4rem;">
              ${s.isNew ? `<span style="background:#f59e0b;color:#0f172a;font-size:.65rem;font-weight:800;padding:.18rem .55rem;border-radius:6px;">NEW</span>` : ''}
              ${isWatched ? `<span style="background:#16a34a;color:#fff;font-size:.65rem;font-weight:700;padding:.18rem .55rem;border-radius:6px;display:flex;align-items:center;gap:.25rem;"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>${isAr ? 'شاهدته' : 'Watched'}</span>` : ''}
            </div>
          </div>
          <!-- Bottom row: avatar + duration -->
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:1rem;">
            <div style="display:flex;align-items:center;gap:.55rem;">
              <div style="width:2.2rem;height:2.2rem;border-radius:50%;background:${s.color};display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;font-size:.78rem;">${s.avatar}</div>
              <span style="font-size:.78rem;font-weight:600;color:rgba(255,255,255,.85);">${isAr ? s.mentorAr : s.mentorEn}</span>
            </div>
            <span style="font-size:.72rem;font-weight:700;color:rgba(255,255,255,.65);background:rgba(255,255,255,.08);padding:.18rem .55rem;border-radius:6px;">${s.durationMin} ${isAr ? 'د' : 'min'}</span>
          </div>
        </div>

        <!-- Body -->
        <div class="section-pad" style="flex:1;display:flex;flex-direction:column;gap:.5rem;">
          <div style="font-weight:700;font-size:.93rem;line-height:1.55;">${isAr ? s.titleAr : s.titleEn}</div>
          <div class="text-muted" style="font-size:.79rem;display:flex;align-items:center;gap:.35rem;">
            <i data-lucide="eye" style="width:.7rem;height:.7rem;"></i>
            ${s.views.toLocaleString()} ${isAr ? 'مشاهدة' : 'views'}
          </div>
          <button
            class="btn ${isWatched ? 'btn-secondary' : 'btn-primary'}"
            style="margin-top:auto;width:100%;"
            onclick="markSessionWatched('${s.id}')">
            <i data-lucide="${isWatched ? 'rotate-ccw' : 'play'}" style="width:.85rem;height:.85rem;"></i>
            ${isWatched
              ? (isAr ? 'شاهد مرة أخرى' : 'Watch Again')
              : (isAr ? 'شاهد الآن' : 'Watch Now')}
          </button>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="page-header" data-aos="fade-up">
      <div>
        <div class="eyebrow">${isAr ? 'مكتبة الجلسات' : 'Recorded Library'}</div>
        <h2 class="section-title" style="margin-top:.4rem;">${isAr ? 'جلسات خبراء مسجّلة' : 'Expert Sessions On Demand'}</h2>
        <p class="text-muted" style="font-size:.88rem;margin-top:.4rem;max-width:580px;line-height:1.7;">
          ${isAr
            ? 'جلسات حقيقية من مرشدين خبراء — شاهد بالسرعة التي تناسبك وابدأ مسارك بثقة.'
            : 'Real sessions from expert mentors. Watch at your own pace and start your track with confidence.'}
        </p>
      </div>
    </div>

    <!-- Filter tabs -->
    <div style="display:flex;gap:.45rem;flex-wrap:wrap;margin-bottom:1.25rem;" data-aos="fade-up">
      ${filters.map(f => `
        <button
          class="btn ${filterKey === f.key ? 'btn-primary' : 'btn-secondary'}"
          style="font-size:.82rem;padding:.35rem .9rem;"
          onclick="setLibraryFilter('${f.key}')">
          ${isAr ? f.labelAr : f.labelEn}
        </button>
      `).join('')}
      <span style="margin-${isAr ? 'right' : 'left'}:auto;font-size:.8rem;color:var(--text-muted);align-self:center;">
        ${filtered.length} ${isAr ? 'جلسة' : 'sessions'}
      </span>
    </div>

    <!-- Cards grid: 2-col on desktop -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.1rem;">
      ${cards || `<p class="text-muted" style="grid-column:1/-1;text-align:center;padding:2.5rem 0;">${isAr ? 'لا توجد جلسات في هذا التصنيف.' : 'No sessions in this category yet.'}</p>`}
    </div>

    <!-- Live session CTA -->
    <div class="surface-soft section-pad" style="margin-top:1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;border:1px solid var(--border);" data-aos="fade-up">
      <div style="display:flex;gap:.75rem;align-items:center;">
        <div style="width:2.4rem;height:2.4rem;border-radius:10px;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i data-lucide="video" style="width:1rem;height:1rem;color:var(--accent);"></i>
        </div>
        <div>
          <div style="font-weight:700;font-size:.93rem;">${isAr ? 'تريد جلسة مباشرة مع مرشد؟' : 'Want a live 1-on-1 session?'}</div>
          <p class="text-muted" style="font-size:.82rem;margin-top:.15rem;">${isAr ? 'احجز جلسة 60 دقيقة مع مرشد وافهم مسارك بعمق.' : 'Book a 60-min session with an expert mentor.'}</p>
        </div>
      </div>
      <button class="btn btn-primary" onclick="navigateTo('mentors')">${isAr ? 'اطلع على المرشدين' : 'Browse Mentors'}</button>
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
      state.language === 'ar' ? 'تم حفظ المشاهدة' : 'Session marked as watched',
      '#16a34a'
    );
  }
  renderMainOnly();
};
