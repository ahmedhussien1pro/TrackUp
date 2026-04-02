// ============================================================
// test.js — TrackUp quick assessment view
// Key rules:
//   • selectAnswer() updates DOM directly — no full renderApp()
//   • navigating questions uses slide animation via swapQuestion()
//   • renderTestView() only called on first load / full re-render
// ============================================================

const LETTER_LABELS = ['A', 'B', 'C', 'D'];

// ─── DOM-only answer selection (no re-render) ───
window.selectAnswer = function selectAnswer(questionId, answerId) {
  // 1. Save to state
  state.testAnswers[questionId] = answerId;
  persistState();

  // 2. Update classes on answer buttons without re-rendering
  const container = document.getElementById('answer-options-' + questionId);
  if (!container) {
    // Fallback: full re-render (shouldn't happen)
    renderApp();
    return;
  }

  container.querySelectorAll('.answer-option').forEach(btn => {
    const isSelected = btn.dataset.answerId === answerId;
    btn.classList.toggle('selected', isSelected);
    // Swap icon
    const icon = btn.querySelector('[data-lucide]');
    if (icon) {
      icon.setAttribute('data-lucide', isSelected ? 'check-circle-2' : 'circle');
    }
    // Re-render lucide icons for this button only
  });
  if (window.lucide) lucide.createIcons({ nodes: [container] });

  // 3. Update next / submit button state (re-enable if was disabled)
  const nextBtn = document.getElementById('test-next-btn');
  if (nextBtn) nextBtn.removeAttribute('disabled');

  // 4. Auto-advance after short delay for better UX
  clearTimeout(window._autoAdvanceTimer);
  window._autoAdvanceTimer = setTimeout(() => {
    const isLast = state.currentQuestionIndex >= QUESTIONS.length - 1;
    if (isLast) {
      // On last question, just highlight — don't auto-submit
      return;
    }
    swapQuestion('next');
  }, 440);
};

// ─── Smooth question swap with slide animation ───
window.swapQuestion = function swapQuestion(direction) {
  const wrapper = document.getElementById('question-wrapper');
  if (!wrapper) { renderApp(); return; }

  const exitClass = 'q-exit';
  const enterClass = 'q-enter';

  wrapper.classList.add(exitClass);

  setTimeout(() => {
    // Move index
    if (direction === 'next') {
      if (state.currentQuestionIndex < QUESTIONS.length - 1) state.currentQuestionIndex += 1;
    } else {
      if (state.currentQuestionIndex > 0) state.currentQuestionIndex -= 1;
    }

    // Inject new question HTML
    wrapper.innerHTML = buildQuestionBody();
    wrapper.classList.remove(exitClass);
    wrapper.classList.add(enterClass);
    if (window.lucide) lucide.createIcons({ nodes: [wrapper] });

    // Update progress bar
    const bar = document.getElementById('test-progress-fill');
    if (bar) bar.style.width = ((state.currentQuestionIndex + 1) / QUESTIONS.length * 100) + '%';

    // Update counter
    const counter = document.getElementById('test-counter');
    if (counter) counter.textContent = (state.currentQuestionIndex + 1) + '/' + QUESTIONS.length;

    // Swap Next / Submit button
    const nextBtn = document.getElementById('test-next-btn');
    if (nextBtn) {
      const isLast = state.currentQuestionIndex >= QUESTIONS.length - 1;
      nextBtn.textContent = isLast ? t('submitAssessment') : t('next');
      nextBtn.onclick = isLast ? submitAssessment : () => {
        const q = QUESTIONS[state.currentQuestionIndex];
        if (!state.testAnswers[q.id]) return showToast(t('answerNeeded'), '#dc2626');
        swapQuestion('next');
      };
    }

    // Clear enter class after animation ends
    setTimeout(() => wrapper.classList.remove(enterClass), 350);
  }, 200);
};

// ─── Build question body HTML ───
function buildQuestionBody() {
  const q = QUESTIONS[state.currentQuestionIndex];
  const answer = state.testAnswers[q.id];
  const lang = state.language;
  const idx = state.currentQuestionIndex;

  return `
    <div class="surface-soft section-pad">
      <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:1rem;">
        <div class="eyebrow">${t('question')} ${idx + 1}</div>
      </div>
      <div style="font-size:clamp(1.1rem,2.5vw,1.4rem);font-weight:800;line-height:1.35;margin-bottom:1.4rem;">${q.text[lang]}</div>
      <div id="answer-options-${q.id}" style="display:grid;gap:.7rem;">
        ${q.options.map((option, i) => `
          <button
            class="answer-option ${answer === option.id ? 'selected' : ''}"
            data-answer-id="${option.id}"
            onclick="selectAnswer('${q.id}','${option.id}')"
            type="button"
          >
            <div style="display:flex;align-items:center;gap:.85rem;">
              <span class="answer-letter">${LETTER_LABELS[i] || (i+1)}</span>
              <span class="answer-text">${option.text[lang]}</span>
              <i
                data-lucide="${answer === option.id ? 'check-circle-2' : 'circle'}"
                class="answer-check"
                style="margin-${lang === 'ar' ? 'right' : 'left'}:auto;"
              ></i>
            </div>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

// ─── Override global prevQuestion / nextQuestion to use swapQuestion ───
window.prevQuestion = function prevQuestion() {
  if (state.currentQuestionIndex > 0) swapQuestion('prev');
};

window.nextQuestion = function nextQuestion() {
  const q = QUESTIONS[state.currentQuestionIndex];
  if (!state.testAnswers[q.id]) return showToast(t('answerNeeded'), '#dc2626');
  if (state.currentQuestionIndex < QUESTIONS.length - 1) swapQuestion('next');
};

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

  const lang = state.language;
  const isLast = state.currentQuestionIndex >= QUESTIONS.length - 1;
  const q = QUESTIONS[state.currentQuestionIndex];
  const progressPct = ((state.currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  // Step dots row
  const stepDots = QUESTIONS.map((_, i) => {
    const done = !!state.testAnswers[QUESTIONS[i].id];
    const active = i === state.currentQuestionIndex;
    return `
      <div style="
        width:${active ? '1.6rem' : '.55rem'};
        height:.55rem;
        border-radius:999px;
        background:${done ? 'var(--brand)' : active ? 'var(--brand)' : 'var(--surface-4)'};
        opacity:${done || active ? '1' : '.4'};
        transition:width .25s ease, background .2s ease;
        flex-shrink:0;
      "></div>
    `;
  }).join('');

  return `
    <section class="surface-panel section-pad" data-aos="fade-up">

      <!-- Header -->
      <div class="page-header">
        <div>
          <div class="eyebrow">${t('testTitle')}</div>
          <h2 class="section-title" style="margin-top:.6rem;">${t('testTitle')}</h2>
          <p class="text-muted" style="margin-top:.5rem;">${t('testDesc')}</p>
        </div>
        <div class="surface-soft section-pad" style="min-width:140px;text-align:center;">
          <div class="eyebrow">${t('question')}</div>
          <div id="test-counter" style="font-weight:800;font-size:1.3rem;margin-top:.4rem;">${state.currentQuestionIndex + 1}/${QUESTIONS.length}</div>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="progress-bar" style="margin-top:1.2rem;">
        <span id="test-progress-fill" style="width:${progressPct}%"></span>
      </div>

      <!-- Step dots -->
      <div style="display:flex;align-items:center;gap:.4rem;margin-top:.75rem;">
        ${stepDots}
        <span style="font-size:.75rem;color:var(--muted);margin-${lang === 'ar' ? 'right' : 'left'}:.4rem;">
          ${QUESTIONS.filter(qq => state.testAnswers[qq.id]).length}/${QUESTIONS.length} ${lang === 'ar' ? 'مكتمل' : 'answered'}
        </span>
      </div>

      <!-- Question block (swappable) -->
      <div id="question-wrapper" style="margin-top:1.2rem;">
        ${buildQuestionBody()}
      </div>

      <!-- Navigation -->
      <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.2rem;align-items:center;">
        <button
          class="btn btn-secondary"
          onclick="prevQuestion()"
          ${state.currentQuestionIndex === 0 ? 'disabled style="opacity:.4;cursor:default;"' : ''}
        >
          <i data-lucide="chevron-${lang === 'ar' ? 'right' : 'left'}" style="width:1rem;height:1rem;"></i>
          ${t('back')}
        </button>
        <button
          id="test-next-btn"
          class="btn btn-primary"
          onclick="${ isLast ? 'submitAssessment()' : 'nextQuestion()' }"
        >
          ${ isLast ? t('submitAssessment') : t('next') }
          <i data-lucide="chevron-${lang === 'ar' ? 'left' : 'right'}" style="width:1rem;height:1rem;"></i>
        </button>
        <span style="font-size:.8rem;color:var(--muted);margin-${lang === 'ar' ? 'right' : 'left'}:auto;">
          ${lang === 'ar' ? 'سيتقدم تلقائياً بعد الاختيار' : 'Auto-advances on selection'}
        </span>
      </div>
    </section>
  `;
};
