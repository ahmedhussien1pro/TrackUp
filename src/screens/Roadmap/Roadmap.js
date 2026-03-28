import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import State from '../../state.js';
import { RoadmapService } from '../../services/roadmap.service.js';
import { TrackService } from '../../services/track.service.js';

export function Roadmap() {
  const user = State.getState('user');
  if (!user?.activeTrackId) {
    return `
      <div class="roadmap-screen">
        <div class="empty-state">
          <p>${t('roadmap.noTrack')}</p>
          <a href="#/career" class="btn btn--primary" style="margin-top:1rem">${t('career.title')}</a>
        </div>
      </div>
    `;
  }

  const track = TrackService.getTrackById(user.activeTrackId);
  const steps = RoadmapService.getStepsForTrack(user.activeTrackId);
  const prog  = RoadmapService.getProgressForTrack(user.activeTrackId);

  return `
    <div class="roadmap-screen">
      <div class="roadmap-screen__header">
        <div>
          <h1>${track?.name || 'Roadmap'}</h1>
          <p>${t('roadmap.subtitle')}</p>
        </div>
        <div style="text-align:end">
          <div style="font-size:var(--text-2xl);font-weight:var(--weight-black);color:var(--color-primary)">${prog.percent}%</div>
          <div style="font-size:var(--text-sm);color:var(--color-text-muted)">${prog.completed}/${prog.total} steps</div>
        </div>
      </div>

      <div class="roadmap-steps">
        ${steps.map((step, i) => `
          <div class="roadmap-step step--${step.status}" data-step-id="${step.id}">
            <div class="roadmap-step__index">${step.status === 'completed' ? '&#10003;' : i + 1}</div>
            <div class="roadmap-step__body">
              <h4>${step.title}</h4>
              <p>${step.description || ''}</p>
              <div class="roadmap-step__meta">
                ${step.duration ? `<span class="badge badge--neutral">${step.duration}</span>` : ''}
                <span class="badge badge--${step.status}">${t('roadmap.status.' + step.status) || step.status}</span>
              </div>
            </div>
            <div class="roadmap-step__action">
              ${step.status === 'active' ? `
                <button class="btn btn--primary btn--sm roadmap-complete-btn" data-step-id="${step.id}">
                  ${t('roadmap.start')}
                </button>
              ` : ''}
              ${step.status === 'completed' ? `
                <button class="btn btn--ghost btn--sm">${t('roadmap.review')}</button>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function RoadmapEvents() {
  document.querySelectorAll('.roadmap-complete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const stepId = btn.dataset.stepId;
      RoadmapService.completeStep(stepId);
      Toastify({ text: 'Step completed. Keep going!', duration: 2000, gravity: 'bottom', position: 'right', style: { background: 'var(--color-success)' } }).showToast();
      // Re-render
      const outlet = document.getElementById('app-outlet');
      if (outlet) { outlet.innerHTML = Roadmap(); RoadmapEvents(); }
    });
  });
}
