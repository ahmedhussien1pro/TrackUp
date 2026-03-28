import { t } from '../../i18n.js';
import { TrackService } from '../../services/track.service.js';
import { Router } from '../../router.js';
import State from '../../state.js';

export function Career() {
  const tracks = TrackService.getAllTracks();
  return `
    <div class="career-screen">
      <div class="career-screen__header">
        <h2>${t('career.title')}</h2>
        <p>${t('career.subtitle')}</p>
      </div>
      <div class="career-screen__grid">
        ${tracks.map(track => `
          <div class="track-card" data-id="${track.id}">
            <span class="track-card__icon">${track.icon}</span>
            <h4 class="track-card__name">${track.name}</h4>
            <p class="track-card__desc">${track.description}</p>
            <div class="track-card__footer">
              <span class="badge badge--neutral">${track.duration}</span>
              <span class="badge badge--${track.level}">${track.level}</span>
            </div>
            <button class="btn btn--primary btn--sm" data-track-id="${track.id}">
              ${t('career.viewRoadmap')}
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function CareerEvents() {
  document.querySelectorAll('[data-track-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.trackId;
      const track = TrackService.getTrackById(id);
      State.setState('activeTrack', track);
      Router.navigate('/roadmap?id=' + id);
    });
  });
}
