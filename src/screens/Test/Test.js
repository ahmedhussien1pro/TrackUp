import { Router } from '../../router.js';
import { TestService } from '../../services/test.service.js';
import State from '../../state.js';

// Profile-building context labels — replaces "Question X of Y" framing
const DIMENSION_CONTEXT = [
  { en: 'Building your creativity profile',    ar: 'نبني ملفك الإبداعي' },
  { en: 'Mapping your systems thinking',       ar: 'نرسم تفكيرك المنظومي' },
  { en: 'Identifying your problem style',      ar: 'نحدد أسلوب حلك للمشكلات' },
  { en: 'Capturing your output preference',    ar: 'نكتشف تفضيلاتك الإنتاجية' },
  { en: 'Detecting your curiosity patterns',   ar: 'نقرأ أنماط فضولك' },
  { en: 'Measuring your empathy signal',       ar: 'نقيس إشارة تعاطفك' },
  { en: 'Completing your career profile',      ar: 'نكتمل بناء ملفك المهني' },
];

const GOAL_LABELS = {
  get_job:       { en: 'Find a job',      ar: 'الحصول على وظيفة' },
  switch_career: { en: 'Switch careers',  ar: 'تغيير المسار المهني' },
  freelance:     { en: 'Go freelance',    ar: 'العمل الحر' },
  upskill:       { en: 'Level up skills', ar: 'تطوير المهارات' },
  explore:       { en: 'Explore options', ar: 'استكشاف الخيارات' },
};

let _session = null;
let _current = 0;

function _goalHint(isAr) {
  const ctx = State.getState('onboarding_context');
  if (!ctx?.goal) return '';
  const label = GOAL_LABELS[ctx.goal]?.[isAr ? 'ar' : 'en'];
  if (!label) return '';
  return `
    <div class="test-goal-hint">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
      <span>${isAr ? `هدفك: ${label}` : `Your goal: ${label}`}</span>
    </div>`;
}

// Progress dots — replaces "X of Y" countdown feel
function _progressDots(current, total) {
  return Array.from({ length: total }, (_, i) => `
    <span class="test-dot${i < current ? ' test-dot--done' : i === current ? ' test-dot--active' : ''}"></span>
  `).join('');
}

export function Test() {
  _session = TestService.startTest();
  _current = 0;
  const q     = _session.questions[_current];
  const lang  = document.documentElement.getAttribute('lang') || 'en';
  const isAr  = lang === 'ar';
  const total = _session.questions.length;

  return `
    <div class="test-screen fade-in">
      <div class="test-header">
        <div class="test-header__left">
          <div class="test-header__label">${isAr ? 'تقييم ذكي' : 'Smart Assessment'}</div>
          <h2 class="test-header__title">${isAr ? 'نبني ملفك المهني' : 'Building your career profile'}</h2>
          ${_goalHint(isAr)}
        </div>
        <a href="#/" class="btn btn--ghost btn--sm">${isAr ? 'خروج' : 'Exit'}</a>
      </div>

      <div class="test-progress">
        <div class="test-progress__track">
          <div class="test-progress__fill" id="test-progress-fill" style="width:${(1 / total) * 100}%"></div>
        </div>
        <div class="test-progress__meta">
          <span class="test-progress__context" id="test-progress-context">
            ${DIMENSION_CONTEXT[0]?.[isAr ? 'ar' : 'en'] || ''}
          </span>
          <span class="test-progress__dots" id="test-progress-dots">
            ${_progressDots(0, total)}
          </span>
        </div>
      </div>

      <div class="test-body" id="test-body">
        ${_renderQuestion(q, isAr)}
      </div>
    </div>`;
}

function _renderQuestion(q, isAr) {
  const text = isAr ? (q.textAr || q.text) : q.text;
  return `
    <div class="test-question slide-up" id="test-question-wrap">
      <h3 class="test-question__text">${text}</h3>
      <div class="test-options" id="test-options">
        ${q.options.map((opt, i) => `
          <button class="test-option" data-index="${i}" data-qid="${q.id}">
            <span class="test-option__letter">${String.fromCharCode(65 + i)}</span>
            <span class="test-option__label">${isAr ? (opt.labelAr || opt.label) : opt.label}</span>
          </button>`).join('')}
      </div>
    </div>`;
}

export function TestEvents() {
  const lang  = document.documentElement.getAttribute('lang') || 'en';
  const isAr  = lang === 'ar';
  const total = _session ? _session.questions.length : 7;

  document.getElementById('test-body')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.test-option');
    if (!btn || !_session) return;

    const qid = btn.dataset.qid;
    const idx = parseInt(btn.dataset.index);

    document.querySelectorAll('.test-option').forEach(b => b.classList.remove('test-option--selected'));
    btn.classList.add('test-option--selected');

    _session = TestService.answerQuestion(_session, qid, idx);

    setTimeout(() => {
      _current++;
      const fill    = document.getElementById('test-progress-fill');
      const context = document.getElementById('test-progress-context');
      const dots    = document.getElementById('test-progress-dots');

      if (_current < total) {
        const q   = _session.questions[_current];
        const pct = ((_current + 1) / total) * 100;

        if (fill)    fill.style.width    = pct + '%';
        if (context) context.textContent = DIMENSION_CONTEXT[_current]?.[isAr ? 'ar' : 'en'] || '';
        if (dots)    dots.innerHTML      = _progressDots(_current, total);

        const body = document.getElementById('test-body');
        if (body) {
          body.style.opacity   = '0';
          body.style.transform = 'translateY(12px)';
          setTimeout(() => {
            body.innerHTML = _renderQuestion(q, isAr);
            body.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            body.style.opacity    = '1';
            body.style.transform  = 'translateY(0)';
          }, 200);
        }
      } else {
        if (fill) fill.style.width = '100%';
        if (context) context.textContent = isAr ? 'تحليل نهائي' : 'Finalising your profile';
        if (dots)    dots.innerHTML = _progressDots(total, total);

        const body = document.getElementById('test-body');
        if (body) {
          body.innerHTML = `
            <div style="text-align:center;padding:var(--space-16) var(--space-4)">
              <div class="test-thinking">
                <div class="test-thinking__dots"><span></span><span></span><span></span></div>
                <p style="margin-top:var(--space-4);color:var(--color-text-secondary);font-size:var(--text-sm)">
                  ${isAr ? 'نبني قرارك المهني...' : 'Building your career decision...'}
                </p>
              </div>
            </div>`;
        }
        setTimeout(() => {
          TestService.submitTest(_session);
          Router.navigate('/results');
        }, 1600);
      }
    }, 280);
  });
}
