import { t } from '../../i18n.js';
import State from '../../state.js';
import { TrackService } from '../../services/track.service.js';

export function Dashboard() {
  const user = State.getState('user');
  const tracks = TrackService.getAllTracks();
  return `
    <div class="dashboard">
      <div class="dashboard__welcome">
        <h2>${t('dashboard.welcome')}, <strong>${user?.name || ''}</strong></h2>
        <p>${t('dashboard.subtitle')}</p>
      </div>
      <div class="dashboard__stats" id="dashboard-stats">
        <div class="stat-card">
          <span class="stat-card__label">${t('dashboard.stats.tracks')}</span>
          <span class="stat-card__value">${tracks.length}</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__label">${t('dashboard.stats.progress')}</span>
          <span class="stat-card__value">0%</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__label">${t('dashboard.stats.sessions')}</span>
          <span class="stat-card__value">0</span>
        </div>
      </div>
      <div class="dashboard__tracks">
        <h3>${t('dashboard.yourTracks')}</h3>
        <div class="tracks-grid" id="tracks-grid">
          ${tracks.map(track => `
            <div class="track-card" onclick="Router.navigate('/career?id=${track.id}')">
              <span class="track-card__icon">${track.icon}</span>
              <h4 class="track-card__name">${track.name}</h4>
              <p class="track-card__desc">${track.description}</p>
              <div class="track-card__meta">
                <span class="badge badge--${track.level}">${track.level}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
