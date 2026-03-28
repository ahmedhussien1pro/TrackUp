import { t } from '../../i18n.js';
import State from '../../state.js';
import { RoadmapService } from '../../services/roadmap.service.js';
import { CourseService } from '../../services/course.service.js';
import { TrackService } from '../../services/track.service.js';

export function Progress() {
  const user = State.getState('user');
  const track = user?.activeTrackId ? TrackService.getTrackById(user.activeTrackId) : null;
  const prog  = track ? RoadmapService.getProgressForTrack(track.id) : { total: 0, completed: 0, percent: 0 };
  const enrollments = State.getState('enrollments') || [];
  const r = 60;
  const circ = 2 * Math.PI * r;
  const offset = circ - (prog.percent / 100) * circ;

  return `
    <div class="progress-screen">
      <div class="progress-screen__header">
        <h1>${t('progress.title')}</h1>
        <p>${t('progress.subtitle')}</p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-6);margin-bottom:var(--space-8)">
        <div class="stat-card">
          <span class="stat-card__label">${t('progress.stats.completed')}</span>
          <span class="stat-card__value">${prog.completed} / ${prog.total}</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__label">${t('progress.stats.enrolled')}</span>
          <span class="stat-card__value">${enrollments.length}</span>
        </div>
      </div>

      <div class="card" style="display:flex;align-items:center;gap:var(--space-8);flex-wrap:wrap">
        <div class="progress-ring-wrap">
          <svg class="progress-ring" viewBox="0 0 140 140">
            <circle class="progress-ring__bg" cx="70" cy="70" r="${r}" />
            <circle
              class="progress-ring__fill"
              cx="70" cy="70" r="${r}"
              stroke-dasharray="${circ}"
              stroke-dashoffset="${offset}"
            />
          </svg>
          <span class="progress-ring__label">${prog.percent}%</span>
        </div>
        <div>
          <h3 style="margin-bottom:var(--space-2)">${track?.name || 'No track selected'}</h3>
          <p style="font-size:var(--text-sm);color:var(--color-text-muted)">${t('progress.roadmapStatus')}: ${prog.completed} of ${prog.total} steps done</p>
          ${!track ? `<a href="#/career" class="btn btn--primary btn--sm" style="margin-top:var(--space-4)">${t('career.title')}</a>` : ''}
        </div>
      </div>

      ${enrollments.length > 0 ? `
        <div style="margin-top:var(--space-6)">
          <h3 style="margin-bottom:var(--space-4)">${t('courses.enrolled')}</h3>
          ${enrollments.map(e => {
            const course = CourseService.getCourseById(e.courseId);
            return course ? `
              <div class="card" style="margin-bottom:var(--space-3);display:flex;justify-content:space-between;align-items:center">
                <div>
                  <div style="font-weight:var(--weight-semi);margin-bottom:var(--space-1)">${course.title}</div>
                  <div style="font-size:var(--text-xs);color:var(--color-text-muted)">${e.progress}% complete</div>
                </div>
                <span class="badge badge--${e.status === 'completed' ? 'completed' : 'active'}">${e.status}</span>
              </div>
            ` : '';
          }).join('')}
        </div>
      ` : ''}
    </div>
  `;
}
