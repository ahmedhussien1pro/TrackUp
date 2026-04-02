// ─────────────────────────────────────────────────────────
// test.js — TrackUp Quick Assessment
// ─────────────────────────────────────────────────────────

const LETTER_LABELS = ['A', 'B', 'C', 'D'];

function _refreshDots() {
  const wrap = document.getElementById('test-step-dots');
  if (!wrap) return;
  wrap.innerHTML = QUESTIONS.map((_, i) => {
    const done   = !!state.testAnswers[QUESTIONS[i].id];
    const active = i === state.currentQuestionIndex;
    const w   = active ? '1.8rem' : '.5rem';
    const bg  = (done || active) ? 'var(--accent)' : 'var(--surface-4)';
    const op  = (done || active) ? '1' : '.3';
    return `<div style="width:${w};height:5px;border-radius:999px;background:${bg};opacity:${op};transition:width .28s cubic-bezier(.4,0,.2,1),background .2s ease;flex-shrink:0;"></div>`;
  }).join('');
}

function _refreshMeta() {
  const idx    = state.currentQuestionIndex;
  const total  = QUESTIONS.length;
  const isFirst = idx === 0;
  const isLast  = idx >= total - 1;
  const lang   = state.language;
  const pct    = ((idx + 1) / total) * 100;
  const answered = QUESTIONS.filter(q => state.testAnswers[q.id]).length;

  const counter = document.getElementById('test-counter');
  const badge   = document.getElementById('test-answered-badge');
  const bar     = document.getElementById('test-progress-fill');
  if (counter) counter.innerHTML = `${idx + 1}<span style="font-size:1rem;font-weight:500;opacity:.4;">/${total}</span>`;
  if (badge)   badge.textContent = `${answered}/${total} ${lang === 'ar' ? 'مكتمل' : 'answered'}`;
  if (bar)     bar.style.width   = pct + '%';

  ['test-back-btn','test-back-btn-m'].forEach(id => {
    const b = document.getElementById(id);
    if (!b) return;
    b.disabled = isFirst;
    b.style.opacity = isFirst ? '.35' : '1';
    b.style.pointerEvents = isFirst ? 'none' : '';
  });

  ['test-next-btn','test-next-btn-m'].forEach(id => {
    const b = document.getElementById(id);
    if (!b) return;
    b.textContent = isLast ? t('submitAssessment') : t('next');
    b.onclick = isLast
      ? () => submitAssessment()
      : () => { const q = QUESTIONS[state.currentQuestionIndex]; if (!state.testAnswers[q.id]) return showToast(t('answerNeeded'), '#dc2626'); swapQuestion('next'); };
  });
}

function _buildQ() {
  const idx    = state.currentQuestionIndex;
  const q      = QUESTIONS[idx];
  const answer = state.testAnswers[q.id];
  const lang   = state.language;

  return `
    <p class="q-label">${lang === 'ar' ? `السؤال ${idx + 1}` : `Question ${idx + 1}`}</p>
    <h3 class="q-text">${q.text[lang]}</h3>
    <div id="answer-options-${q.id}" class="answer-grid" role="group">
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

window.selectAnswer = function selectAnswer(qId, answerId) {
  state.testAnswers[qId] = answerId;
  persistState();

  const container = document.getElementById('answer-options-' + qId);
  if (!container) { renderMainOnly(); return; }

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
};

window.swapQuestion = function swapQuestion(dir) {
  const wrapper = document.getElementById('question-wrapper');
  if (!wrapper) { renderMainOnly(); return; }

  const rtl   = state.direction === 'rtl';
  const outX  = dir === 'next' ? (rtl ? '24px' : '-24px') : (rtl ? '-24px' : '24px');
  const inX   = dir === 'next' ? (rtl ? '-24px' : '24px') : (rtl ? '24px' : '-24px');

  wrapper.style.transition = 'opacity .17s ease, transform .17s ease';
  wrapper.style.opacity    = '0';
  wrapper.style.transform  = `translateX(${outX})`;

  setTimeout(() => {
    if (dir === 'next' && state.currentQuestionIndex < QUESTIONS.length - 1) state.currentQuestionIndex++;
    if (dir === 'prev' && state.currentQuestionIndex > 0) state.currentQuestionIndex--;

    wrapper.innerHTML = _buildQ();
    if (window.lucide) lucide.createIcons();

    wrapper.style.transition = 'none';
    wrapper.style.opacity    = '0';
    wrapper.style.transform  = `translateX(${inX})`;
    wrapper.offsetHeight;

    wrapper.style.transition = 'opacity .24s ease, transform .24s cubic-bezier(.4,0,.2,1)';
    wrapper.style.opacity    = '1';
    wrapper.style.transform  = 'translateX(0)';

    _refreshDots();
    _refreshMeta();
  }, 180);
};

window.prevQuestion = function prevQuestion() {
  if (state.currentQuestionIndex > 0) swapQuestion('prev');
};
window.nextQuestion = function nextQuestion() {
  const q = QUESTIONS[state.currentQuestionIndex];
  if (!state.testAnswers[q.id]) return showToast(t('answerNeeded'), '#dc2626');
  if (state.currentQuestionIndex < QUESTIONS.length - 1) swapQuestion('next');
};

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
    return `<div style="width:${active ? '1.8rem' : '.5rem'};height:5px;border-radius:999px;background:${(done||active) ? 'var(--accent)' : 'var(--surface-4)'};opacity:${(done||active) ? '1' : '.3'};transition:width .28s cubic-bezier(.4,0,.2,1),background .2s ease;flex-shrink:0;"></div>`;
  }).join('');

  const backDisabled = isFirst ? 'disabled style="opacity:.35;pointer-events:none;"' : '';

  return `
  <div class="test-shell">

    <div class="test-question-panel">
      <div class="progress-bar" style="margin-bottom:1.6rem;">
        <span id="test-progress-fill" style="width:${pct}%"></span>
      </div>

      <div id="question-wrapper">${_buildQ()}</div>

      <div class="test-nav-mobile">
        <button id="test-back-btn-m" class="btn btn-secondary" onclick="prevQuestion()" ${backDisabled}>
          <i data-lucide="chevron-${lang === 'ar' ? 'right' : 'left'}" style="width:.95rem;height:.95rem;"></i>
          ${t('back')}
        </button>
        <button id="test-next-btn-m" class="btn btn-primary" onclick="${isLast ? 'submitAssessment()' : 'nextQuestion()'}">
          ${isLast ? t('submitAssessment') : t('next')}
          ${!isLast ? `<i data-lucide="chevron-${lang === 'ar' ? 'left' : 'right'}" style="width:.95rem;height:.95rem;"></i>` : ''}
        </button>
      </div>
    </div>

    <aside class="test-meta">
      <div class="eyebrow" style="margin-bottom:.5rem;">${t('testTitle')}</div>
      <p style="font-size:1.2rem;font-weight:800;line-height:1.25;letter-spacing:-.025em;color:var(--text);">${t('testTitle')}</p>
      <p class="text-muted" style="margin-top:.5rem;font-size:.86rem;line-height:1.7;">${t('testDesc')}</p>

      <div class="test-counter-block">
        <span id="test-counter" class="test-counter-num">${state.currentQuestionIndex + 1}<span style="font-size:1rem;font-weight:500;opacity:.4;">/${QUESTIONS.length}</span></span>
        <span class="eyebrow" style="margin-top:.25rem;">${t('question')}</span>
      </div>

      <div id="test-step-dots" style="display:flex;align-items:center;gap:.4rem;margin-top:1rem;flex-wrap:wrap;">${dots}</div>
      <span id="test-answered-badge" style="display:block;font-size:.75rem;color:var(--text-faint);margin-top:.35rem;">${answered}/${QUESTIONS.length} ${lang === 'ar' ? 'مكتمل' : 'answered'}</span>

      <div class="test-nav-desktop">
        <button id="test-back-btn" class="btn btn-secondary" onclick="prevQuestion()" ${backDisabled}>
          <i data-lucide="chevron-${lang === 'ar' ? 'right' : 'left'}" style="width:.95rem;height:.95rem;"></i>
          ${t('back')}
        </button>
        <button id="test-next-btn" class="btn btn-primary" onclick="${isLast ? 'submitAssessment()' : 'nextQuestion()'}">
          ${isLast ? t('submitAssessment') : t('next')}
          ${!isLast ? `<i data-lucide="chevron-${lang === 'ar' ? 'left' : 'right'}" style="width:.95rem;height:.95rem;"></i>` : ''}
        </button>
      </div>
    </aside>

  </div>`;
};
