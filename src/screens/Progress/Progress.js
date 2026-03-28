import { t } from '../../i18n.js';
import State from '../../state.js';
import { RoadmapService } from '../../services/roadmap.service.js';
import { CourseService } from '../../services/course.service.js';
import { TrackService } from '../../services/track.service.js';

function _animateRing() {
  const fill = document.querySelector('.progress-ring__fill');
  if (!fill) return;
  const target = fill.dataset.target;
  if (!target) return;
  fill.style.strokeDashoffset = target;
}

function _animateBars() {
  document.querySelectorAll('.progress-bar__fill[data-pct]').forEach(el => {
    el.style.width = el.dataset.pct + '%';
  });
}

export function Progress() {
  const user   = State.getState('user');
  const isAr   = document.documentElement.getAttribute('lang') === 'ar';
  const track  = user?.activeTrackId ? TrackService.getTrackById(user.activeTrackId) : null;
  const prog   = track
    ? RoadmapService.getProgressForTrack(track.id)
    : { total: 0, completed: 0, percent: 0 };
  const enrollments = State.getState('enrollments') || [];

  const r     = 60;
  const circ  = parseFloat((2 * Math.PI * r).toFixed(2));
  const start = circ; // start at 0%
  const end   = parseFloat((circ - (prog.percent / 100) * circ).toFixed(2));

  return `
    <div class="progress-screen fade-in">

      <div class="screen-header">
        <h1>${t('progress.title')}</h1>
        <p>${t('progress.subtitle')}</p>
      </div>

      <!-- Stats row -->
      <div class="dashboard-stats" style="margin-bottom:var(--space-6)">
        <div class="stat-card">
          <div class="stat-card__icon" style="background:#6366f122;color:#6366f1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value ltr-text">${prog.completed} / ${prog.total}</span>
            <span class="stat-card__label">${t('progress.stats.completed')}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon" style="background:#f59e0b22;color:#f59e0b">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value">${enrollments.length}</span>
            <span class="stat-card__label">${t('progress.stats.enrolled')}</span>
          </div>
        </div>
      </div>

      <!-- Ring card -->
      <div class="card" style="display:flex;align-items:center;gap:var(--space-8);flex-wrap:wrap;margin-bottom:var(--space-6)">
        <div class="progress-ring-wrap">
          <svg class="progress-ring" viewBox="0 0 140 140">
            <circle class="progress-ring__bg" cx="70" cy="70" r="${r}" />
            <circle
              class="progress-ring__fill"
              cx="70" cy="70" r="${r}"
              stroke-dasharray="${circ}"
              stroke-dashoffset="${start}"
              data-target="${end}"
              ${track ? `style="stroke:${track.color}"` : ''}
            />
          </svg>
          <span class="progress-ring__label ltr-text">${prog.percent}%</span>
        </div>
        <div style="flex:1;min-width:200px">
          <h3 style="margin-bottom:var(--space-2)">
            ${track ? (isAr ? track.nameAr : track.name) : (isAr ? 'لم يتم تحديد مسار' : 'No track selected')}
          </h3>
          <p style="font-size:var(--text-sm);color:var(--color-text-muted);margin-bottom:var(--space-4)">
            ${t('progress.roadmapStatus')}: <span class="ltr-text">${prog.completed}</span> / <span class="ltr-text">${prog.total}</span> steps
          </p>
          ${!track
            ? `<a href="#/career" class="btn btn--primary btn--sm">${t('career.title')}</a>`
            : `<a href="#/roadmap" class="btn btn--outline btn--sm">${t('roadmap.title')}</a>`
          }
        </div>
      </div>

      <!-- Enrolled courses -->
      ${enrollments.length > 0 ? `
        <div class="section-header">
          <h2 class="section-header__title">${t('courses.enrolled')}</h2>
        </div>
        ${enrollments.map(e => {
          const course = CourseService.getCourseById(e.courseId);
          if (!course) return '';
          return `
            <div class="card" style="margin-bottom:var(--space-3)">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-3)">
                <div style="font-weight:var(--weight-semi)">${course.title}</div>
                <span class="badge badge--${e.status === 'completed' ? 'completed' : 'active'}">${e.status}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-bar__fill" data-pct="${e.progress}" style="width:0%"></div>
              </div>
              <div class="progress-bar__meta">
                <span>${isAr ? 'مكتمل' : 'Progress'}</span>
                <span class="ltr-text">${e.progress}%</span>
              </div>
            </div>
          `;
        }).join('')}
      ` : `
        <div class="empty-state">
          <p>${isAr ? 'لم تسجل في أي دورة بعد' : 'No courses enrolled yet'}</p>
          <a href="#/courses" class="btn btn--outline btn--sm" style="margin-top:var(--space-4)">${
            isAr ? 'تصفح الدورات' : 'Browse Courses'
          }</a>
        </div>
      `}
    </div>
  `;
}

export function ProgressEvents() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      _animateRing();
      _animateBars();
    });
  });
}
