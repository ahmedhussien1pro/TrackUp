// ============================================================
// test.js — TrackUp Quick Assessment
// selectAnswer / prevQuestion / nextQuestion are ONLY here.
// main.js must NOT redefine them.
// ============================================================

const LETTER_LABELS = ['A', 'B', 'C', 'D'];

// Icons matched to common answer themes (falls back to 'dot')
const OPTION_ICONS = [
  ['wrench','code-2','shuffle'],          // workStyle
  ['heart','minus','x'],                  // programming (aLot/somewhat/no)
  ['hard-hat','building-2','layers-3'],   // environment
  ['banknote','shield','plane'],          // goal
  ['zap','gauge','feather'],              // pressure
];

// ─── DOM-only answer selection ───
window.selectAnswer = function selectAnswer(questionId, answerId) {
  state.testAnswers[questionId] = answerId;
  persistState();

  const container = document.getElementById('answer-options-' + questionId);
  if (!container) { renderApp(); return; }

  container.querySelectorAll('.answer-option').forEach(btn => {
    const sel = btn.dataset.answerId === answerId;
    btn.classList.toggle('selected', sel);
    const chk = btn.querySelector('[data-lucide="check-circle-2"], [data-lucide="circle"]');
    if (chk) chk.setAttribute('data-lucide', sel ? 'check-circle-2' : 'circle');
  });
  if (window.lucide) lucide.createIcons({ nodes: [container] });

  // update answered badge
  const badge = document.getElementById('test-answered-badge');
  if (badge) {
    const answered = QUESTIONS.filter(q => state.testAnswers[q.id]).length;
    badge.textContent = answered + '/' + QUESTIONS.length + ' ' + (state.language === 'ar' ? 'مكتمل' : 'answered');
  }

  // update step dots
  _refreshStepDots();

  // auto-advance (not on last question)
  clearTimeout(window._autoAdvanceTimer);
  window._autoAdvanceTimer = setTimeout(() => {
    if (state.currentQuestionIndex < QUESTIONS.length - 1) swapQuestion('next');
  }, 480);
};

// ─── Slide between questions ───
window.swapQuestion = function swapQuestion(direction) {
  const wrapper = document.getElementById('question-wrapper');
  if (!wrapper) { renderApp(); return; }

  wrapper.classList.add('q-exit');

  setTimeout(() => {
    if (direction === 'next' && state.currentQuestionIndex < QUESTIONS.length - 1) state.currentQuestionIndex += 1;
    if (direction === 'prev' && state.currentQuestionIndex > 0) state.currentQuestionIndex -= 1;

    wrapper.innerHTML = _buildQuestionBody();
    wrapper.classList.remove('q-exit');
    wrapper.classList.add('q-enter');
    if (window.lucide) lucide.createIcons({ nodes: [wrapper] });
    setTimeout(() => wrapper.classList.remove('q-enter'), 360);

    // progress bar
    const bar = document.getElementById('test-progress-fill');
    if (bar) bar.style.width = ((state.currentQuestionIndex + 1) / QUESTIONS.length * 100) + '%';

    // counter
    const counter = document.getElementById('test-counter');
    if (counter) counter.textContent = (state.currentQuestionIndex + 1) + '/' + QUESTIONS.length;

    // swap next/submit button
    const nextBtn = document.getElementById('test-next-btn');
    if (nextBtn) {
      const isLast = state.currentQuestionIndex >= QUESTIONS.length - 1;
      nextBtn.textContent = isLast ? t('submitAssessment') : t('next');
      if (!isLast) nextBtn.innerHTML += ' <i data-lucide="chevron-' + (state.language === 'ar' ? 'left' : 'right') + '" style="width:.95rem;height:.95rem;display:inline;"></i>';
      nextBtn.onclick = isLast
        ? () => submitAssessment()
        : () => { const q = QUESTIONS[state.currentQuestionIndex]; if (!state.testAnswers[q.id]) return showToast(t('answerNeeded'), '#dc2626'); swapQuestion('next'); };
    }

    // back button state
    const backBtn = document.getElementById('test-back-btn');
    if (backBtn) {
      backBtn.disabled = state.currentQuestionIndex === 0;
      backBtn.style.opacity = state.currentQuestionIndex === 0 ? '.35' : '1';
    }

    _refreshStepDots();
    if (window.lucide) lucide.createIcons();
  }, 210);
};

window.prevQuestion = function prevQuestion() {
  if (state.currentQuestionIndex > 0) swapQuestion('prev');
};

window.nextQuestion = function nextQuestion() {
  const q = QUESTIONS[state.currentQuestionIndex];
  if (!state.testAnswers[q.id]) return showToast(t('answerNeeded'), '#dc2626');
  if (state.currentQuestionIndex < QUESTIONS.length - 1) swapQuestion('next');
};

// ─── Build question inner HTML ───
function _buildQuestionBody() {
  const idx  = state.currentQuestionIndex;
  const q    = QUESTIONS[idx];
  const answer = state.testAnswers[q.id];
  const lang = state.language;
  const icons = OPTION_ICONS[idx] || [];

  return `
    <div class="q-question-text">${q.text[lang]}</div>
    <div id="answer-options-${q.id}" class="answer-grid">
      ${q.options.map((opt, i) => `
        <button
          class="answer-option ${answer === opt.id ? 'selected' : ''}"
          data-answer-id="${opt.id}"
          onclick="selectAnswer('${q.id}','${opt.id}')"
          type="button"
        >
          <span class="answer-icon-wrap">
            <i data-lucide="${icons[i] || 'circle'}" class="answer-icon"></i>
          </span>
          <span class="answer-letter">${LETTER_LABELS[i] || (i+1)}</span>
          <span class="answer-text">${opt.text[lang]}</span>
          <i data-lucide="${answer === opt.id ? 'check-circle-2' : 'circle'}" class="answer-check"></i>
        </button>
      `).join('')}
    </div>
  `;
}

// ─── Refresh step dots in-place ───
function _refreshStepDots() {
  const dotsEl = document.getElementById('test-step-dots');
  if (!dotsEl) return;
  dotsEl.innerHTML = QUESTIONS.map((_, i) => {
    const done   = !!state.testAnswers[QUESTIONS[i].id];
    const active = i === state.currentQuestionIndex;
    return `<div style="
      width:${active ? '1.7rem' : '.5rem'};
      height:.5rem;
      border-radius:999px;
      background:${done ? 'var(--brand)' : active ? 'var(--brand)' : 'var(--surface-4)'};
      opacity:${done || active ? '1' : '.35'};
      transition:width .28s cubic-bezier(.4,0,.2,1),background .2s ease;
      flex-shrink:0;
    "></div>`;
  }).join('');
}

// ─── Main render ───
window.renderTestView = function renderTestView() {
  if (!state.completedMilestones.profileCompleted) {
    return `
      <section class="surface-panel section-pad">
        <h2 class="section-title">${t('testTitle')}</h2>
        <p class="text-muted" style="margin-top:.8rem;">${t('profileNeeded')}</p>
        <button class="btn btn-primary" style="margin-top:1rem;" onclick="navigateTo('profile')">${t('profileTitle')}</button>
      </section>
    `;
  }

  const lang      = state.language;
  const isLast    = state.currentQuestionIndex >= QUESTIONS.length - 1;
  const pct       = ((state.currentQuestionIndex + 1) / QUESTIONS.length) * 100;
  const answered  = QUESTIONS.filter(q => state.testAnswers[q.id]).length;
  const stepDots  = QUESTIONS.map((_, i) => {
    const done   = !!state.testAnswers[QUESTIONS[i].id];
    const active = i === state.currentQuestionIndex;
    return `<div style="width:${active ? '1.7rem' : '.5rem'};height:.5rem;border-radius:999px;background:${done ? 'var(--brand)' : active ? 'var(--brand)' : 'var(--surface-4)'};opacity:${done || active ? '1' : '.35'};transition:width .28s cubic-bezier(.4,0,.2,1),background .2s ease;flex-shrink:0;"></div>`;
  }).join('');

  return `
    <section class="test-shell" data-aos="fade-up">

      <!-- Left panel: metadata -->
      <aside class="test-meta-panel">
        <div class="eyebrow" style="margin-bottom:.7rem;">${t('testTitle')}</div>
        <h2 class="section-title" style="font-size:clamp(1.3rem,2vw,1.75rem);">${t('testTitle')}</h2>
        <p class="text-muted" style="margin-top:.65rem;line-height:1.75;font-size:.9rem;">${t('testDesc')}</p>

        <div class="test-meta-counter">
          <span class="test-counter-big" id="test-counter">${state.currentQuestionIndex + 1}<span style="font-size:1.1rem;font-weight:500;opacity:.5;">/${QUESTIONS.length}</span></span>
          <span class="eyebrow" style="margin-top:.2rem;">${t('question')}</span>
        </div>

        <!-- Step dots -->
        <div id="test-step-dots" style="display:flex;align-items:center;gap:.4rem;margin-top:1.2rem;flex-wrap:wrap;">
          ${stepDots}
        </div>
        <span id="test-answered-badge" style="font-size:.78rem;color:var(--text-muted);margin-top:.5rem;display:block;">
          ${answered}/${QUESTIONS.length} ${lang === 'ar' ? 'مكتمل' : 'answered'}
        </span>

        <!-- Nav buttons on desktop -->
        <div class="test-meta-nav">
          <button
            id="test-back-btn"
            class="btn btn-secondary"
            onclick="prevQuestion()"
            ${state.currentQuestionIndex === 0 ? 'disabled style="opacity:.35;"' : ''}
          >
            <i data-lucide="chevron-${lang === 'ar' ? 'right' : 'left'}" style="width:1rem;height:1rem;"></i>
            ${t('back')}
          </button>
          <button
            id="test-next-btn"
            class="btn btn-primary"
            onclick="${isLast ? 'submitAssessment()' : 'nextQuestion()'}"
          >
            ${isLast ? t('submitAssessment') : t('next')}
            ${!isLast ? `<i data-lucide="chevron-${lang === 'ar' ? 'left' : 'right'}" style="width:1rem;height:1rem;"></i>` : ''}
          </button>
        </div>
        <p style="font-size:.75rem;color:var(--text-faint);margin-top:.65rem;">
          ${lang === 'ar' ? 'يتقدم تلقائياً بعد الاختيار' : 'Auto-advances on selection'}
        </p>
      </aside>

      <!-- Right panel: question -->
      <div class="test-question-panel">
        <!-- Progress bar -->
        <div class="progress-bar" style="margin-bottom:1.5rem;">
          <span id="test-progress-fill" style="width:${pct}%"></span>
        </div>

        <div id="question-wrapper">
          ${_buildQuestionBody()}
        </div>

        <!-- Mobile nav (hidden on desktop via CSS) -->
        <div class="test-mobile-nav">
          <button
            class="btn btn-secondary"
            onclick="prevQuestion()"
            ${state.currentQuestionIndex === 0 ? 'disabled style="opacity:.35;"' : ''}
          >
            <i data-lucide="chevron-${lang === 'ar' ? 'right' : 'left'}" style="width:1rem;height:1rem;"></i>
            ${t('back')}
          </button>
          <button
            class="btn btn-primary"
            onclick="${isLast ? 'submitAssessment()' : 'nextQuestion()'}"
          >
            ${isLast ? t('submitAssessment') : t('next')}
            ${!isLast ? `<i data-lucide="chevron-${lang === 'ar' ? 'left' : 'right'}" style="width:1rem;height:1rem;"></i>` : ''}
          </button>
        </div>
      </div>
    </section>
  `;
};
