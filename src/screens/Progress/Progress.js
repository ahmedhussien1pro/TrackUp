import { t } from '../../i18n.js';
import State from '../../state.js';
import { RoadmapService } from '../../services/roadmap.service.js';
import { CourseService } from '../../services/course.service.js';

export function Progress() {
  const user = State.getState('user');
  const track = State.getState('activeTrack');
  const steps = track ? RoadmapService.getStepsForTrack(track.id) : [];
  const completed = steps.filter(s => s.status === 'completed').length;
  const percent = steps.length ? Math.round((completed / steps.length) * 100) : 0;
  const enrollments = State.getState('enrollments') || [];

  return `
    <div class="progress-screen">
      <div class="progress-screen__header">
        <h2>${t('progress.title')}</h2>
        <p>${t('progress.subtitle')}</p>
      </div>
      <div class="progress-screen__overview">
        <div class="progress-ring-wrap">
          <svg viewBox="0 0 100 100" class="progress-ring">
            <circle cx="50" cy="50" r="42" class="progress-ring__bg" />
            <circle
              cx="50" cy="50" r="42"
              class="progress-ring__fill"
              stroke-dasharray="264"
              stroke-dashoffset="${264 - (264 * percent) / 100}"
            />
          </svg>
          <span class="progress-ring__label">${percent}%</span>
        </div>
        <div class="progress-screen__stats">
          <div class="stat-card">
            <span class="stat-card__label">${t('progress.stats.completed')}</span>
            <span class="stat-card__value">${completed} / ${steps.length}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card__label">${t('progress.stats.enrolled')}</span>
            <span class="stat-card__value">${enrollments.length}</span>
          </div>
        </div>
      </div>
      <div class="progress-screen__steps">
        <h3>${t('progress.roadmapStatus')}</h3>
        ${steps.map(step => `
          <div class="progress-step progress-step--${step.status}">
            <span class="progress-step__dot"></span>
            <span class="progress-step__title">${step.title}</span>
            <span class="badge badge--${step.status}">${t('roadmap.status.' + step.status)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
