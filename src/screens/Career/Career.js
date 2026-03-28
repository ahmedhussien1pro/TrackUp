import { t } from '../../i18n.js';
import State from '../../state.js';
import { TrackService } from '../../services/track.service.js';
import { Router } from '../../router.js';

export function Career() {
  const tracks     = TrackService.getAllTracks();
  const user       = State.getState('user') || {};
  const lang       = document.documentElement.getAttribute('lang') || 'en';
  const isAr       = lang === 'ar';
  const activeId   = user.activeTrackId;

  return `
    <div class="career-screen fade-in">
      <div class="screen-header">
        <h1>${t('career.title')}</h1>
        <p>${isAr
          ? '\u0627\u062e\u062a\u0631 \u0645\u0633\u0627\u0631\u0643 \u0627\u0644\u0645\u0647\u0646\u064a \u0648\u0627\u0628\u062f\u0623 \u0631\u062d\u0644\u062a\u0643'
          : 'Choose your career track and start your journey'
        }</p>
      </div>

      <div class="career-screen__grid">
        ${tracks.map(tr => {
          const isActive = activeId === tr.id;
          return `
            <div
              class="track-card${isActive ? ' track-card--active' : ''}"
              data-id="${tr.id}"
              role="button"
              tabindex="0"
              aria-pressed="${isActive}"
            >
              <div class="track-card__top">
                <div class="track-card__icon" style="background:${tr.color}22;color:${tr.color}">${tr.icon}</div>
                ${isActive
                  ? `<span class="badge badge--active">${isAr ? '\u0646\u0634\u0637' : 'Active'}</span>`
                  : ''
                }
              </div>
              <div class="track-card__name">${isAr ? (tr.nameAr || tr.name) : tr.name}</div>
              <div class="track-card__desc">${isAr ? (tr.descriptionAr || tr.description) : tr.description}</div>
              <div class="track-card__footer">
                <span class="badge badge--${tr.level.toLowerCase()}">${tr.level}</span>
                <span class="badge ltr-text">${isAr ? (tr.durationAr || tr.duration) : tr.duration}</span>
              </div>
              <button
                class="btn ${isActive ? 'btn--outline' : 'btn--primary'} btn--sm track-enroll-btn"
                data-id="${tr.id}"
                style="margin-top:var(--space-3);width:100%"
              >
                ${isActive
                  ? (isAr ? '\u0639\u0631\u0636 \u0627\u0644\u062e\u0627\u0631\u0637\u0629' : 'View Roadmap')
                  : (isAr ? '\u0627\u0628\u062f\u0623 \u0647\u0630\u0627 \u0627\u0644\u0645\u0633\u0627\u0631' : 'Start this track')
                }
              </button>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function CareerEvents() {
  document.querySelectorAll('.track-enroll-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id   = btn.dataset.id;
      const user = State.getState('user') || {};

      if (user.activeTrackId === id) {
        Router.navigate('/roadmap');
        return;
      }

      TrackService.enrollInTrack(id);
      Toastify({
        text: document.documentElement.getAttribute('lang') === 'ar'
          ? '\u062a\u0645 \u062a\u062d\u062f\u064a\u062f \u0645\u0633\u0627\u0631\u0643 \u0628\u0646\u062c\u0627\u062d'
          : 'Track selected. Starting your roadmap.',
        duration: 2500,
        gravity: 'bottom',
        position: 'right',
        style: { background: 'var(--color-success)' },
      }).showToast();
      Router.navigate('/roadmap');
    });
  });

  // Keyboard support on card
  document.querySelectorAll('.track-card[data-id]').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.querySelector('.track-enroll-btn')?.click();
      }
    });
  });
}
