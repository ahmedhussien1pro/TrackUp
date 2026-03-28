import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import { TrackService } from '../../services/track.service.js';
import State from '../../state.js';

export function Career() {
  const tracks = TrackService.getAllTracks();
  const user = State.getState('user');

  return `
    <div class="career-screen">
      <div class="career-screen__header">
        <h1>${t('career.title')}</h1>
        <p>${t('career.subtitle')}</p>
      </div>
      <div class="career-screen__grid">
        ${tracks.map(track => `
          <div class="track-card" data-track-id="${track.id}">
            <div class="track-card__icon">${track.icon || track.name.slice(0,2)}</div>
            <div class="track-card__name">${track.name}</div>
            <div class="track-card__desc">${track.description}</div>
            <div class="track-card__footer">
              <span class="badge badge--${track.level || 'beginner'}">${track.level || 'Beginner'}</span>
              <span class="badge badge--neutral">${track.duration || '3 months'}</span>
              ${user?.activeTrackId === track.id ? '<span class="badge badge--active">Active</span>' : ''}
            </div>
            <div style="display:flex;gap:var(--space-2);margin-top:var(--space-2)">
              <button class="btn btn--outline btn--sm btn--full career-enroll-btn" data-track-id="${track.id}">
                ${user?.activeTrackId === track.id ? t('roadmap.status.active') : t('career.viewRoadmap')}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function CareerEvents() {
  document.querySelectorAll('.career-enroll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const trackId = btn.dataset.trackId;
      const result = TrackService.enrollInTrack(trackId);
      if (result.success) {
        Toastify({ text: 'Track selected. Loading your roadmap...', duration: 2000, gravity: 'bottom', position: 'right', style: { background: 'var(--color-primary)' } }).showToast();
        setTimeout(() => Router.navigate('/roadmap'), 800);
      }
    });
  });
}
