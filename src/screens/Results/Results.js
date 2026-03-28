import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import { TestService } from '../../services/test.service.js';
import { TrackService } from '../../services/track.service.js';

export function Results() {
  const result = TestService.getResult();

  if (!result) {
    return `
      <div class="empty-state">
        <p>No results yet. Take the assessment first.</p>
        <a href="#/test" class="btn btn--primary" style="margin-top:1rem">${t('test.title')}</a>
      </div>
    `;
  }

  const track = result.recommendedTrack || TrackService.getTrackById(result.topTrackId);
  const scores = result.scores || {};
  const allTracks = TrackService.getAllTracks();

  return `
    <div class="results-screen" style="max-width:640px;margin:0 auto;padding:var(--space-8) var(--space-4)">
      <div style="text-align:center;margin-bottom:var(--space-8)">
        <h1>${t('results.title')}</h1>
        <p>${t('results.subtitle')}</p>
      </div>

      <div class="card" style="text-align:center;padding:var(--space-10);margin-bottom:var(--space-6)">
        <div style="font-size:3rem;margin-bottom:var(--space-3)">${track?.icon || '&#128640;'}</div>
        <h2 style="margin-bottom:var(--space-2)">${track?.name || 'Frontend Engineer'}</h2>
        <p>${track?.description || ''}</p>
        <div style="margin-top:var(--space-6);display:flex;flex-direction:column;gap:var(--space-3)">
          <button class="btn btn--primary btn--lg" id="results-start-btn" data-track-id="${track?.id}">
            ${t('results.cta.start')}
          </button>
          <a href="#/test" class="btn btn--ghost">${t('results.cta.retake')}</a>
        </div>
      </div>

      <div class="card">
        <h3 style="margin-bottom:var(--space-4);font-size:var(--text-base)">Score breakdown</h3>
        ${allTracks.map(t2 => {
          const score = scores[t2.id] || 0;
          const max   = Math.max(...Object.values(scores), 1);
          const pct   = Math.round((score / max) * 100);
          return `
            <div style="margin-bottom:var(--space-3)">
              <div style="display:flex;justify-content:space-between;font-size:var(--text-sm);margin-bottom:var(--space-1)">
                <span>${t2.name}</span><span style="color:var(--color-text-muted)">${score}pts</span>
              </div>
              <div style="height:6px;background:var(--color-surface-2);border-radius:var(--radius-full);overflow:hidden">
                <div style="height:100%;width:${pct}%;background:${t2.id === result.topTrackId ? 'var(--color-primary)' : 'var(--color-border)'};border-radius:var(--radius-full);transition:width 0.5s ease"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function ResultsEvents() {
  document.getElementById('results-start-btn')?.addEventListener('click', (e) => {
    const trackId = e.currentTarget.dataset.trackId;
    if (trackId) {
      const { TrackService } = window.__trackup_services__ || {};
      import('../../services/track.service.js').then(({ TrackService }) => {
        TrackService.enrollInTrack(trackId);
        Router.navigate('/roadmap');
      });
    } else {
      Router.navigate('/roadmap');
    }
  });
}
