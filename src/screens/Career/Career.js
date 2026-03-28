import { t } from '../../i18n.js';
import { TrackService } from '../../services/track.service.js';
import { Router } from '../../router.js';

export function Career() {
  const tracks = TrackService.getAllTracks();
  return `
    <div class="career-screen">
      <div class="career-screen__header">
        <h1>${t('career.title')}</h1>
        <p>${t('career.subtitle')}</p>
      </div>
      <div class="career-screen__grid">
        ${tracks.map(tr => `
          <div class="track-card" data-id="${tr.id}" role="button" tabindex="0" style="cursor:pointer">
            <div class="track-card__icon">${tr.icon}</div>
            <div class="track-card__name">${tr.name}</div>
            <div class="track-card__desc">${tr.description}</div>
            <div class="track-card__footer">
              <span class="badge">${tr.level}</span>
              <span class="badge ltr-text">${tr.duration}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function CareerEvents() {
  document.querySelectorAll('.track-card[data-id]').forEach(card => {
    const enroll = () => {
      const id = card.dataset.id;
      TrackService.enrollInTrack(id);
      Router.navigate('/roadmap');
    };
    card.addEventListener('click', enroll);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') enroll(); });
  });
}
