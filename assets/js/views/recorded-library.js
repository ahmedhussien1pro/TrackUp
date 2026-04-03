// recorded-library.js — Professional card grid with thumbnail, duration, locked overlay
window.renderRecordedLibraryView = function renderRecordedLibraryView() {
  const isAr    = state.language === 'ar';
  const isPro   = state.premiumUnlocked;

  const CATEGORIES = [
    { id: 'all',        labelEn: 'All',        labelAr: 'الكل' },
    { id: 'electrical', labelEn: 'Electrical', labelAr: 'كهرباء' },
    { id: 'software',   labelEn: 'Software',   labelAr: 'برمجيات' },
    { id: 'mechanical', labelEn: 'Mechanical', labelAr: 'ميكانيكا' },
    { id: 'civil',      labelEn: 'Civil',      labelAr: 'مدني' },
  ];

  const LIBRARY = [
    { id: 'rl1', category: 'electrical', titleEn: 'Embedded Systems Kickstart',       titleAr: 'بداية الأنظمة المدمجة',       mentorEn: 'Dr. Mohamed Saber',   mentorAr: 'د. محمد صابر',   duration: '58 min', color: '#2563eb', initials: 'MS', views: 312, isPro: false },
    { id: 'rl2', category: 'electrical', titleEn: 'Power Systems Fundamentals',       titleAr: 'أساسيات أنظمة الطاقة',       mentorEn: 'Eng. Sara Nabil',     mentorAr: 'م. سارة نبيل',       duration: '45 min', color: '#7c3aed', initials: 'SN', views: 189, isPro: true },
    { id: 'rl3', category: 'software',   titleEn: 'Frontend Track Deep Dive',        titleAr: 'غوص في مسار الفرنت إند',         mentorEn: 'Eng. Ali Hassan',     mentorAr: 'م. علي حسن',         duration: '72 min', color: '#16a34a', initials: 'AH', views: 445, isPro: false },
    { id: 'rl4', category: 'software',   titleEn: 'Backend & APIs Masterclass',      titleAr: 'ماستركلاس الباك إند و APIs',  mentorEn: 'Eng. Rania Mostafa',  mentorAr: 'م. رانيا مصطفى',    duration: '65 min', color: '#ea580c', initials: 'RM', views: 278, isPro: true },
    { id: 'rl5', category: 'software',   titleEn: 'Cybersecurity Essentials',        titleAr: 'أساسيات الأمن السيبراني',    mentorEn: 'Dr. Khaled Youssef',  mentorAr: 'د. خالد يوسف',      duration: '80 min', color: '#0284c7', initials: 'KY', views: 521, isPro: true },
    { id: 'rl6', category: 'mechanical', titleEn: 'Mechanical Design with SolidWorks',titleAr:'التصميم الميكانيكي بـ SolidWorks', mentorEn: 'Eng. Yara Khalil',    mentorAr: 'م. يارا خليل',       duration: '54 min', color: '#9333ea', initials: 'YK', views: 134, isPro: true },
    { id: 'rl7', category: 'civil',      titleEn: 'Structural Analysis Intro',       titleAr: 'مقدمة في التحليل الإنشائي',    mentorEn: 'Dr. Omar Farouk',     mentorAr: 'د. عمر فاروق',      duration: '49 min', color: '#d97706', initials: 'OF', views: 97,  isPro: false },
    { id: 'rl8', category: 'electrical', titleEn: 'How to Land Your First Job',      titleAr: 'كيف تحصل على أول وظيفة',       mentorEn: 'Dr. Mohamed Saber',   mentorAr: 'د. محمد صابر',   duration: '38 min', color: '#2563eb', initials: 'MS', views: 683, isPro: false },
  ];

  const activeCat = state._libCat || 'all';
  const filtered  = activeCat === 'all' ? LIBRARY : LIBRARY.filter(v => v.category === activeCat);

  window._setLibCat = function(cat) {
    state._libCat = cat;
    renderMainOnly();
  };

  const categoryTabs = CATEGORIES.map(c => `
    <button
      class="filter-chip ${activeCat === c.id ? 'filter-chip--active' : ''}"
      onclick="_setLibCat('${c.id}')">
      ${isAr ? c.labelAr : c.labelEn}
    </button>
  `).join('');

  function renderCard(v) {
    const locked = v.isPro && !isPro;
    const title  = isAr ? v.titleAr : v.titleEn;
    const mentor = isAr ? v.mentorAr : v.mentorEn;

    return `
      <div class="surface-panel"
        style="border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--border);display:flex;flex-direction:column;transition:box-shadow .2s;position:relative;"
        data-aos="fade-up">

        <!-- Thumbnail -->
        <div style="position:relative;aspect-ratio:16/9;background:${v.color}18;display:flex;align-items:center;justify-content:center;overflow:hidden;">
          <!-- Gradient bg from mentor color -->
          <div style="position:absolute;inset:0;background:radial-gradient(circle at 30% 40%,${v.color}28 0%,transparent 70%);"></div>
          <!-- Mentor avatar large -->
          <div style="width:3.5rem;height:3.5rem;border-radius:50%;background:${v.color}22;border:2px solid ${v.color}55;color:${v.color};display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1.1rem;z-index:1;">${v.initials}</div>
          <!-- Duration badge -->
          <span style="position:absolute;bottom:.5rem;${isAr?'right':'left'}:.5rem;background:rgba(0,0,0,.55);color:#fff;font-size:.7rem;font-weight:700;padding:.18rem .55rem;border-radius:99px;backdrop-filter:blur(4px);">
            <i data-lucide="clock" style="width:.65rem;height:.65rem;vertical-align:-.08em;"></i>
            ${v.duration}
          </span>
          <!-- Views -->
          <span style="position:absolute;bottom:.5rem;${isAr?'left':'right'}:.5rem;background:rgba(0,0,0,.45);color:#fff;font-size:.7rem;padding:.18rem .55rem;border-radius:99px;backdrop-filter:blur(4px);">
            ${v.views} ${isAr?'مشاهدة':'views'}
          </span>
          <!-- Locked overlay -->
          ${locked ? `
            <div style="position:absolute;inset:0;background:rgba(0,0,0,.55);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.4rem;backdrop-filter:blur(2px);z-index:2;">
              <i data-lucide="lock" style="width:1.4rem;height:1.4rem;color:#fff;"></i>
              <span style="font-size:.72rem;font-weight:700;color:#fff;">PRO</span>
            </div>
          ` : ''}
        </div>

        <!-- Card body -->
        <div style="padding:.85rem 1rem 1rem;flex:1;display:flex;flex-direction:column;gap:.4rem;">
          <div style="font-weight:700;font-size:.92rem;line-height:1.4;">${title}</div>
          <div style="display:flex;align-items:center;gap:.4rem;">
            <div style="width:1.5rem;height:1.5rem;border-radius:50%;background:${v.color}22;border:1.5px solid ${v.color}44;color:${v.color};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.6rem;flex-shrink:0;">${v.initials}</div>
            <span style="font-size:.78rem;color:var(--text-muted);">${mentor}</span>
          </div>
          <div style="margin-top:auto;padding-top:.6rem;">
            <button
              class="btn ${locked ? 'btn-secondary' : 'btn-primary'}"
              style="width:100%;font-size:.82rem;"
              onclick="${locked ? `openPremiumLock('recorded-library')` : `showToast('${isAr ? 'جاري تشغيل الجلسة…' : 'Loading session…'}','var(--accent)')` }">
              <i data-lucide="${locked ? 'lock' : 'play-circle'}" style="width:.85rem;height:.85rem;"></i>
              ${locked ? (isAr ? 'فتح مع Premium' : 'Unlock with PRO') : (isAr ? 'شاهد الآن' : 'Watch Now')}
            </button>
          </div>
        </div>

      </div>
    `;
  }

  return `
    <div class="page-header" data-aos="fade-up">
      <div>
        <div class="eyebrow">${isAr ? 'مكتبة الجلسات المسجَّلة' : 'Recorded Sessions'}</div>
        <h2 class="section-title" style="margin-top:.5rem;">${isAr ? 'تعلَّم في أي وقت' : 'Learn on Your Own Time'}</h2>
        <p class="text-muted" style="margin-top:.5rem;line-height:1.8;">
          ${isAr
            ? 'جلسات مسجَّلة مع خبراء في مختلف المسارات — شاهدها متى ما أردت.'
            : 'Recorded sessions with experts across all tracks — watch whenever you want.'}
        </p>
      </div>
      ${!isPro ? `
        <button class="btn btn-primary" onclick="navigateTo('pricing')">
          <i data-lucide="crown" style="width:.9rem;height:.9rem;"></i>
          ${isAr ? 'فتح المكتبة كاملة' : 'Unlock Full Library'}
        </button>
      ` : ''}
    </div>

    <!-- Category filter -->
    <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.75rem;margin-bottom:1.25rem;">
      ${categoryTabs}
    </div>

    <!-- Cards grid -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(280px,100%),1fr));gap:1.25rem;">
      ${filtered.length ? filtered.map(renderCard).join('') : `
        <div class="empty-state" style="grid-column:1/-1;">
          <i data-lucide="video-off" style="width:2.5rem;height:2.5rem;color:var(--text-faint);"></i>
          <p style="margin-top:.75rem;color:var(--text-muted);">${isAr ? 'لا توجد جلسات في هذا التصنيف حتى الآن.' : 'No sessions in this category yet.'}</p>
        </div>
      `}
    </div>
  `;
};
