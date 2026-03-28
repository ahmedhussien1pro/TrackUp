import { t } from '../../i18n.js';
import { TestService } from '../../services/test.service.js';
import { Router } from '../../router.js';
import State from '../../state.js';

export function Test() {
  return `
    <div class="test-screen">
      <div class="test-screen__header">
        <h2>${t('test.title')}</h2>
        <p>${t('test.subtitle')}</p>
      </div>
      <div class="test-screen__body" id="test-body"></div>
    </div>
  `;
}

export function TestEvents() {
  const session = TestService.startTest();
  State.setState('testSession', session);
  let currentIndex = 0;

  function renderQuestion(index) {
    const q = session.questions[index];
    const body = document.getElementById('test-body');
    if (!body || !q) return;
    body.innerHTML = `
      <div class="test-question">
        <span class="test-question__count">${index + 1} / ${session.questions.length}</span>
        <h3 class="test-question__text">${q.text}</h3>
        <div class="test-question__options">
          ${q.options.map((opt, i) => `
            <button class="test-option" data-index="${i}" data-qid="${q.id}">
              ${opt.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;
    body.querySelectorAll('.test-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const qId = btn.dataset.qid;
        const optIndex = parseInt(btn.dataset.index);
        TestService.answerQuestion(session, qId, optIndex);
        if (currentIndex < session.questions.length - 1) {
          currentIndex++;
          renderQuestion(currentIndex);
        } else {
          const result = TestService.submitTest(session);
          State.setState('testResult', result);
          Router.navigate('/results');
        }
      });
    });
  }

  renderQuestion(currentIndex);
}
