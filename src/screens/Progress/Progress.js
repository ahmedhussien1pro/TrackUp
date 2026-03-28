import { t } from '../../i18n.js';
import State from '../../state.js';
import { RoadmapService } from '../../services/roadmap.service.js';
import { CourseService } from '../../services/course.service.js';
import { TrackService } from '../../services/track.service.js';

// ── Streak ────────────────────────────────────────────────────────────
function _getStreak() {
  // derive from localStorage activity log; fallback to demo value
  const log = JSON.parse(localStorage.getItem('trackup__activityLog') || '[]');
  if (!log.length) return 3; // demo streak
  const days = [...new Set(log.map(ts => new Date(ts).toDateString()))];
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (days.includes(d.toDateString())) streak++;
    else break;
  }
  return streak;
}

// ── Weekly activity (last 7 days) ─────────────────────────────────────
function _weekActivity() {
  const log = JSON.parse(localStorage.getItem('trackup__activityLog') || '[]');
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const label = days[d.getDay()];
    const active = log.some(ts => new Date(ts).toDateString() === d.toDateString());
    // demo: mark last 3 + today
    const demoActive = i >= 4 || i === 6;
    return { label, active: active || demoActive };
  });
}

// ── Milestones ─────────────────────────────────────────────────────────
function _milestones(prog, enrollments, isAr) {
  return [
    {
      done: !!State.getState('testResult'),
      label: isAr ? 'إكمال التقييم المهني' : 'Complete career assessment',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`,
      href: '#/test',
    },
    {
      done: !!State.getState('user')?.activeTrackId,
      label: isAr ? 'اختيار مسار مهني' : 'Choose a career track',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`,
      href: '#/results',
    },
    {
      done: prog.completed > 0,
      label: isAr ? 'إكمال أول خطوة في المسار' : 'Complete first roadmap step',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><polyline points="8 7 3 12 8 17"/></svg>`,
      href: '#/roadmap',
    },
    {
      done: enrollments.length > 0,
      label: isAr ? 'التسجيل في دورة' : 'Enroll in a course',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>`,
      href: '#/courses',
    },
    {
      done: JSON.parse(localStorage.getItem('trackup__bookings') || '[]').length > 0,
      label: isAr ? 'حجز جلسة مع مرشد' : 'Book a mentor session',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>`,
      href: '#/mentorship',
    },
  ];
}

function _animateRing() {
  const fill = document.querySelector('.progress-ring__fill');
  if (!fill) return;
  fill.style.strokeDashoffset = fill.dataset.target;
}

function _animateBars() {
  document.querySelectorAll('.progress-bar__fill[data-pct]').forEach(el => {
    el.style.width = el.dataset.pct + '%';
  });
}

export function Progress() {
  const user        = State.getState('user');
  const isAr        = document.documentElement.getAttribute('lang') === 'ar';
  const track       = user?.activeTrackId ? TrackService.getTrackById(user.activeTrackId) : null;
  const prog        = track
    ? RoadmapService.getProgressForTrack(track.id)
    : { total: 0, completed: 0, percent: 0 };
  const enrollments = CourseService.getEnrollments();
  const streak      = _getStreak();
  const week        = _weekActivity();
  const milestones  = _milestones(prog, enrollments, isAr);
  const doneCount   = milestones.filter(m => m.done).length;

  const r    = 60;
  const circ = parseFloat((2 * Math.PI * r).toFixed(2));
  const end  = parseFloat((circ - (prog.percent / 100) * circ).toFixed(2));

  return `
    <div class="progress-screen fade-in">

      <div class="screen-header">
        <h1>${isAr ? 'تقدمي' : 'My Progress'}</h1>
        <p>${isAr ? 'تتبع رحلتك وإنجازاتك في مسار TrackUp' : 'Track your journey and achievements across TrackUp'}</p>
      </div>

      <!-- Stats row -->
      <div class="dashboard-stats" style="margin-bottom:var(--space-6)">
        <div class="stat-card slide-up" style="animation-delay:0.04s">
          <div class="stat-card__icon" style="background:#6366f122;color:#6366f1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value ltr-text">${prog.completed} / ${prog.total}</span>
            <span class="stat-card__label">${isAr ? 'خطوات المسار' : 'Roadmap Steps'}</span>
          </div>
        </div>
        <div class="stat-card slide-up" style="animation-delay:0.08s">
          <div class="stat-card__icon" style="background:#f59e0b22;color:#f59e0b">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value">${enrollments.length}</span>
            <span class="stat-card__label">${isAr ? 'دورات مسجلة' : 'Courses Enrolled'}</span>
          </div>
        </div>
        <div class="stat-card slide-up" style="animation-delay:0.12s">
          <div class="stat-card__icon" style="background:#ec489922;color:#ec4899">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value ltr-text">${streak}</span>
            <span class="stat-card__label">${isAr ? 'أيام متواصلة' : 'Day Streak'}</span>
          </div>
        </div>
        <div class="stat-card slide-up" style="animation-delay:0.16s">
          <div class="stat-card__icon" style="background:#10b98122;color:#10b981">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value ltr-text">${doneCount} / ${milestones.length}</span>
            <span class="stat-card__label">${isAr ? 'معالم محققة' : 'Milestones Done'}</span>
          </div>
        </div>
      </div>

      <!-- Ring + Week activity -->
      <div class="prog-top-row slide-up" style="animation-delay:0.18s">

        <!-- Ring card -->
        <div class="card prog-ring-card">
          <div class="progress-ring-wrap">
            <svg class="progress-ring" viewBox="0 0 140 140">
              <circle class="progress-ring__bg" cx="70" cy="70" r="${r}" />
              <circle
                class="progress-ring__fill"
                cx="70" cy="70" r="${r}"
                stroke-dasharray="${circ}"
                stroke-dashoffset="${circ}"
                data-target="${end}"
                ${track ? `style="stroke:${track.color}"` : ''}
              />
            </svg>
            <span class="progress-ring__label ltr-text">${prog.percent}%</span>
          </div>
          <div class="prog-ring-card__meta">
            <h3>${track ? (isAr ? (track.nameAr || track.name) : track.name) : (isAr ? 'لم يتم تحديد مسار' : 'No track selected')}</h3>
            <p>${isAr ? 'خطوات مكتملة' : 'Steps completed'}: <span class="ltr-text">${prog.completed} / ${prog.total}</span></p>
            ${!track
              ? `<a href="#/career" class="btn btn--primary btn--sm" style="margin-top:var(--space-3)">${isAr ? 'اختر مسار' : 'Choose Track'}</a>`
              : `<a href="#/roadmap" class="btn btn--outline btn--sm" style="margin-top:var(--space-3)">${isAr ? 'فتح الخارطة' : 'Open Roadmap'}</a>`
            }
          </div>
        </div>

        <!-- Weekly activity -->
        <div class="card prog-week-card">
          <div class="prog-week-card__title">${isAr ? 'نشاط الأسبوع' : 'This Week'}</div>
          <div class="prog-week">
            ${week.map(d => `
              <div class="prog-week__col">
                <div class="prog-week__dot${d.active ? ' prog-week__dot--active' : ''}" ${track && d.active ? `style="background:${track.color}"` : ''}></div>
                <span class="prog-week__label">${d.label}</span>
              </div>`).join('')}
          </div>
          <div class="prog-streak">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            <span>${streak} ${isAr ? 'يوم متواصل' : 'day streak'}</span>
          </div>
        </div>
      </div>

      <!-- Milestones -->
      <div class="card prog-milestones slide-up" style="animation-delay:0.24s">
        <div class="prog-milestones__header">
          <span class="prog-milestones__title">${isAr ? 'معالم الرحلة' : 'Journey Milestones'}</span>
          <span class="prog-milestones__count ltr-text">${doneCount} / ${milestones.length}</span>
        </div>
        <div class="prog-milestones__list">
          ${milestones.map(m => `
            <a href="${m.href}" class="prog-milestone${m.done ? ' prog-milestone--done' : ''}">
              <span class="prog-milestone__icon" style="${m.done ? 'color:var(--color-success);background:rgba(16,185,129,0.12)' : 'color:var(--color-text-muted);background:var(--color-surface-2)'}">${m.icon}</span>
              <span class="prog-milestone__label">${m.label}</span>
              ${m.done
                ? `<svg class="prog-milestone__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
                : `<svg class="prog-milestone__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`
              }
            </a>`).join('')}
        </div>
      </div>

      <!-- Enrolled courses -->
      ${enrollments.length > 0 ? `
        <div class="section-header slide-up" style="animation-delay:0.28s">
          <h2 class="section-header__title">${isAr ? 'الدورات المسجلة' : 'Enrolled Courses'}</h2>
          <a href="#/courses" class="section-header__link">${isAr ? 'عرض الكل' : 'View all'}</a>
        </div>
        ${enrollments.map((e, i) => {
          const course = CourseService.getCourseById(e.courseId);
          if (!course) return '';
          return `
            <div class="card slide-up" style="margin-bottom:var(--space-3);animation-delay:${0.3 + i * 0.05}s">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-3)">
                <div style="font-weight:var(--weight-semi);font-size:var(--text-sm)">${isAr ? (course.titleAr || course.title) : course.title}</div>
                <span class="badge badge--${e.status === 'completed' ? 'completed' : 'active'}">${isAr ? (e.status === 'completed' ? 'مكتمل' : 'نشط') : e.status}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-bar__fill" data-pct="${e.progress}" style="width:0%"></div>
              </div>
              <div class="progress-bar__meta">
                <span>${isAr ? 'التقدم' : 'Progress'}</span>
                <span class="ltr-text">${e.progress}%</span>
              </div>
            </div>`;
        }).join('')}
      ` : `
        <div class="empty-state slide-up" style="animation-delay:0.28s">
          <p>${isAr ? 'لم تسجل في أي دورة بعد' : 'No courses enrolled yet'}</p>
          <a href="#/courses" class="btn btn--outline btn--sm" style="margin-top:var(--space-4)">${isAr ? 'تصفح الدورات' : 'Browse Courses'}</a>
        </div>`
      }
    </div>`;
}

export function ProgressEvents() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      _animateRing();
      _animateBars();
    });
  });
}
