import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import { TestService } from '../../services/test.service.js';

let _session = null;
let _current = 0;

export function Test() {
  _session = TestService.startTest();
  _current = 0;
  return _renderQuestion();
}

function _renderQuestion() {
  const q     = _session.questions[_current];
  const total = _session.questions.length;
  const pct   = Math.round((_current / total) * 100);

  return `
    <div class="test-screen">
      ${_current > 0 ? `<button class="btn btn--ghost btn--sm" id="test-back" style="margin-bottom:var(--space-6)">&larr; ${t('common.back')}</button>` : ''}

      <div style="margin-bottom:var(--space-6)">
        <div style="display:flex;justify-content:space-between;font-size:var(--text-xs);color:var(--color-text-muted);margin-bottom:var(--space-2)">
          <span>${t('test.title')}</span>
          <span class="ltr-text">${_current + 1} / ${total}</span>
        </div>
        <div style="height:4px;background:var(--color-surface-2);border-radius:var(--radius-full);overflow:hidden">
          <div style="height:100%;width:${pct}%;background:var(--color-primary);border-radius:var(--radius-full);transition:width 0.3s ease"></div>
        </div>
      </div>

      <div class="test-question">
        <p class="test-question__count">${t('test.subtitle')}</p>
        <p class="test-question__text">${q.text}</p>
        <div class="test-question__options">
          ${q.options.map((opt, i) => `
            <button class="test-option ${_session.answers[q.id] === i ? 'test-option--selected' : ''}" data-index="${i}">${opt.label}</button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

export function TestEvents() {
  document.getElementById('test-back')?.addEventListener('click', () => {
    _current = Math.max(0, _current - 1);
    _rerender();
  });

  document.querySelectorAll('.test-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const q   = _session.questions[_current];
      _session  = TestService.answerQuestion(_session, q.id, Number(btn.dataset.index));

      if (_current < _session.questions.length - 1) {
        _current++;
        _rerender();
      } else {
        TestService.submitTest(_session);
        Router.navigate('/results');
      }
    });
  });
}

function _rerender() {
  const outlet = document.getElementById('app-outlet');
  if (!outlet) return;
  outlet.innerHTML = _renderQuestion();
  TestEvents();
}
