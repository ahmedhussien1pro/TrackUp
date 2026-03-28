import { Router } from '../../router.js';
import { TestService } from '../../services/test.service.js';
import { TrackService } from '../../services/track.service.js';
import { StorageService } from '../../services/storage.service.js';
import State from '../../state.js';
import { t } from '../../i18n.js';

export function Results() {
  const result   = TestService.getResult();

  if (!result) {
    return `
      <div class="empty-state">
        <div class="empty-state__icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
          </svg>
        </div>
        <h3>${t('results.noResult')}</h3>
        <p>${t('results.noResultSub')}</p>
        <a href="#/test" class="btn btn--primary">${t('test.title')}</a>
      </div>`;
  }

  const allTracks  = TrackService.getAllTracks();
  const top3       = result.top3 || [];
  const topTrack   = allTracks.find(tr => tr.id === result.topTrackId) || allTracks[0];
  const confidence = result.confidence || { level: 'high', gap: 30 };
  const dimensions = result.dimensions || {};

  const confColorMap = {
    high:   'var(--color-success)',
    medium: 'var(--color-warning)',
    low:    'var(--color-primary)',
  };
  const confColor = confColorMap[confidence.level] || confColorMap.high;

  // Build dimension insight rows from top 3 scoring dims
  const dimEntries = Object.entries(dimensions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const dimRows = dimEntries.map(([key, pct]) => `
    <div class="rc-reason">
      <div class="rc-reason__header">
        <span class="rc-reason__dim">${TestService.getDimensionLabel(key)}</span>
        <span class="rc-reason__score">${pct}%</span>
      </div>
      <div class="rc-reason__bar">
        <div class="rc-reason__fill" data-pct="${pct}" style="width:0%;background:${topTrack.color}"></div>
      </div>
    </div>
  `).join('');

  const runnerUp = top3[1] ? allTracks.find(tr => tr.id === top3[1].id) : null;

  const strengthText = result.strengthSentence?.[document.documentElement.getAttribute('lang') || 'en']
    || result.strengthSentence?.en || '';

  return `
    <div class="results-screen">

      <!-- Analysing overlay -->
      <div class="rc-overlay" id="rc-overlay">
        <div class="rc-overlay__inner">
          <div class="rc-overlay__dots"><span></span><span></span><span></span></div>
          <p class="rc-overlay__label" id="rc-overlay-label">${t('test.analysing')}</p>
        </div>
      </div>

      <!-- Decision Reveal -->
      <div class="rc-results" id="rc-results" style="opacity:0">

        <!-- Hero -->
        <div class="rc-hero">
          <div class="rc-hero__eyebrow">${t('results.eyebrow')}</div>
          <h1 class="rc-hero__title">
            ${t('results.headline')}
            <span style="color:${topTrack.color}">&nbsp;${topTrack.name}</span>
          </h1>
          <p class="rc-hero__sub">${t('results.sub')}</p>

          <div class="rc-confidence" style="border-color:${confColor}20;background:${confColor}0d">
            <span class="rc-confidence__dot" style="background:${confColor}"></span>
            <span class="rc-confidence__label" style="color:${confColor}">
              ${TestService.getConfidenceCopy(confidence.level)}
            </span>
          </div>
        </div>

        <!-- Primary Track Decision Card -->
        <div class="rc-decision-card" style="border-color:${topTrack.color}30;background:${topTrack.color}05">
          <div class="rc-decision-card__header">
            <div class="rc-decision-card__icon" style="background:${topTrack.color}18;color:${topTrack.color}">
              ${topTrack.icon}
            </div>
            <div class="rc-decision-card__meta">
              <div class="rc-decision-card__name">${topTrack.name}</div>
              <div class="rc-decision-card__sub">${topTrack.level} &middot; ${topTrack.duration}</div>
            </div>
            <span class="rc-badge" style="background:${topTrack.color}18;color:${topTrack.color};border-color:${topTrack.color}30">
              ${top3[0]?.pct || 0}%
            </span>
          </div>

          <!-- Why This Track — dimension reasons -->
          <div class="rc-why-section">
            <p class="rc-why-section__title">${t('results.whyThis')}</p>
            <div class="rc-reasons">${dimRows}</div>
            ${strengthText ? `<p class="rc-strength">${strengthText}</p>` : ''}
          </div>
        </div>

        <!-- Alternative Track -->
        ${runnerUp ? `
          <div class="rc-alt-track">
            <div class="rc-alt-track__label">${t('results.altTrack')}</div>
            <div class="rc-alt-track__row">
              <div class="rc-alt-track__icon" style="background:${runnerUp.color}18;color:${runnerUp.color}">
                ${runnerUp.icon}
              </div>
              <div class="rc-alt-track__info">
                <strong>${runnerUp.name}</strong>
                <span class="badge badge--neutral ltr-text">${top3[1]?.pct || 0}%</span>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- All Tracks list (collapsed) -->
        <div class="rc-tracks" id="rc-tracks">
          ${top3.slice(1).map((item, i) => {
            const tr = allTracks.find(t => t.id === item.id);
            if (!tr) return '';
            return `
              <div class="rc-card rc-card--rank-${i + 2}" style="opacity:0;transform:translateY(16px)">
                <div class="rc-card__header">
                  <div class="rc-card__rank">${i + 2}</div>
                  <div class="rc-card__icon" style="background:${tr.color}18;color:${tr.color};border-color:${tr.color}30">${tr.icon}</div>
                  <div class="rc-card__meta">
                    <div class="rc-card__name">${tr.name}</div>
                    <div class="rc-card__sub">${tr.level} &middot; ${tr.duration}</div>
                  </div>
                </div>
                <div class="rc-bar-row">
                  <div class="rc-bar-bg">
                    <div class="rc-bar-fill" data-pct="${item.pct}" style="width:0%;background:${tr.color}"></div>
                  </div>
                  <span class="rc-pct ltr-text" data-target="${item.pct}">0%</span>
                </div>
              </div>`;
          }).join('')}
        </div>

        <!-- Gateway Actions -->
        <div class="rc-gateway">
          <div class="rc-gateway__primary">
            <button class="btn btn--primary btn--lg" id="rc-start-btn" data-track-id="${topTrack.id}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              ${t('results.startTrack')}
            </button>
            <p class="rc-gateway__hint">${t('results.startHint')}</p>
          </div>
          <div class="rc-gateway__secondary">
            <button class="btn btn--outline" id="rc-summary-btn" data-track-id="${topTrack.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              ${t('results.viewFull')}
            </button>
            <button class="btn btn--ghost btn--sm" id="rc-retake-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-3.54"/></svg>
              ${t('results.retake')}
            </button>
          </div>
        </div>

      </div>
    </div>`;
}

export function ResultsEvents() {
  const overlay    = document.getElementById('rc-overlay');
  const results    = document.getElementById('rc-results');
  const overlayLbl = document.getElementById('rc-overlay-label');

  const phases = [
    t('test.analysing'),
    t('results.measuringFit'),
    t('results.rankingResults'),
  ];

  let phaseIdx = 0;
  const phaseInterval = setInterval(() => {
    phaseIdx = (phaseIdx + 1) % phases.length;
    if (overlayLbl) overlayLbl.textContent = phases[phaseIdx];
  }, 700);

  setTimeout(() => {
    clearInterval(phaseInterval);
    if (overlay) {
      overlay.style.transition = 'opacity 0.5s ease';
      overlay.style.opacity    = '0';
      setTimeout(() => { overlay.style.display = 'none'; }, 500);
    }
    if (results) {
      results.style.transition = 'opacity 0.4s ease';
      results.style.opacity    = '1';
    }

    // Animate reason bars
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.querySelectorAll('.rc-reason__fill').forEach(el => {
          el.style.transition = 'width 0.7s cubic-bezier(0.4,0,0.2,1)';
          el.style.width = el.dataset.pct + '%';
        });
      });
    });

    // Animate secondary track cards
    document.querySelectorAll('.rc-card').forEach((card, i) => {
      setTimeout(() => {
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        card.style.opacity    = '1';
        card.style.transform  = 'translateY(0)';
        const fill   = card.querySelector('.rc-bar-fill');
        const pctEl  = card.querySelector('.rc-pct');
        const target = parseInt(fill?.dataset.pct || '0');
        setTimeout(() => {
          if (fill)  fill.style.width = target + '%';
          if (pctEl) _countUp(pctEl, 0, target, 700);
        }, 100);
      }, i * 200);
    });
  }, 2200);

  // Start Track → enroll + Dashboard
  document.getElementById('rc-start-btn')?.addEventListener('click', (e) => {
    const trackId = e.currentTarget.dataset.trackId;
    if (trackId) TrackService.enrollInTrack(trackId);
    const user = State.getState('user');
    Router.navigate(user ? '/dashboard' : '/register');
  });

  // View Full Analysis → Decision Summary
  document.getElementById('rc-summary-btn')?.addEventListener('click', (e) => {
    const trackId = e.currentTarget.dataset.trackId;
    if (trackId) TrackService.enrollInTrack(trackId);
    Router.navigate('/decision-summary');
  });

  // Retake
  document.getElementById('rc-retake-btn')?.addEventListener('click', () => {
    State.setState('testResult', null);
    StorageService.set('testResult', null);
    Router.navigate('/test');
  });
}

function _countUp(el, from, to, duration) {
  const start = performance.now();
  const range = to - from;
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + range * ease) + '%';
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
