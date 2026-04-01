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
  const activeStep = (prog?.steps || []).find(s => s.status === 'active');
  const nextStep   = activeStep || (prog?.steps || []).find(s => s.status !== 'completed');
  if (nextStep) return {
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    label: isAr ? `خطوتك التالية: ${nextStep.titleAr || nextStep.title}` : `Next step: ${nextStep.title}`,
    sub: isAr
      ? `مرحلة ${nextStep.phase || ''} — ${track.nameAr || track.name}`
      : `Phase: ${nextStep.phase || 'Basics'} — ${track.name} roadmap`,
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
    sub:   isAr ? `أكملت ${prog?.percent || 0}% من مسارك` : `You are ${prog?.percent || 0}% through your track`,
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
  ] : [
    `Your results show ${pct}% alignment with ${track.name} — strong signal you are on the right path.`,
    `Confidence is ${conf} with a ${gap}-point gap over the next track.`,
  ];
  return copies[Math.floor(Date.now() / 3600000) % copies.length];
}

function _ring(pct, color, size = 64) {
  const r    = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="db-ring" data-pct="${pct}" style="--ring-color:${color}">
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--color-border)" stroke-width="6"/>
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="6"
        stroke-dasharray="${circ}" stroke-dashoffset="${circ}"
        stroke-linecap="round" transform="rotate(-90 ${size/2} ${size/2})"
        class="db-ring__arc" data-dash="${dash}"/>
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
        font-size="${size * 0.22}" font-weight="800" fill="${color}">${pct}%</text>
    </svg>`;
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

  const showDemoBtn = !result;
  const nba         = _nba(user, track, prog, enrollments, result, isAr);
  const insight     = _insight(result, track, isAr);

  const hour     = new Date().getHours();
  const greeting = isAr
    ? (hour < 12 ? 'صباح الخير' : 'مساء الخير')
    : (hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening');

  const pct   = prog?.percent || 0;
  const color = track?.color || 'var(--color-primary)';

  return `
    <div class="dashboard fade-in">

      <div class="db-hero-section">
        <div class="db-hero-section__left">
          <p class="db-hero-section__greeting">${greeting},</p>
          <h1 class="db-hero-section__name">${firstName}</h1>
          ${track ? `<p class="db-hero-section__track-label">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};margin-inline-end:6px"></span>
            ${isAr ? (track.nameAr || track.name) : track.name}
          </p>` : ''}
        </div>
        <div style="display:flex;align-items:center;gap:var(--space-4);flex-shrink:0">
          ${track ? _ring(pct, color) : ''}
          ${showDemoBtn ? `
            <button class="btn btn--outline btn--sm" id="demo-mode-btn" style="gap:6px">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              ${isAr ? 'وضع العرض' : 'Demo Mode'}
            </button>` : ''}
        </div>
      </div>

      <div class="db-nextstep slide-up" style="animation-delay:0.04s;border-inline-start-color:${nba.color};background:${nba.color}06">
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
            <span class="stat-card__value ltr-text">${pct}%</span>
            <span class="stat-card__label">${isAr ? 'التقدم في المسار' : 'Track Progress'}</span>
          </div>
        </div>
        <div class="stat-card slide-up" style="animation-delay:0.16s">
          <div class="stat-card__icon" style="background:var(--color-warning-subtle,#f59e0b22);color:var(--color-warning,#f59e0b)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value">${enrollments.length}</span>
            <span class="stat-card__label">${isAr ? 'الدورات المسجلة' : 'Enrolled'}</span>
          </div>
        </div>
        <div class="stat-card slide-up" style="animation-delay:0.19s">
          <div class="stat-card__icon" style="background:var(--color-pink-subtle,#ec489922);color:var(--color-pink,#ec4899)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/></svg>
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value">${bookings.length}</span>
            <span class="stat-card__label">${isAr ? 'جلسات إرشاد' : 'Mentor Sessions'}</span>
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
            <div class="dashboard-track-card__icon" style="background:${color}22;color:${color}">${track.icon}</div>
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
              <div class="progress-bar__fill" data-pct="${pct}" style="width:0%;background:${color}"></div>
            </div>
            <div class="progress-bar__meta">
              <span class="ltr-text">${prog?.completed || 0} ${isAr ? 'مكتمل' : 'completed'}</span>
              <span class="ltr-text">${pct}%</span>
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
          { icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`, label: isAr ? 'نتائج التقييم' : 'My Results', href: '#/results',    color: 'var(--color-success,#10b981)' },
          { icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>`, label: isAr ? 'الدورات' : 'Courses',    href: '#/courses',    color: '#f59e0b' },
          { icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/></svg>`, label: isAr ? 'المرشدين' : 'Mentors',    href: '#/mentorship', color: '#ec4899' },
        ].map(item => `
          <a href="${item.href}" class="db-quicknav__item">
            <span class="db-quicknav__icon" style="color:${item.color};background:${item.color}14">${item.icon}</span>
            <span class="db-quicknav__label">${item.label}</span>
          </a>`).join('')}
      </div>

    </div>`;
}

export function DashboardEvents() {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll('.progress-bar__fill[data-pct]').forEach(el => {
      el.style.transition = 'width 0.7s cubic-bezier(0.4,0,0.2,1)';
      el.style.width = el.dataset.pct + '%';
    });
  }));

  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll('.db-ring__arc[data-dash]').forEach(arc => {
      const circ = parseFloat(arc.getAttribute('stroke-dasharray'));
      const dash = parseFloat(arc.dataset.dash);
      arc.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)';
      arc.style.strokeDashoffset = circ - dash;
    });
  }));

  document.getElementById('demo-mode-btn')?.addEventListener('click', () => {
    const isAr = document.documentElement.getAttribute('lang') === 'ar';
    const demoResult = {
      topTrackId: 'power',
      top3: [
        { id: 'power',          score: 30, pct: 92 },
        { id: 'embedded',       score: 22, pct: 73 },
        { id: 'communications', score: 16, pct: 53 },
      ],
      scores:      { power: 30, embedded: 22, communications: 16, 'career-shift': 8 },
      percentages: { power: 92, embedded: 73, communications: 53, 'career-shift': 25 },
      confidence:  { level: 'high', gap: 19 },
      dimensions:  { systematic: 86, analytical: 79, fieldOriented: 57, creative: 43, logical: 36, social: 21 },
      strengthSentence: {
        en: 'You think systematically, love infrastructure, and excel at complex problem solving.',
        ar: 'تفكّر بمنهجية، تحب البنية التحتية، وتتميز في حل المشكلات المعقدة.',
      },
      completedAt: Date.now(),
    };
    State.setState('testResult', demoResult);
    StorageService.set('testResult', demoResult);
    TrackService.enrollInTrack('power');
    StorageService.set('enrollments', [
      { courseId: 'c-pw-1', progress: 100, status: 'completed', enrolledAt: Date.now() - 86400000 },
      { courseId: 'c-pw-2', progress: 42,  status: 'active',    enrolledAt: Date.now() },
    ]);
    StorageService.set('bookings', [
      { mentorId: 'm1', mentorName: isAr ? 'م. أحمد السيد' : 'Eng. Ahmed El-Sayed', bookedAt: Date.now(), status: 'confirmed' },
    ]);
    Toastify({
      text:     isAr ? 'تم تفعيل وضع العرض' : 'Demo mode activated',
      duration: 2000, gravity: 'bottom', position: 'right',
      style:    { background: 'var(--color-primary)' },
    }).showToast();
    setTimeout(() => Router.navigate('/dashboard'), 600);
  });
}
