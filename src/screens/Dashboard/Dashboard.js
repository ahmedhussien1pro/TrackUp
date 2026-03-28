import { t } from '../../i18n.js';
import State from '../../state.js';
import { TrackService } from '../../services/track.service.js';
import { RoadmapService } from '../../services/roadmap.service.js';
import { CourseService } from '../../services/course.service.js';
import { MentorService } from '../../services/mentor.service.js';
import { TestService } from '../../services/test.service.js';
import { StorageService } from '../../services/storage.service.js';
import { Router } from '../../router.js';

function _nba(user, track, prog, enrollments, result, isAr) {
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
  const firstIncomplete = prog?.steps?.find(s => !s.completed);
  if (firstIncomplete) return {
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    label: isAr
      ? `خطوتك التالية: ${firstIncomplete.titleAr || firstIncomplete.title}`
      : `Your next step: ${firstIncomplete.title}`,
    sub: isAr
      ? `الخطوة ${(prog?.steps?.indexOf(firstIncomplete) || 0) + 1} في مسار ${track.nameAr || track.name}`
      : `Step ${(prog?.steps?.indexOf(firstIncomplete) || 0) + 1} in your ${track.name} roadmap`,
    href:  '#/roadmap',
    cta:   isAr ? 'ابدأ الآن' : 'Start Now',
    color: track?.color || 'var(--color-primary)',
  };
  if (enrollments.length === 0) return {
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>`,
    label: isAr ? 'سجّل في أول دورة على مسارك' : 'Enroll in your first course',
    sub:   isAr ? 'الدورات المختارة لمسارك متاحة' : 'Hand-picked courses for your track are ready',
    href:  '#/courses',
    cta:   isAr ? 'استعرض الدورات' : 'Browse Courses',
    color: '#f59e0b',
  };
  return {
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    label: isAr ? 'تابع تقدمك في خارطة الطريق' : 'Continue your roadmap progress',
    sub: isAr
      ? `أكملت ${prog?.percent || 0}% من مسارك`
      : `You are ${prog?.percent || 0}% through your track`,
    href:  '#/roadmap',
    cta:   isAr ? 'فتح الخارطة' : 'Open Roadmap',
    color: track?.color || 'var(--color-primary)',
  };
}

function _insight(result, track, isAr) {
  if (!result || !track) return null;
  const pct  = result.top3?.[0]?.pct || 0;
  const conf = result.confidence?.level || 'high';
  const gap  = result.confidence?.gap  || 0;
  const copies = isAr ? [
    `تُظهر نتائجك توافقاً بنسبة ${pct}% مع مسار ${track.nameAr || track.name}.`,
    `درجة الثقة ${conf === 'high' ? 'عالية' : conf === 'medium' ? 'متوسطة' : 'معقولة'} بفارق ${gap} نقطة عن المسار التالي.`,
    `إجاباتك تكشف نمطاً واضحاً — ${result.strengthSentence?.ar || ''}`,
  ] : [
    `Your results show a ${pct}% alignment with ${track.name} — a strong signal you are on the right path.`,
    `Confidence is ${conf} with a ${gap}-point gap over the next track.`,
    `Your answer pattern: ${result.strengthSentence?.en || ''}`,
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

  // B1 FIX: Demo Mode button only visible when no real testResult exists
  const showDemoBtn = !result;

  const nba     = _nba(user, track, prog, enrollments, result, isAr);
  const insight = _insight(result, track, isAr);

  const hour     = new Date().getHours();
  const greeting = isAr
    ? (hour < 12 ? 'صباح الخير' : 'مساء الخير')
    : (hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening');

  return `
    <div class="dashboard fade-in">

      <div class="db-hero-section">
        <div class="db-hero-section__left">
          <p class="db-hero-section__greeting">${greeting},</p>
          <h1 class="db-hero-section__name">${firstName}</h1>
          ${track ? `<p class="db-hero-section__track-label">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${track.color};margin-inline-end:6px"></span>
            ${isAr ? (track.nameAr || track.name) : track.name}
          </p>` : ''}
        </div>
        ${showDemoBtn ? `
          <button class="btn btn--outline btn--sm" id="demo-mode-btn" style="flex-shrink:0;gap:6px">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            ${isAr ? 'وضع العرض' : 'Demo Mode'}
          </button>` : ''}
      </div>

      <div class="db-nextstep slide-up" style="animation-delay:0.04s;border-left:4px solid ${nba.color};background:${nba.color}06">
        <div class="db-nextstep__badge" style="background:${nba.color}14;color:${nba.color}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          ${isAr ? 'الخطوة التالية' : 'Next Step'}
        </div>
        <div class="db-nextstep__body">
          <h2 class="db-nextstep__title">${nba.label}</h2>
          <p class="db-nextstep__sub">${nba.sub}</p>
        </div>
        <a href="${nba.href}" class="btn btn--lg" style="background:${nba.color};color:#fff;border-color:${nba.color};flex-shrink:0">${nba.cta}</a>
      </div>

      <div class="dashboard-stats">
        <div class="stat-card slide-up" style="animation-delay:0.1s">
          <div class="stat-card__icon" style="background:var(--color-primary-subtle,#6366f122);color:var(--color-primary)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value">${track ? '1' : '0'}</span>
            <span class="stat-card__label">${isAr ? 'المسار النشط' : 'Active Track'}</span>
          </div>
        </div>
        <div class="stat-card slide-up" style="animation-delay:0.13s">
          <div class="stat-card__icon" style="background:var(--color-success-subtle,#10b98122);color:var(--color-success,#10b981)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value ltr-text">${prog ? prog.percent + '%' : '0%'}</span>
            <span class="stat-card__label">${isAr ? 'التقدم في المسار' : 'Track Progress'}</span>
          </div>
        </div>
        <div class="stat-card slide-up" style="animation-delay:0.16s">
          <div class="stat-card__icon" style="background:var(--color-warning-subtle,#f59e0b22);color:var(--color-warning,#f59e0b)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value">${enrollments.length}</span>
            <span class="stat-card__label">${isAr ? 'الدورات المسجلة' : 'Courses Enrolled'}</span>
          </div>
        </div>
        <div class="stat-card slide-up" style="animation-delay:0.19s">
          <div class="stat-card__icon" style="background:var(--color-pink-subtle,#ec489922);color:var(--color-pink,#ec4899)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/></svg>
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value">${bookings.length}</span>
            <span class="stat-card__label">${isAr ? 'جلسات الإرشاد' : 'Mentor Sessions'}</span>
          </div>
        </div>
      </div>

      ${insight ? `
        <div class="db-insight slide-up" style="animation-delay:0.22s">
          <div class="db-insight__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>
          </div>
          <p class="db-insight__text">${insight}</p>
          <a href="#/decision-summary" class="db-insight__link">
            ${isAr ? 'ملخص القرار' : 'Decision Summary'}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>` : ''}

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

      <div class="db-quicknav slide-up" style="animation-delay:0.3s">
        ${[
          { icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/></svg>`, label: isAr ? 'خارطة الطريق' : 'Roadmap',    href: '#/roadmap',    color: 'var(--color-primary)' },
          { icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`, label: isAr ? 'نتائج التقييم' : 'My Results',   href: '#/results',   color: 'var(--color-success,#10b981)' },
          { icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`, label: isAr ? 'ملخص القرار' : 'Decision',     href: '#/decision-summary', color: 'var(--color-primary)' },
          { icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,  label: isAr ? 'الإعدادات' : 'Settings',     href: '#/settings',   color: 'var(--color-text-muted)' },
        ].map(item => `
          <a href="${item.href}" class="db-quicknav__item">
            <span class="db-quicknav__icon" style="color:${item.color};background:${item.color}14">${item.icon}</span>
            <span class="db-quicknav__label">${item.label}</span>
          </a>`).join('')}
      </div>

    </div>`;
}

export function DashboardEvents() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('.progress-bar__fill[data-pct]').forEach(el => {
        el.style.transition = 'width 0.7s cubic-bezier(0.4,0,0.2,1)';
        el.style.width = el.dataset.pct + '%';
      });
    });
  });

  document.getElementById('demo-mode-btn')?.addEventListener('click', () => {
    const isAr = document.documentElement.getAttribute('lang') === 'ar';

    const demoResult = {
      topTrackId: 'frontend',
      top3: [
        { id: 'frontend', score: 30, pct: 92 },
        { id: 'ux',       score: 22, pct: 73 },
        { id: 'backend',  score: 16, pct: 53 },
      ],
      scores:      { frontend: 30, ux: 22, backend: 16, data: 10, devops: 8 },
      percentages: { frontend: 92, ux: 73, backend: 53, data: 33, devops: 27 },
      confidence:  { level: 'high', gap: 19 },
      dimensions:  { visual: 86, creative: 79, empathetic: 57, analytical: 43, logical: 36, systematic: 21 },
      strengthSentence: {
        en: 'You think in visuals, care about output, and love building things people interact with.',
        ar: 'تفكّر بصرياً، تهتم بالمخرجات، وتحب بناء ما يتفاعل معه الناس.',
      },
      completedAt: Date.now(),
    };
    State.setState('testResult', demoResult);
    StorageService.set('testResult', demoResult);
    StorageService.set('first_run_dismissed', false);
    TrackService.enrollInTrack('frontend');
    StorageService.set('enrollments', [
      { courseId: 'c-fe-1', progress: 100, status: 'completed', enrolledAt: Date.now() - 86400000 },
      { courseId: 'c-fe-2', progress: 42,  status: 'active',    enrolledAt: Date.now() },
    ]);
    StorageService.set('bookings', [
      { mentorId: 'm1', mentorName: 'Sarah El-Rashidy', bookedAt: Date.now(), status: 'confirmed' },
    ]);

    if (window.Toastify) {
      Toastify({
        text:     isAr ? 'تم تفعيل وضع العرض' : 'Demo mode activated',
        duration: 2000,
        gravity:  'bottom',
        position: 'right',
        style:    { background: 'var(--color-primary)' },
      }).showToast();
    }
    setTimeout(() => Router.navigate('/dashboard'), 600);
  });
}
