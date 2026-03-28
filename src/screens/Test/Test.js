import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import { TestService } from '../../services/test.service.js';
import State from '../../state.js';

let _session = null;
let _currentIdx = 0;

export function Test() {
  _session = TestService.startTest();
  _currentIdx = 0;
  return _renderQuestion();
}

function _renderQuestion() {
  const q = _session.questions[_currentIdx];
  const total = _session.questions.length;
  const progress = Math.round((_currentIdx / total) * 100);

  return `
    <div class="test-screen">
      <div class="test-screen__header" style="max-width:640px;margin:0 auto var(--space-6)">
        <h1>${t('test.title')}</h1>
        <p>${t('test.subtitle')}</p>
        <div style="margin-top:var(--space-4);height:4px;background:var(--color-surface-2);border-radius:var(--radius-full)">
          <div style="height:100%;width:${progress}%;background:var(--color-primary);border-radius:var(--radius-full);transition:width 0.3s"></div>
        </div>
      </div>
      <div class="test-question" id="test-question-wrap">
        <div class="test-question__count">${t('test.title')} &mdash; ${_currentIdx + 1} / ${total}</div>
        <div class="test-question__text">${q.text}</div>
        <div class="test-question__options">
          ${q.options.map((opt, i) => `
            <button class="test-option" data-q-id="${q.id}" data-opt-idx="${i}">
              ${opt.label}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

export function TestEvents() {
  document.querySelectorAll('.test-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const qId   = btn.dataset.qId;
      const optIdx = parseInt(btn.dataset.optIdx, 10);

      _session = TestService.answerQuestion(_session, qId, optIdx);
      _currentIdx++;

      if (_currentIdx >= _session.questions.length) {
        const result = TestService.submitTest(_session);
        Router.navigate('/results');
        return;
      }

      // Re-render question in place with fade
      const wrap = document.getElementById('test-question-wrap');
      if (!wrap) return;
      const outlet = document.getElementById('app-outlet');
      if (outlet) {
        outlet.innerHTML = _renderQuestion();
        TestEvents();
      }
    });
  });
}
