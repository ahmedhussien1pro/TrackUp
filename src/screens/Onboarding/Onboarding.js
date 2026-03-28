import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import { StorageService } from '../../services/storage.service.js';

// Onboarding answers → dimension hints fed into TestService scoring
const GOAL_DIM_HINTS = {
  0: { frontend: 2, visual: 2 },      // Get a new job in tech
  1: { analytical: 1, systematic: 1 }, // Grow in current role
  2: { creative: 2, logical: 1 },      // Learn new skills
  3: { creative: 2, empathetic: 1 },   // Start freelancing
};

const BACKGROUND_PRIOR = {
  0: {},                                        // Complete beginner — no prior
  1: { frontend: 1 },                           // Some coding — slight frontend lean
  2: { backend: 2, devops: 1 },                 // Working in tech — backend/devops boost
  3: { ux: 2, empathetic: 2 },                  // Switching — empathy / ux lean
};

const STEPS = [
  {
    id: 'goal',
    question: { en: 'What is your main goal?', ar: 'ما هدفك الرئيسي؟' },
    options: [
      { en: 'Get a new job in tech',          ar: 'الحصول على وظيفة في التقنية' },
      { en: 'Grow in my current role',        ar: 'التطور في وظيفتي الحالية' },
      { en: 'Learn new skills',               ar: 'تعلّم مهارات جديدة' },
      { en: 'Start freelancing',              ar: 'البدء في العمل الحر' },
    ],
  },
  {
    id: 'background',
    question: { en: 'What is your background?', ar: 'ما خلفيتك؟' },
    options: [
      { en: 'Complete beginner',              ar: 'مبتدئ تماماً' },
      { en: 'Some coding experience',         ar: 'خبرة برمجية بسيطة' },
      { en: 'Working in tech already',        ar: 'أعمل في التقنية بالفعل' },
      { en: 'Switching from another field',   ar: 'قادم من مجال آخر' },
    ],
  },
  {
    id: 'time',
    question: { en: 'How much time can you dedicate weekly?', ar: 'كم ساعة يمكنك تخصيصها أسبوعياً؟' },
    options: [
      { en: 'Less than 5 hours',              ar: 'أقل من 5 ساعات' },
      { en: '5 to 10 hours',                  ar: 'من 5 إلى 10 ساعات' },
      { en: '10 to 20 hours',                 ar: 'من 10 إلى 20 ساعة' },
      { en: 'More than 20 hours',             ar: 'أكثر من 20 ساعة' },
    ],
  },
];

let _step    = 0;
let _answers = {};

export function Onboarding() {
  _step    = 0;
  _answers = {};
  return _renderStep();
}

function _renderStep() {
  const lang  = document.documentElement.getAttribute('lang') || 'en';
  const isAr  = lang === 'ar';
  const step  = STEPS[_step];
  const total = STEPS.length;
  const pct   = Math.round((_step / total) * 100);

  return `
    <div style="max-width:600px;margin:0 auto;padding:var(--space-10) var(--space-4)">
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
        <p class="test-question__text">${isAr ? step.question.ar : step.question.en}</p>
        <div class="test-question__options">
          ${step.options.map((opt, i) => `
            <button class="test-option" data-index="${i}">${isAr ? opt.ar : opt.en}</button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// Build onboarding_context from collected answers and persist to storage
function _buildAndSaveContext(answers) {
  const goalIdx  = parseInt(answers.goal       ?? -1);
  const bgIdx    = parseInt(answers.background  ?? -1);

  const dimHints    = { ...(GOAL_DIM_HINTS[goalIdx]    || {}) };
  const priorWeights = { ...(BACKGROUND_PRIOR[bgIdx]   || {}) };

  const ctx = { raw: answers, dimHints, priorWeights };
  StorageService.set('onboarding_context', ctx);
  return ctx;
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
        // All onboarding answers collected — persist context then go to test
        _buildAndSaveContext(_answers);
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
