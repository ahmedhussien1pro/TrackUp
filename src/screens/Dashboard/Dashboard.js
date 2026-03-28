import { t } from '../../i18n.js';
import State from '../../state.js';
import { TrackService } from '../../services/track.service.js';
import { RoadmapService } from '../../services/roadmap.service.js';
import { CourseService } from '../../services/course.service.js';
import { MentorService } from '../../services/mentor.service.js';
import { TestService } from '../../services/test.service.js';

// ── Next Best Action logic ──────────────────────────────────────────────────
function _nba(user, track, prog, enrollments, result, isAr) {
  // Priority: no test → no track → progress stalled → no courses → no mentor
  if (!result) return {
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`,
    label: isAr ? 'اكتشف مسارك المهني' : 'Discover your career path',
    sub:   isAr ? 'أجب على 7 أسئلة ذكية وسنخبرك بأنسب مسار لك' : 'Answer 7 smart questions and we will find your strongest fit',
    href:  '#/test',
    cta:   isAr ? 'ابدأ التقييم' : 'Start Assessment',
    color: 'var(--color-primary)',
  };
  if (!track) return {
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`,
    label: isAr ? 'اختر مسارك وابدأ خارطة الطريق' : 'Choose your track and start your roadmap',
    sub:   isAr ? 'لديك نتائج جاهزة — الخطوة التالية هي اختيار مسارك' : 'Your results are ready — pick your track to unlock the roadmap',
    href:  '#/results',
    cta:   isAr ? 'عرض النتائج' : 'View Results',
    color: 'var(--color-primary)',
  };
  if (enrollments.length === 0) return {
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>`,
    label: isAr ? 'سجّل في أول دورة على مسارك' : 'Enroll in your first course',
    sub:   isAr ? 'الدورات المختارة لمسارك متاحة — سجّل وابدأ التعلم' : 'Hand-picked courses for your track are ready — enroll and start building',
    href:  '#/courses',
    cta:   isAr ? 'استعرض الدورات' : 'Browse Courses',
    color: '#f59e0b',
  };
  if (MentorService.getBookings().length === 0) return {
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/></svg>`,
    label: isAr ? 'احجز جلسة مع مرشد متخصص' : 'Book a session with an expert mentor',
    sub:   isAr ? 'المرشدون المتاحون لمسارك جاهزون — جلسة واحدة تفتح أبواباً' : 'Track-matched mentors are available — one session changes perspective',
    href:  '#/mentorship',
    cta:   isAr ? 'استعرض المرشدين' : 'Browse Mentors',
    color: '#ec4899',
  };
  return {
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    label: isAr ? 'تابع تقدمك في خارطة الطريق' : 'Continue your roadmap progress',
    sub:   isAr
      ? `أكملت ${prog?.percent || 0}% من مسارك — واصل الزخم`
      : `You are ${prog?.percent || 0}% through your track — keep the momentum`,
    href:  '#/roadmap',
    cta:   isAr ? 'فتح الخارطة' : 'Open Roadmap',
    color: track?.color || 'var(--color-primary)',
  };
}

// ── Smart Insight copy ──────────────────────────────────────────────────────
function _insight(result, track, prog, isAr) {
  if (!result || !track) return null;
  const pct  = result.top3?.[0]?.pct || 0;
  const conf = result.confidence?.level || 'high';
  const gap  = result.confidence?.gap || 0;

  const copies = isAr ? [
    `تُظهر نتائجك توافقاً بنسبة ${pct}% مع مسار ${track.nameAr || track.name} — هذا مؤشر قوي على المسار الصحيح.`,
    `درجة الثقة في توصيتك ${conf === 'high' ? 'عالية' : conf === 'medium' ? 'متوسطة' : 'معقولة'} بفارق ${gap} نقطة عن المسار التالي.`,
    `إجاباتك تكشف نمطاً واضحاً في ${result.strengthSentence?.ar?.split('،')[0] || 'أسلوب تفكيرك'}.`,
  ] : [
    `Your results show a ${pct}% alignment with ${track.name} — a strong signal you are on the right path.`,
    `Confidence in this recommendation is ${conf} with a ${gap}-point gap over the next track.`,
    `Your answer pattern reveals a clear strength in ${result.strengthSentence?.en?.split(',')[0]?.toLowerCase() || 'your thinking style'}.`,
  ];

  return copies[Math.floor(Date.now() / 3600000) % copies.length];
}

export function Dashboard() {
  const user        = State.getState('user') || {};
  const lang        = document.documentElement.getAttribute('lang') || 'en';
  const isAr        = lang === 'ar';
  const firstName   = user.name?.split(' ')[0] || (isAr ? 'مستخدم' : 'there');
  const track       = user.activeTrackId ? TrackService.getTrackById(user.activeTrackId) : null;
  const prog        = track ? RoadmapService.getProgressForTrack(track.id) : null;
  const enrollments = CourseService.getEnrollments();
  const bookings    = MentorService.getBookings();
  const result      = TestService.getResult();
  const allTracks   = TrackService.getAllTracks();

  const nba     = _nba(user, track, prog, enrollments, result, isAr);
  const insight = _insight(result, track, prog, isAr);

  const hour     = new Date().getHours();
  const greeting = isAr
    ? (hour < 12 ? 'صباح الخير' : 'مساء الخير')
    : (hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening');

  // Motivation line based on progress
  const motiveLine = (() => {
    if (!track) return '';
    const p = prog?.percent || 0;
    if (p === 0) return isAr ? 'الرحلة تبدأ بخطوة. الخطوة الأولى أصعبها.' : 'Every expert was once a beginner. Your roadmap is ready.';
    if (p < 30)  return isAr ? 'بداية قوية. حافظ على الزخم.' : 'Strong start. Keep the momentum going.';
    if (p < 70)  return isAr ? 'أكثر من النصف. أنت في المسار الصحيح.' : 'Past the halfway mark. You are on track.';
    return isAr ? 'تقريباً وصلت. لا تتوقف الآن.' : 'Almost there. Do not stop now.';
  })();

  return `
    <div class="dashboard fade-in">

      <!-- Hero -->
      <div class="dashboard-hero">
        <div class="dashboard-hero__text">
          <p class="dashboard-hero__greeting">${greeting},</p>
          <h1 class="dashboard-hero__name">${firstName}</h1>
          ${motiveLine ? `<p class="dashboard-hero__motive">${motiveLine}</p>` : ''}
        </div>
        <!-- Demo mode button -->
        <button class="btn btn--ghost btn--sm demo-mode-btn" id="demo-mode-btn" style="flex-shrink:0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          ${isAr ? 'وضع العرض' : 'Demo Mode'}
        </button>
      </div>

      <!-- NBA card -->
      <div class="db-nba slide-up" style="animation-delay:0.05s;border-color:${nba.color}30;background:${nba.color}08">
        <div class="db-nba__icon" style="color:${nba.color};background:${nba.color}14">${nba.icon}</div>
        <div class="db-nba__body">
          <div class="db-nba__label" style="color:${nba.color}">${isAr ? 'الخطوة التالية' : 'Next Best Action'}</div>
          <div class="db-nba__title">${nba.label}</div>
          <div class="db-nba__sub">${nba.sub}</div>
        </div>
        <a href="${nba.href}" class="btn btn--sm" style="background:${nba.color};color:#fff;border-color:${nba.color};flex-shrink:0">${nba.cta}</a>
      </div>

      <!-- Stats -->
      <div class="dashboard-stats">
        <div class="stat-card slide-up" style="animation-delay:0.08s">
          <div class="stat-card__icon" style="background:#6366f122;color:#6366f1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value">${track ? '1' : '0'}</span>
            <span class="stat-card__label">${isAr ? 'المسار النشط' : 'Active Track'}</span>
          </div>
        </div>
        <div class="stat-card slide-up" style="animation-delay:0.12s">
          <div class="stat-card__icon" style="background:#10b98122;color:#10b981">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value ltr-text">${prog ? prog.percent + '%' : '0%'}</span>
            <span class="stat-card__label">${isAr ? 'التقدم في المسار' : 'Track Progress'}</span>
          </div>
        </div>
        <div class="stat-card slide-up" style="animation-delay:0.16s">
          <div class="stat-card__icon" style="background:#f59e0b22;color:#f59e0b">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value">${enrollments.length}</span>
            <span class="stat-card__label">${isAr ? 'الدورات المسجلة' : 'Courses Enrolled'}</span>
          </div>
        </div>
        <div class="stat-card slide-up" style="animation-delay:0.2s">
          <div class="stat-card__icon" style="background:#ec489922;color:#ec4899">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/></svg>
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value">${bookings.length}</span>
            <span class="stat-card__label">${isAr ? 'جلسات الإرشاد' : 'Mentor Sessions'}</span>
          </div>
        </div>
      </div>

      <!-- Smart Insight -->
      ${insight ? `
        <div class="db-insight slide-up" style="animation-delay:0.22s">
          <div class="db-insight__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>
          </div>
          <p class="db-insight__text">${insight}</p>
          <a href="#/decision-summary" class="db-insight__link">
            ${isAr ? 'عرض ملخص القرار' : 'View Decision Summary'}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>` : ''}

      <!-- Active Track Progress -->
      ${track ? `
        <div class="card dashboard-track-card slide-up" style="animation-delay:0.26s">
          <div class="dashboard-track-card__header">
            <div class="dashboard-track-card__icon" style="background:${track.color}22;color:${track.color}">${track.icon}</div>
            <div style="flex:1;min-width:0">
              <h3 class="dashboard-track-card__name">${isAr ? (track.nameAr || track.name) : track.name}</h3>
              <p class="dashboard-track-card__desc">${isAr ? (track.descriptionAr || track.description) : track.description}</p>
            </div>
            <a href="#/roadmap" class="btn btn--outline btn--sm" style="white-space:nowrap;flex-shrink:0">
              ${isAr ? 'عرض الخارطة' : 'View Roadmap'}
            </a>
          </div>
          <div class="dashboard-track-card__progress">
            <div class="progress-bar">
              <div class="progress-bar__fill"
                   data-pct="${prog?.percent || 0}"
                   style="width:0%;background:${track.color}"></div>
            </div>
            <div class="progress-bar__meta">
              <span class="ltr-text">${prog?.completed || 0} ${isAr ? 'مكتمل' : 'completed'}</span>
              <span class="ltr-text">${prog?.percent || 0}%</span>
            </div>
          </div>
        </div>`
      : `
        <div class="card dashboard-cta-card slide-up" style="animation-delay:0.26s">
          <div class="dashboard-cta-card__icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          </div>
          <h3>${isAr ? 'لم تحدد مسارك بعد' : 'No career track yet'}</h3>
          <p>${isAr ? 'اخضع التقييم وسنخبرك بأنسب مسار لك' : 'Take the smart assessment and we will find your strongest career match'}</p>
          <a href="#/test" class="btn btn--primary">${isAr ? 'ابدأ الآن' : 'Start Now'}</a>
        </div>`
      }

      <!-- Quick nav -->
      <div class="db-quicknav slide-up" style="animation-delay:0.3s">
        ${[
          { icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/></svg>`, label: isAr ? 'خارطة الطريق' : 'Roadmap', href: '#/roadmap', color: '#6366f1' },
          { icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>`, label: isAr ? 'الدورات' : 'Courses', href: '#/courses', color: '#f59e0b' },
          { icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/></svg>`, label: isAr ? 'الإرشاد' : 'Mentorship', href: '#/mentorship', color: '#ec4899' },
          { icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`, label: isAr ? 'التقدم' : 'Progress', href: '#/progress', color: '#10b981' },
        ].map(item => `
          <a href="${item.href}" class="db-quicknav__item">
            <span class="db-quicknav__icon" style="color:${item.color};background:${item.color}14">${item.icon}</span>
            <span class="db-quicknav__label">${item.label}</span>
          </a>`).join('')}
      </div>

      <!-- Explore Tracks -->
      <div class="dashboard-section slide-up" style="animation-delay:0.34s">
        <div class="section-header">
          <h2 class="section-header__title">${isAr ? 'استكشف المسارات' : 'Explore Tracks'}</h2>
          <a href="#/career" class="section-header__link">${isAr ? 'عرض الكل' : 'View all'}</a>
        </div>
        <div class="tracks-grid">
          ${allTracks.map((tr, i) => `
            <div class="track-card slide-up" style="animation-delay:${0.38 + i * 0.05}s">
              <div class="track-card__top">
                <div class="track-card__icon" style="background:${tr.color}22;color:${tr.color}">${tr.icon}</div>
                ${track?.id === tr.id ? `<span class="badge badge--active">${isAr ? 'نشط' : 'Active'}</span>` : ''}
              </div>
              <div class="track-card__name">${isAr ? (tr.nameAr || tr.name) : tr.name}</div>
              <div class="track-card__desc">${isAr ? (tr.descriptionAr || tr.description) : tr.description}</div>
              <div class="track-card__footer">
                <span class="badge">${tr.level}</span>
                <span class="badge ltr-text">${isAr ? (tr.durationAr || tr.duration) : tr.duration}</span>
              </div>
              <a href="#/career" class="track-card__cta">${isAr ? 'تفاصيل' : 'Details'}</a>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

export function DashboardEvents() {
  // Animate progress bars
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('.progress-bar__fill[data-pct]').forEach(el => {
        el.style.transition = 'width 0.7s cubic-bezier(0.4,0,0.2,1)';
        el.style.width = el.dataset.pct + '%';
      });
    });
  });

  // Demo Mode — injects a complete user state for presentations
  document.getElementById('demo-mode-btn')?.addEventListener('click', () => {
    import('../../services/track.service.js').then(({ TrackService: TS }) => {
      import('../../services/storage.service.js').then(({ StorageService }) => {
        import('../../state.js').then(({ default: S }) => {
          // Inject demo test result
          const demoResult = {
            topTrackId: 'frontend',
            top3: [
              { id: 'frontend', score: 30, pct: 100 },
              { id: 'ux',       score: 22, pct: 73 },
              { id: 'backend',  score: 16, pct: 53 },
            ],
            scores: { frontend: 30, ux: 22, backend: 16, data: 10, devops: 8 },
            percentages: { frontend: 100, ux: 73, backend: 53, data: 33, devops: 27 },
            confidence: { level: 'high', gap: 27 },
            dimensions: { visual: 86, creative: 79, empathetic: 57, analytical: 43, logical: 36, systematic: 21 },
            strengthSentence: {
              en: 'You think in visuals, care about output, and love building things people interact with.',
              ar: 'تفكّر بصرياً، تهتم بالمخرجات، وتحب بناء ما يتفاعل معه الناس.',
            },
            recommendedTrack: TS.getTrackById('frontend'),
            completedAt: Date.now(),
          };
          S.setState('testResult', demoResult);
          StorageService.set('testResult', demoResult);

          // Enroll in frontend track
          TS.enrollInTrack('frontend');

          // Enroll in 2 courses
          const demoEnrollments = [
            { courseId: 'c-fe-1', progress: 100, status: 'completed', enrolledAt: Date.now() - 86400000 },
            { courseId: 'c-fe-2', progress: 42,  status: 'active',    enrolledAt: Date.now() },
          ];
          S.setState('enrollments', demoEnrollments);
          StorageService.set('enrollments', demoEnrollments);

          // Book a mentor
          const demoBookings = [{ mentorId: 'm1', mentorName: 'Sarah El-Rashidy', bookedAt: Date.now(), status: 'confirmed' }];
          S.setState('bookings', demoBookings);
          StorageService.set('bookings', demoBookings);

          Toastify({
            text: document.documentElement.getAttribute('lang') === 'ar'
              ? 'تم تفعيل وضع العرض'
              : 'Demo mode activated',
            duration: 2000,
            gravity: 'bottom',
            position: 'right',
            style: { background: 'var(--color-primary)' },
          }).showToast();

          // Re-render dashboard
          setTimeout(() => {
            import('../../router.js').then(({ Router }) => Router.navigate('/dashboard'));
          }, 600);
        });
      });
    });
  });
}
