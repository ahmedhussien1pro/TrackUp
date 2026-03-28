import { Router } from '../../router.js';
import { TestService } from '../../services/test.service.js';

// Dimension labels shown during test — maps question index to cognitive focus
const DIMENSION_CONTEXT = [
  { en: 'Analysing your creative style',     ar: 'نحلل أسلوبك الإبداعي' },
  { en: 'Measuring your systems thinking',   ar: 'نقيس تفكيرك المنظومي' },
  { en: 'Understanding your problem approach', ar: 'نفهم طريقتك في حل المشكلات' },
  { en: 'Detecting your output preference',  ar: 'نكتشف تفضيلاتك الإنتاجية' },
  { en: 'Reading your curiosity patterns',   ar: 'نقرأ أنماط فضولك' },
  { en: 'Measuring your empathy index',      ar: 'نقيس مؤشر تعاطفك' },
  { en: 'Finalising your career profile',    ar: 'نكتمل بناء ملفك المهني' },
];

let _session = null;
let _current = 0;

export function Test() {
  _session = TestService.startTest();
  _current = 0;
  const q    = _session.questions[_current];
  const lang = document.documentElement.getAttribute('lang') || 'en';
  const isAr = lang === 'ar';
  const total = _session.questions.length;

  return `
    <div class="test-screen fade-in">
      <div class="test-header">
        <div class="test-header__left">
          <div class="test-header__label">${isAr ? 'تقييم المسار المهني' : 'Career Assessment'}</div>
          <h2 class="test-header__title">${isAr ? 'نبني قرارك المهني' : 'We are building your career decision'}</h2>
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
          <span class="test-progress__label" id="test-progress-label">
            ${isAr ? `سؤال 1 من ${total}` : `Question 1 of ${total}`}
          </span>
        </div>
      </div>

      <div class="test-body" id="test-body">
        ${_renderQuestion(q, 0, isAr)}
      </div>
    </div>`;
}

function _renderQuestion(q, idx, isAr) {
  const text = isAr ? (q.textAr || q.text) : q.text;
  return `
    <div class="test-question slide-up" id="test-question-wrap">
      <div class="test-question__num">${isAr ? `سؤال ${idx + 1}` : `Question ${idx + 1}`}</div>
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
      const label   = document.getElementById('test-progress-label');
      const context = document.getElementById('test-progress-context');

      if (_current < total) {
        const q   = _session.questions[_current];
        const pct = ((_current + 1) / total) * 100;

        if (fill)    fill.style.width    = pct + '%';
        if (label)   label.textContent   = isAr ? `سؤال ${_current + 1} من ${total}` : `Question ${_current + 1} of ${total}`;
        if (context) context.textContent = DIMENSION_CONTEXT[_current]?.[isAr ? 'ar' : 'en'] || '';

        const body = document.getElementById('test-body');
        if (body) {
          body.style.opacity   = '0';
          body.style.transform = 'translateY(12px)';
          setTimeout(() => {
            body.innerHTML = _renderQuestion(q, _current, isAr);
            body.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            body.style.opacity    = '1';
            body.style.transform  = 'translateY(0)';
          }, 200);
        }
      } else {
        // All answered — show thinking state then submit
        if (fill) fill.style.width = '100%';
        if (label) label.textContent = isAr ? 'نبني قرارك...' : 'Building your decision...';
        if (context) context.textContent = isAr ? 'تحليل نهائي' : 'Final analysis';

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
