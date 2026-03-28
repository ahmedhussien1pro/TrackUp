import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import State from '../../state.js';
import { TrackService } from '../../services/track.service.js';
import { RoadmapService } from '../../services/roadmap.service.js';
import { CourseService } from '../../services/course.service.js';

export function Dashboard() {
  const user = State.getState('user');
  const firstName = user?.name?.split(' ')[0] || 'there';

  const enrolledTrack = user?.activeTrackId ? TrackService.getTrackById(user.activeTrackId) : null;
  const progress = enrolledTrack ? RoadmapService.getProgressForTrack(enrolledTrack.id) : null;
  const enrollments = State.getState('enrollments') || [];

  const allTracks = TrackService.getAllTracks();

  return `
    <div class="dashboard">
      <div class="dashboard__welcome">
        <div>
          <h1>${t('dashboard.welcome')}, ${firstName}</h1>
          <p>${t('dashboard.subtitle')}</p>
        </div>
        ${!enrolledTrack ? `<a href="#/career" class="btn btn--primary">${t('career.viewRoadmap')}</a>` : ''}
      </div>

      <div class="dashboard__stats">
        <div class="stat-card">
          <span class="stat-card__label">${t('dashboard.stats.tracks')}</span>
          <span class="stat-card__value">${enrolledTrack ? 1 : 0}</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__label">${t('dashboard.stats.progress')}</span>
          <span class="stat-card__value">${progress ? progress.percent + '%' : '0%'}</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__label">${t('courses.enrolled')}</span>
          <span class="stat-card__value">${enrollments.length}</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__label">${t('dashboard.stats.sessions')}</span>
          <span class="stat-card__value">${(State.getState('bookings') || []).length}</span>
        </div>
      </div>

      ${enrolledTrack ? `
        <div class="dashboard__active-track card" style="margin-bottom:var(--space-6)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4)">
            <div>
              <h3 style="margin-bottom:var(--space-1)">${enrolledTrack.name}</h3>
              <p style="font-size:var(--text-sm);color:var(--color-text-muted)">${enrolledTrack.description}</p>
            </div>
            <a href="#/roadmap" class="btn btn--outline btn--sm">${t('nav.roadmap')}</a>
          </div>
          <div class="landing__mock-progress" style="height:8px;background:var(--color-surface-2);border-radius:var(--radius-full);overflow:hidden">
            <div style="height:100%;width:${progress?.percent || 0}%;background:var(--color-primary);border-radius:var(--radius-full);transition:width 0.6s ease"></div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:var(--space-2);font-size:var(--text-xs);color:var(--color-text-muted)">
            <span>${progress?.completed || 0} of ${progress?.total || 0} steps</span>
            <span>${progress?.percent || 0}%</span>
          </div>
        </div>
      ` : ''}

      <div class="dashboard__tracks">
        <h3>${t('dashboard.yourTracks')}</h3>
        <div class="tracks-grid">
          ${allTracks.map(track => `
            <div class="track-card" data-track-id="${track.id}">
              <div class="track-card__icon">${track.icon || track.name.slice(0,2)}</div>
              <div class="track-card__name">${track.name}</div>
              <div class="track-card__desc">${track.description}</div>
              <div class="track-card__footer">
                <span class="badge badge--${track.level || 'beginner'}">${track.level || 'Beginner'}</span>
                ${enrolledTrack?.id === track.id ? '<span class="badge badge--active">Active</span>' : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
