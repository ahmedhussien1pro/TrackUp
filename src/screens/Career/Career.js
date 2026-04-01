import { t } from '../../i18n.js';
import State from '../../state.js';
import { TrackService } from '../../services/track.service.js';
import { Router } from '../../router.js';

export function Career() {
  const tracks   = TrackService.getAllTracks();
  const user     = State.getState('user') || {};
  const lang     = document.documentElement.getAttribute('lang') || 'en';
  const isAr     = lang === 'ar';
  const activeId = user.activeTrackId;

  return `
    <div class="career-screen fade-in">
      <div class="screen-header">
        <h1>${t('career.title')}</h1>
        <p>${isAr
          ? 'اختر مسارك المهني لتشاهد كل التفاصيل قبل أن تبدأ'
          : 'Explore each track before you commit'
        }</p>
      </div>

      <div class="career-screen__grid">
        ${tracks.map(tr => {
          const isActive = activeId === tr.id;
          const name     = isAr ? (tr.nameAr || tr.name) : tr.name;
          const desc     = isAr ? (tr.descriptionAr || tr.description) : tr.description;

          return `
            <div
              class="track-card${isActive ? ' track-card--active' : ''}"
              data-id="${tr.id}"
              role="article"
              tabindex="0"
              aria-label="${name}"
            >
              <div class="track-card__top">
                <div class="track-card__icon" style="background:${tr.color}22;color:${tr.color}">${tr.icon}</div>
                ${isActive ? `<span class="badge badge--active">${isAr ? 'نشط' : 'Active'}</span>` : ''}
              </div>
              <div class="track-card__name">${name}</div>
              <div class="track-card__desc">${desc}</div>
              <div class="track-card__footer">
                <span class="badge badge--neutral">${tr.level}</span>
                <span class="badge badge--neutral ltr-text">${isAr ? (tr.durationAr || tr.duration) : tr.duration}</span>
              </div>
              <div style="display:flex;gap:var(--space-2);margin-top:var(--space-3)">
                <a
                  href="#/career?id=${tr.id}"
                  class="btn btn--ghost btn--sm"
                  style="flex:1;justify-content:center"
                >
                  ${isAr ? 'التفاصيل' : 'Details'}
                </a>
                <button
                  class="btn ${isActive ? 'btn--outline' : 'btn--primary'} btn--sm track-enroll-btn"
                  data-id="${tr.id}"
                  style="flex:1;justify-content:center"
                >
                  ${isActive
                    ? (isAr ? 'عرض الخارطة' : 'View Roadmap')
                    : (isAr ? 'ابدأ' : 'Start')
                  }
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function CareerEvents() {
  const isAr = document.documentElement.getAttribute('lang') === 'ar';

  document.querySelectorAll('.track-enroll-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const id   = btn.dataset.id;
      const user = State.getState('user') || {};

      if (user.activeTrackId === id) {
        Router.navigate('/roadmap');
        return;
      }

      // Navigate to details page first — let user confirm there
      Router.navigate(`/career?id=${id}`);
    });
  });

  // Keyboard support
  document.querySelectorAll('.track-card[data-id]').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const id = card.dataset.id;
        Router.navigate(`/career?id=${id}`);
      }
    });
  });
}
