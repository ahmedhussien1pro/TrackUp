import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import State from '../../state.js';

export function Results() {
  const result = State.getState('testResult');
  if (!result) {
    Router.navigate('/test');
    return '';
  }
  return `
    <div class="results-screen">
      <div class="results-screen__card">
        <h2>${t('results.title')}</h2>
        <p>${t('results.subtitle')}</p>
        <div class="results-screen__track">
          <span class="badge badge--primary">${result.recommendedTrack?.name || ''}</span>
          <p>${result.recommendedTrack?.description || ''}</p>
        </div>
        <div class="results-screen__actions">
          <button class="btn btn--primary" onclick="Router.navigate('/pricing')">
            ${t('results.cta.start')}
          </button>
          <button class="btn btn--ghost" onclick="Router.navigate('/test')">
            ${t('results.cta.retake')}
          </button>
        </div>
      </div>
    </div>
  `;
}
