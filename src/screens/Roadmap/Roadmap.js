import { t } from '../../i18n.js';
import { RoadmapService } from '../../services/roadmap.service.js';
import State from '../../state.js';

const STATUS_CLASS = {
  completed: 'step--completed',
  active: 'step--active',
  locked: 'step--locked',
};

export function Roadmap() {
  const track = State.getState('activeTrack');
  if (!track) return `<div class="empty-state"><p>${t('roadmap.noTrack')}</p></div>`;
  const steps = RoadmapService.getStepsForTrack(track.id);
  return `
    <div class="roadmap-screen">
      <div class="roadmap-screen__header">
        <h2>${track.name}</h2>
        <p>${t('roadmap.subtitle')}</p>
      </div>
      <div class="roadmap-screen__steps">
        ${steps.map((step, i) => `
          <div class="roadmap-step ${STATUS_CLASS[step.status] || 'step--locked'}" data-step-id="${step.id}">
            <div class="roadmap-step__index">${i + 1}</div>
            <div class="roadmap-step__body">
              <h4>${step.title}</h4>
              <p>${step.description}</p>
              <div class="roadmap-step__meta">
                <span class="badge badge--neutral">${step.duration}</span>
                <span class="badge badge--type">${step.type}</span>
              </div>
            </div>
            <div class="roadmap-step__action">
              ${step.status !== 'locked' ? `
                <button class="btn btn--sm btn--${step.status === 'completed' ? 'ghost' : 'primary'}" data-step-id="${step.id}">
                  ${step.status === 'completed' ? t('roadmap.review') : t('roadmap.start')}
                </button>
              ` : `<span class="roadmap-step__lock"></span>`}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function RoadmapEvents() {
  document.querySelectorAll('.roadmap-step__action [data-step-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const stepId = btn.dataset.stepId;
      RoadmapService.markStepActive(stepId);
    });
  });
}
