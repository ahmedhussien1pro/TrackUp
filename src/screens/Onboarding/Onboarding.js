import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import { StorageService } from '../../services/storage.service.js';

// Goal → track prior weight boosts
const GOAL_WEIGHTS = {
  0: { frontend: 2, ux: 2 },          // Get a new job in tech  → visual tracks
  1: { backend: 2, devops: 2 },       // Grow in current role   → infrastructure
  2: { data: 2, backend: 1 },         // Learn new skills       → analytical
  3: { frontend: 1, ux: 1, data: 1 }, // Start freelancing      → flexible
};

// Background → dimension boosts stored as hints for TestService
const BG_DIM_HINTS = {
  0: { visual: 4, creative: 4 },          // Complete beginner     → front-facing dims
  1: { logical: 4, analytical: 4 },       // Some coding exp       → logic path
  2: { systematic: 4, logical: 4 },       // Working in tech       → systems
  3: { empathetic: 4, creative: 4 },      // Switching field       → human-facing
};

// Time → confidence modifier tag (used by TestService to adjust gap threshold)
const TIME_CONFIDENCE = {
  0: 'casual',    // <5h
  1: 'moderate',  // 5-10h
  2: 'dedicated', // 10-20h
  3: 'intensive', // >20h
};

const STEPS = [
  {
    id: 'goal',
    en: { q: 'What is your main goal?', opts: ['Get a new job in tech', 'Grow in my current role', 'Learn new skills', 'Start freelancing'] },
    ar: { q: 'ما هو هدفك الرئيسي؟',    opts: ['الحصول على وظيفة تقنية', 'النمو في دوري الحالي', 'تعلم مهارات جديدة', 'بدء العمل الحر'] },
  },
  {
    id: 'background',
    en: { q: 'What is your background?',              opts: ['Complete beginner', 'Some coding experience', 'Working in tech already', 'Switching from another field'] },
    ar: { q: 'ما هي خلفيتك؟',                        opts: ['مبتدئ تماماً', 'لدي خبرة برمجية', 'أعمل في التقنية', 'أنتقل من مجال آخر'] },
  },
  {
    id: 'time',
    en: { q: 'How much time can you dedicate weekly?', opts: ['Less than 5 hours', '5 to 10 hours', '10 to 20 hours', 'More than 20 hours'] },
    ar: { q: 'كم ساعة يمكنك تخصيصها أسبوعياً؟',      opts: ['أقل من 5 ساعات', 'من 5 إلى 10 ساعات', 'من 10 إلى 20 ساعة', 'أكثر من 20 ساعة'] },
  },
];

const CONTEXT_LABELS = {
  0: { en: 'Setting your direction',   ar: 'نحدد اتجاهك' },
  1: { en: 'Understanding your start', ar: 'نفهم نقطة انطلاقك' },
  2: { en: 'Calibrating your roadmap', ar: 'نعيّر خارطة طريقك' },
};

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
  const copy  = step[isAr ? 'ar' : 'en'];
  const ctx   = CONTEXT_LABELS[_step]?.[lang] || '';

  return `
    <div class="onboarding-screen fade-in">

      <div class="onboarding-header">
        <div class="onboarding-header__eyebrow">${ctx}</div>
        <div class="onboarding-header__progress">
          <div class="onboarding-progress">
            <div class="onboarding-progress__fill" style="width:${pct}%"></div>
          </div>
          <span class="onboarding-progress__label ltr-text">${_step + 1} / ${total}</span>
        </div>
      </div>

      ${_step > 0 ? `
        <button class="btn btn--ghost btn--sm onboarding-back" id="onboarding-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          ${t('common.back')}
        </button>` : ''}

      <div class="test-question slide-up" id="onboarding-card">
        <p class="test-question__count">${isAr ? 'تخصيص المسار' : 'Personalising your path'}</p>
        <h3 class="test-question__text">${copy.q}</h3>
        <div class="test-options">
          ${copy.opts.map((opt, i) => `
            <button class="test-option" data-index="${i}">
              <span class="test-option__letter">${String.fromCharCode(65 + i)}</span>
              <span class="test-option__label">${opt}</span>
            </button>`).join('')}
        </div>
      </div>

    </div>`;
}

export function OnboardingEvents() {
  document.getElementById('onboarding-back')?.addEventListener('click', () => {
    _step = Math.max(0, _step - 1);
    _rerender();
  });

  document.querySelectorAll('.test-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      _answers[STEPS[_step].id] = idx;

      if (_step < STEPS.length - 1) {
        _step++;
        _rerender();
      } else {
        // All 3 answered — build and persist context
        const goalIdx = _answers['goal']       ?? 0;
        const bgIdx   = _answers['background'] ?? 0;
        const timeIdx = _answers['time']       ?? 1;

        const priorWeights = { ...(GOAL_WEIGHTS[goalIdx] || {}) };
        const dimHints     = { ...(BG_DIM_HINTS[bgIdx]   || {}) };
        const timeMode     = TIME_CONFIDENCE[timeIdx] || 'moderate';

        StorageService.set('onboarding_context', {
          answers:      _answers,
          priorWeights,
          dimHints,
          timeMode,
        });

        Router.navigate('/test');
      }
    });
  });
}

function _rerender() {
  const outlet = document.getElementById('app-outlet');
  if (!outlet) return;
  outlet.innerHTML = _renderStep();
  OnboardingEvents();
}
