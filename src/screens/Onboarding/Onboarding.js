import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import { StorageService } from '../../services/storage.service.js';

const STEPS = ['goal', 'background', 'availability'];

export function Onboarding() {
  return `
    <div class="onboarding">
      <div class="onboarding__progress">
        ${STEPS.map((s, i) => `<span class="onboarding__dot" data-step="${i}"></span>`).join('')}
      </div>
      <div class="onboarding__content" id="onboarding-step"></div>
    </div>
  `;
}

export function OnboardingEvents() {
  let currentStep = 0;
  const answers = {};

  function renderStep(step) {
    const container = document.getElementById('onboarding-step');
    if (!container) return;
    container.innerHTML = `
      <h2>${t('onboarding.' + STEPS[step] + '.title')}</h2>
      <p>${t('onboarding.' + STEPS[step] + '.description')}</p>
      <button class="btn btn--primary" id="onboarding-next">
        ${step < STEPS.length - 1 ? t('common.next') : t('common.finish')}
      </button>
    `;
    document.querySelectorAll('.onboarding__dot').forEach((dot, i) => {
      dot.classList.toggle('active', i <= step);
    });
    document.getElementById('onboarding-next')?.addEventListener('click', () => {
      answers[STEPS[step]] = true;
      if (step < STEPS.length - 1) {
        currentStep++;
        renderStep(currentStep);
      } else {
        StorageService.set('onboarding_complete', true);
        Router.navigate('/test');
      }
    });
  }

  renderStep(currentStep);
}
