import { t } from '../../i18n.js';
import State from '../../state.js';
import { TrackService } from '../../services/track.service.js';
import { RoadmapService } from '../../services/roadmap.service.js';
import { CourseService } from '../../services/course.service.js';

export function Dashboard() {
  const user       = State.getState('user') || {};
  const firstName  = user.name?.split(' ')[0] || 'there';
  const track      = user.activeTrackId ? TrackService.getTrackById(user.activeTrackId) : null;
  const prog       = track ? RoadmapService.getProgressForTrack(track.id) : null;
  const enrollments = State.getState('enrollments') || [];
  const bookings    = State.getState('bookings')    || [];
  const allTracks   = TrackService.getAllTracks();

  return `
    <div class="dashboard">
      <div class="dashboard__welcome">
        <div>
          <h1>${t('dashboard.welcome')}, ${firstName}</h1>
          <p>${t('dashboard.subtitle')}</p>
        </div>
        ${!track ? `<a href="#/career" class="btn btn--primary">${t('career.title')}</a>` : ''}
      </div>

      <div class="dashboard__stats">
        <div class="stat-card">
          <span class="stat-card__label">${t('dashboard.stats.tracks')}</span>
          <span class="stat-card__value">${track ? 1 : 0}</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__label">${t('dashboard.stats.progress')}</span>
          <span class="stat-card__value">${prog ? prog.percent + '%' : '0%'}</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__label">${t('courses.enrolled')}</span>
          <span class="stat-card__value">${enrollments.length}</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__label">${t('dashboard.stats.sessions')}</span>
          <span class="stat-card__value">${bookings.length}</span>
        </div>
      </div>

      ${track ? `
        <div class="card" style="margin-bottom:var(--space-6);padding:var(--space-6)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);flex-wrap:wrap;gap:var(--space-3)">
            <div>
              <h3 style="margin-bottom:var(--space-1)">${track.name}</h3>
              <p style="font-size:var(--text-sm);color:var(--color-text-muted)">${track.description}</p>
            </div>
            <a href="#/roadmap" class="btn btn--outline btn--sm">${t('nav.roadmap')}</a>
          </div>
          <div style="height:8px;background:var(--color-surface-2);border-radius:var(--radius-full);overflow:hidden">
            <div style="height:100%;width:${prog?.percent || 0}%;background:var(--color-primary);border-radius:var(--radius-full);transition:width 0.6s ease"></div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:var(--space-2);font-size:var(--text-xs);color:var(--color-text-muted)">
            <span>${prog?.completed || 0} of ${prog?.total || 0} steps</span>
            <span>${prog?.percent || 0}%</span>
          </div>
        </div>
      ` : `
        <div class="card" style="margin-bottom:var(--space-6);padding:var(--space-8);text-align:center">
          <p style="color:var(--color-text-muted);margin-bottom:var(--space-4)">You have not selected a career track yet.</p>
          <a href="#/test" class="btn btn--primary">${t('test.title')}</a>
        </div>
      `}

      <div>
        <h3 style="margin-bottom:var(--space-4)">${t('dashboard.yourTracks')}</h3>
        <div class="tracks-grid">
          ${allTracks.map(tr => `
            <div class="track-card">
              <div class="track-card__icon">${tr.icon}</div>
              <div class="track-card__name">${tr.name}</div>
              <div class="track-card__desc">${tr.description}</div>
              <div class="track-card__footer">
                <span class="badge">${tr.level}</span>
                ${track?.id === tr.id ? '<span class="badge badge--active" style="background:var(--color-primary-light);color:var(--color-primary)">Active</span>' : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
