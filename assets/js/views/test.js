// ─────────────────────────────────────────────────────────
// test.js  ─  TrackUp Quick Assessment
// selectAnswer / prevQuestion / nextQuestion live HERE ONLY.
// main.js must NOT redefine them.
// ─────────────────────────────────────────────────────────

const LETTER_LABELS = ['A', 'B', 'C', 'D'];

const Q_ICONS = [
  ['wrench', 'code-2', 'shuffle'],
  ['heart', 'minus-circle', 'x-circle'],
  ['hard-hat', 'building-2', 'layers-3'],
  ['banknote', 'shield-check', 'plane'],
  ['zap', 'gauge', 'feather'],
];

// ── helpers ──────────────────────────────────────────────
function _lucide(el) {
  if (window.lucide) lucide.createIcons({ attrs: { class: ['lucide'] } });
}
function _refreshDots() {
  const wrap = document.getElementById('test-step-dots');
  if (!wrap) return;
  wrap.innerHTML = QUESTIONS.map((_, i) => {
    const done   = !!state.testAnswers[QUESTIONS[i].id];
    const active = i === state.currentQuestionIndex;
    const w      = active ? '1.8rem' : '.5rem';
    const bg     = (done || active) ? 'var(--accent)' : 'var(--surface-4)';
    const op     = (done || active) ? '1' : '.35';
    return `<div style="width:${w};height:.5rem;border-radius:999px;background:${bg};opacity:${op};transition:width .28s cubic-bezier(.4,0,.2,1),background .2s ease,opacity .2s ease;flex-shrink:0;"></div>`;
  }).join('');
}
function _refreshMeta() {
  const counter = document.getElementById('test-counter');
  const badge   = document.getElementById('test-answered-badge');
  const bar     = document.getElementById('test-progress-fill');
  const backBtn = document.getElementById('test-back-btn');
  const nextBtn = document.getElementById('test-next-btn');
  const mBackBtn = document.getElementById('test-back-btn-m');
  const mNextBtn = document.getElementById('test-next-btn-m');
  const idx     = state.currentQuestionIndex;
  const total   = QUESTIONS.length;
  const answered= QUESTIONS.filter(q => state.testAnswers[q.id]).length;
  const isFirst = idx === 0;
  const isLast  = idx >= total - 1;
  const lang    = state.language;
  const pct     = ((idx + 1) / total) * 100;

  if (counter) counter.innerHTML = `${idx + 1}<span style="font-size:1rem;font-weight:500;opacity:.4;">/${total}</span>`;
  if (badge)   badge.textContent = `${answered}/${total} ${lang === 'ar' ? 'مكتمل' : 'answered'}`;
  if (bar)     bar.style.width   = pct + '%';

  [backBtn, mBackBtn].forEach(b => {
    if (!b) return;
    b.disabled = isFirst;
    b.style.opacity = isFirst ? '.35' : '1';
    b.style.pointerEvents = isFirst ? 'none' : '';
  });
  [nextBtn, mNextBtn].forEach(b => {
    if (!b) return;
    b.textContent = isLast ? t('submitAssessment') : t('next');
    b.onclick = isLast
      ? () => submitAssessment()
      : () => { const q = QUESTIONS[state.currentQuestionIndex]; if (!state.testAnswers[q.id]) return showToast(t('answerNeeded'), '#dc2626'); swapQuestion('next'); };
  });
}

// ── question HTML builder ─────────────────────────────────
function _buildQ() {
  const idx    = state.currentQuestionIndex;
  const q      = QUESTIONS[idx];
  const answer = state.testAnswers[q.id];
  const lang   = state.language;
  const icons  = Q_ICONS[idx] || [];

  return `
    <p class="q-label">${lang === 'ar' ? `السؤال ${idx + 1}` : `Question ${idx + 1}`}</p>
    <h3 class="q-text">${q.text[lang]}</h3>
    <div id="answer-options-${q.id}" class="answer-grid" role="group" aria-label="${q.text[lang]}">
      ${q.options.map((opt, i) => {
        const sel = answer === opt.id;
        return `
        <button
          class="answer-option${sel ? ' selected' : ''}"
          data-answer-id="${opt.id}"
          onclick="selectAnswer('${q.id}','${opt.id}')"
          type="button"
          role="radio"
          aria-checked="${sel}"
        >
          <span class="ao-icon-wrap">
            <i data-lucide="${icons[i] || 'circle'}" style="width:1.05rem;height:1.05rem;"></i>
          </span>
          <span class="ao-letter">${LETTER_LABELS[i]}</span>
          <span class="ao-text">${opt.text[lang]}</span>
          <span class="ao-check">
            <i data-lucide="${sel ? 'check-circle-2' : 'circle'}" style="width:1.1rem;height:1.1rem;"></i>
          </span>
        </button>`;
      }).join('')}
    </div>
  `;
}

// ── selectAnswer — DOM only, no renderApp ────────────────
window.selectAnswer = function selectAnswer(qId, answerId) {
  state.testAnswers[qId] = answerId;
  persistState();

  const container = document.getElementById('answer-options-' + qId);
  if (!container) { renderApp(); return; }

  container.querySelectorAll('.answer-option').forEach(btn => {
    const sel = btn.dataset.answerId === answerId;
    btn.classList.toggle('selected', sel);
    btn.setAttribute('aria-checked', String(sel));
    const chk = btn.querySelector('.ao-check [data-lucide]');
    if (chk) chk.setAttribute('data-lucide', sel ? 'check-circle-2' : 'circle');
  });
  if (window.lucide) lucide.createIcons();

  _refreshDots();
  _refreshMeta();

  clearTimeout(window._autoAdvanceTimer);
  window._autoAdvanceTimer = setTimeout(() => {
    if (state.currentQuestionIndex < QUESTIONS.length - 1) swapQuestion('next');
  }, 520);
};

// ── swapQuestion — slide animation ───────────────────────
window.swapQuestion = function swapQuestion(dir) {
  const wrapper = document.getElementById('question-wrapper');
  if (!wrapper) { renderApp(); return; }

  // exit animation
  wrapper.style.transition = 'opacity .18s ease, transform .18s ease';
  wrapper.style.opacity    = '0';
  wrapper.style.transform  = `translateX(${dir === 'next' ? '-28px' : '28px'})`;
  // RTL flip
  if (state.direction === 'rtl') {
    wrapper.style.transform = `translateX(${dir === 'next' ? '28px' : '-28px'})`;
  }

  setTimeout(() => {
    // advance index
    if (dir === 'next' && state.currentQuestionIndex < QUESTIONS.length - 1) state.currentQuestionIndex++;
    if (dir === 'prev' && state.currentQuestionIndex > 0) state.currentQuestionIndex--;

    // inject new question
    wrapper.innerHTML = _buildQ();
    if (window.lucide) lucide.createIcons();

    // enter animation: start from opposite side
    wrapper.style.transition = 'none';
    wrapper.style.opacity    = '0';
    wrapper.style.transform  = `translateX(${dir === 'next' ? '28px' : '-28px'})`;
    if (state.direction === 'rtl') {
      wrapper.style.transform = `translateX(${dir === 'next' ? '-28px' : '28px'})`;
    }

    // force reflow then animate in
    wrapper.offsetHeight;
    wrapper.style.transition = 'opacity .25s ease, transform .25s cubic-bezier(.4,0,.2,1)';
    wrapper.style.opacity    = '1';
    wrapper.style.transform  = 'translateX(0)';

    _refreshDots();
    _refreshMeta();
  }, 190);
};

window.prevQuestion = function prevQuestion() {
  if (state.currentQuestionIndex > 0) swapQuestion('prev');
};
window.nextQuestion = function nextQuestion() {
  const q = QUESTIONS[state.currentQuestionIndex];
  if (!state.testAnswers[q.id]) return showToast(t('answerNeeded'), '#dc2626');
  if (state.currentQuestionIndex < QUESTIONS.length - 1) swapQuestion('next');
};

// ── main render ───────────────────────────────────────────
window.renderTestView = function renderTestView() {
  if (!state.completedMilestones.profileCompleted) {
    return `
      <section class="surface-panel section-pad">
        <h2 class="section-title">${t('testTitle')}</h2>
        <p class="text-muted" style="margin-top:.8rem;">${t('profileNeeded')}</p>
        <button class="btn btn-primary" style="margin-top:1rem;" onclick="navigateTo('profile')">${t('profileTitle')}</button>
      </section>`;
  }

  const lang    = state.language;
  const isFirst = state.currentQuestionIndex === 0;
  const isLast  = state.currentQuestionIndex >= QUESTIONS.length - 1;
  const pct     = ((state.currentQuestionIndex + 1) / QUESTIONS.length) * 100;
  const answered = QUESTIONS.filter(q => state.testAnswers[q.id]).length;

  const dots = QUESTIONS.map((_, i) => {
    const done   = !!state.testAnswers[QUESTIONS[i].id];
    const active = i === state.currentQuestionIndex;
    return `<div style="width:${active ? '1.8rem' : '.5rem'};height:.5rem;border-radius:999px;background:${(done || active) ? 'var(--accent)' : 'var(--surface-4)'};opacity:${(done || active) ? '1' : '.35'};transition:width .28s cubic-bezier(.4,0,.2,1),background .2s ease;flex-shrink:0;"></div>`;
  }).join('');

  return `
  <div class="test-shell">

    <!-- ── Left / Meta panel ── -->
    <aside class="test-meta">
      <div class="eyebrow" style="margin-bottom:.5rem;">${t('testTitle')}</div>
      <h2 style="font-size:1.35rem;font-weight:800;line-height:1.2;letter-spacing:-.03em;color:var(--text);">${t('testTitle')}</h2>
      <p class="text-muted" style="margin-top:.6rem;font-size:.875rem;line-height:1.7;">${t('testDesc')}</p>

      <!-- counter block -->
      <div class="test-counter-block">
        <span id="test-counter" class="test-counter-num">${state.currentQuestionIndex + 1}<span style="font-size:1rem;font-weight:500;opacity:.4;">/${QUESTIONS.length}</span></span>
        <span class="eyebrow" style="margin-top:.3rem;">${t('question')}</span>
      </div>

      <!-- step dots -->
      <div id="test-step-dots" style="display:flex;align-items:center;gap:.4rem;margin-top:1.1rem;flex-wrap:wrap;">${dots}</div>
      <span id="test-answered-badge" style="display:block;font-size:.76rem;color:var(--text-faint);margin-top:.4rem;">${answered}/${QUESTIONS.length} ${lang === 'ar' ? 'مكتمل' : 'answered'}</span>

      <!-- desktop nav -->
      <div class="test-nav-desktop">
        <button id="test-back-btn" class="btn btn-secondary" onclick="prevQuestion()"
          ${isFirst ? 'disabled style="opacity:.35;pointer-events:none;"' : ''}>
          <i data-lucide="chevron-${lang === 'ar' ? 'right' : 'left'}" style="width:.95rem;height:.95rem;"></i>
          ${t('back')}
        </button>
        <button id="test-next-btn" class="btn btn-primary" onclick="${isLast ? 'submitAssessment()' : 'nextQuestion()'}">
          ${isLast ? t('submitAssessment') : t('next')}
          ${!isLast ? `<i data-lucide="chevron-${lang === 'ar' ? 'left' : 'right'}" style="width:.95rem;height:.95rem;"></i>` : ''}
        </button>
      </div>
      <p style="font-size:.72rem;color:var(--text-faint);margin-top:.55rem;">${lang === 'ar' ? 'يتقدم تلقائياً بعد الاختيار' : 'Auto-advances on selection'}</p>
    </aside>

    <!-- ── Right / Question panel ── -->
    <div class="test-question-panel">
      <!-- progress bar -->
      <div class="progress-bar" style="margin-bottom:1.6rem;">
        <span id="test-progress-fill" style="width:${pct}%"></span>
      </div>

      <!-- question (swappable) -->
      <div id="question-wrapper">${_buildQ()}</div>

      <!-- mobile nav -->
      <div class="test-nav-mobile">
        <button id="test-back-btn-m" class="btn btn-secondary" onclick="prevQuestion()"
          ${isFirst ? 'disabled style="opacity:.35;pointer-events:none;"' : ''}>
          <i data-lucide="chevron-${lang === 'ar' ? 'right' : 'left'}" style="width:.95rem;height:.95rem;"></i>
          ${t('back')}
        </button>
        <button id="test-next-btn-m" class="btn btn-primary" onclick="${isLast ? 'submitAssessment()' : 'nextQuestion()'}">
          ${isLast ? t('submitAssessment') : t('next')}
          ${!isLast ? `<i data-lucide="chevron-${lang === 'ar' ? 'left' : 'right'}" style="width:.95rem;height:.95rem;"></i>` : ''}
        </button>
      </div>
    </div>

  </div>`;
};
