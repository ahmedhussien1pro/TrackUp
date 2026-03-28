import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import State from '../../state.js';
import { StorageService } from '../../services/storage.service.js';

const STEPS = [
  {
    id: 'goal',
    titleKey: 'onboarding.goal.title',
    descKey: 'onboarding.goal.description',
    options: ['Get a tech job', 'Switch careers', 'Level up skills', 'Build a startup'],
  },
  {
    id: 'background',
    titleKey: 'onboarding.background.title',
    descKey: 'onboarding.background.description',
    options: ['Complete beginner', 'Some basics', 'Intermediate', 'Advanced'],
  },
  {
    id: 'availability',
    titleKey: 'onboarding.availability.title',
    descKey: 'onboarding.availability.description',
    options: ['1-5 hrs/week', '5-10 hrs/week', '10-20 hrs/week', '20+ hrs/week'],
  },
];

let _step = 0;
let _answers = {};

export function Onboarding() {
  _step = 0;
  _answers = {};
  return _renderStep();
}

function _renderStep() {
  const step = STEPS[_step];
  const progress = Math.round(((_step) / STEPS.length) * 100);

  return `
    <div class="onboarding-screen" style="max-width:560px;margin:var(--space-10) auto;padding:0 var(--space-4)">
      <div style="margin-bottom:var(--space-6)">
        <div style="display:flex;justify-content:space-between;font-size:var(--text-sm);color:var(--color-text-muted);margin-bottom:var(--space-2)">
          <span>Step ${_step + 1} of ${STEPS.length}</span>
          <span>${progress}%</span>
        </div>
        <div style="height:4px;background:var(--color-surface-2);border-radius:var(--radius-full)">
          <div style="height:100%;width:${progress}%;background:var(--color-primary);border-radius:var(--radius-full);transition:width 0.3s"></div>
        </div>
      </div>
      <div class="card">
        <h2 style="margin-bottom:var(--space-2)">${t(step.titleKey)}</h2>
        <p style="margin-bottom:var(--space-6)">${t(step.descKey)}</p>
        <div style="display:flex;flex-direction:column;gap:var(--space-3)">
          ${step.options.map((opt, i) => `
            <button class="test-option onboarding-opt" data-step-id="${step.id}" data-opt-idx="${i}">${opt}</button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

export function OnboardingEvents() {
  document.querySelectorAll('.onboarding-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      _answers[btn.dataset.stepId] = parseInt(btn.dataset.optIdx, 10);
      _step++;

      if (_step >= STEPS.length) {
        const user = { ...State.getState('user'), onboardingAnswers: _answers };
        State.setState('user', user);
        StorageService.set('session', user);
        Router.navigate('/test');
        return;
      }

      const outlet = document.getElementById('app-outlet');
      if (outlet) { outlet.innerHTML = _renderStep(); OnboardingEvents(); }
    });
  });
}
