import { t } from '../../i18n.js';
import { Router } from '../../router.js';

const STEPS = [
  {
    id: 'goal',
    question: 'What is your main goal?',
    options: ['Get a new job in tech', 'Grow in my current role', 'Learn new skills', 'Start freelancing'],
  },
  {
    id: 'background',
    question: 'What is your background?',
    options: ['Complete beginner', 'Some coding experience', 'Working in tech already', 'Switching from another field'],
  },
  {
    id: 'time',
    question: 'How much time can you dedicate weekly?',
    options: ['Less than 5 hours', '5 to 10 hours', '10 to 20 hours', 'More than 20 hours'],
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
  const step   = STEPS[_step];
  const total  = STEPS.length;
  const pct    = Math.round((_step / total) * 100);

  return `
    <div style="max-width:600px;margin:0 auto;padding:var(--space-10) var(--space-4)">
      <!-- Back button -->
      ${_step > 0 ? `<button class="btn btn--ghost btn--sm" id="onboarding-back" style="margin-bottom:var(--space-6)">&larr; ${t('common.back')}</button>` : ''}

      <div style="margin-bottom:var(--space-6)">
        <div style="display:flex;justify-content:space-between;font-size:var(--text-xs);color:var(--color-text-muted);margin-bottom:var(--space-2)">
          <span>${t('onboarding.step')} <span class="ltr-text">${_step + 1}</span> ${t('onboarding.of')} <span class="ltr-text">${total}</span></span>
          <span class="ltr-text">${pct}%</span>
        </div>
        <div style="height:4px;background:var(--color-surface-2);border-radius:var(--radius-full);overflow:hidden">
          <div style="height:100%;width:${pct}%;background:var(--color-primary);border-radius:var(--radius-full);transition:width 0.4s ease"></div>
        </div>
      </div>

      <div class="test-question" id="onboarding-card">
        <p class="test-question__count">${t('onboarding.title')}</p>
        <p class="test-question__text">${step.question}</p>
        <div class="test-question__options">
          ${step.options.map((opt, i) => `
            <button class="test-option" data-index="${i}">${opt}</button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

export function OnboardingEvents() {
  document.getElementById('onboarding-back')?.addEventListener('click', () => {
    _step = Math.max(0, _step - 1);
    _rerenderOnboarding();
  });

  document.querySelectorAll('.test-option').forEach(btn => {
    btn.addEventListener('click', () => {
      _answers[STEPS[_step].id] = btn.dataset.index;
      if (_step < STEPS.length - 1) {
        _step++;
        _rerenderOnboarding();
      } else {
        Router.navigate('/test');
      }
    });
  });
}

function _rerenderOnboarding() {
  const outlet = document.getElementById('app-outlet');
  if (!outlet) return;
  outlet.innerHTML = _renderStep();
  OnboardingEvents();
}
