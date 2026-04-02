// ───────────────────────────────────────────────────────────────
// subtrack-test.js — TrackUp Deep Sub-track Test (20 Q)
// ───────────────────────────────────────────────────────────────

const ST_LETTERS = ['A', 'B', 'C', 'D'];

function _stFieldKey() {
  const fieldMap = {
    power: 'electrical', embedded: 'electrical', communications: 'electrical',
    frontend: 'software', backend: 'software', data: 'software', cyber: 'software',
    'mechanical-design': 'mechanical', 'mechanical-mfg': 'mechanical', 'mechanical-thermal': 'mechanical',
    'civil-structural': 'civil', 'civil-water': 'civil', 'civil-geo': 'civil'
  };
  const topTrack = state.rankedTracks?.[0]?.id || '';
  const key = fieldMap[topTrack] || state.subtestField || 'electrical';
  if (state.subtestField !== key) { state.subtestField = key; persistState(); }
  return key;
}

function _stQuestions() {
  const key = _stFieldKey();
  return (window.SUBTRACK_QUESTIONS && SUBTRACK_QUESTIONS[key])
      || (window.SUBTRACK_QUESTIONS && SUBTRACK_QUESTIONS['electrical'])
      || [];
}

function _stRefreshDots(questions) {
  const wrap = document.getElementById('st-step-dots');
  if (!wrap) return;
  const idx = state.subtestIndex || 0;
  wrap.innerHTML = questions.map((q, i) => {
    const done   = !!state.subtestAnswers?.[q.id];
    const active = i === idx;
    const w  = active ? '1.8rem' : '.5rem';
    const bg = (done || active) ? 'var(--accent)' : 'var(--surface-4)';
    const op = (done || active) ? '1' : '.3';
    return `<div style="width:${w};height:5px;border-radius:999px;background:${bg};opacity:${op};transition:width .28s cubic-bezier(.4,0,.2,1),background .2s ease;flex-shrink:0;"></div>`;
  }).join('');
}

function _stRefreshMeta(questions) {
  const idx     = state.subtestIndex || 0;
  const total   = questions.length;
  const isFirst = idx === 0;
  const isLast  = idx >= total - 1;
  const lang    = state.language;
  const answered = questions.filter(q => state.subtestAnswers?.[q.id]).length;

  const counter = document.getElementById('st-counter');
  const badge   = document.getElementById('st-answered-badge');
  const bar     = document.getElementById('st-progress-fill');
  if (counter) counter.innerHTML = `${idx + 1}<span style="font-size:1rem;font-weight:500;opacity:.4;">/${total}</span>`;
  if (badge)   badge.textContent = `${answered}/${total} ${lang === 'ar' ? 'مكتمل' : 'answered'}`;
  if (bar)     bar.style.width   = (((idx + 1) / total) * 100) + '%';

  ['st-back-btn', 'st-back-btn-m'].forEach(id => {
    const b = document.getElementById(id);
    if (!b) return;
    b.disabled = isFirst;
    b.style.opacity = isFirst ? '.35' : '1';
    b.style.pointerEvents = isFirst ? 'none' : '';
  });

  ['st-next-btn', 'st-next-btn-m'].forEach(id => {
    const b = document.getElementById(id);
    if (!b) return;
    b.textContent = isLast
      ? (lang === 'ar' ? 'شوف نتيجتي' : 'See My Result')
      : (lang === 'ar' ? 'التالي' : 'Next');
    b.onclick = isLast
      ? () => submitSubtest()
      : () => {
          const q = questions[state.subtestIndex || 0];
          if (!state.subtestAnswers?.[q.id]) return showToast(t('answerNeeded'), '#dc2626');
          _stSwap('next', questions);
        };
  });
}

function _stBuildQ(questions) {
  const idx  = state.subtestIndex || 0;
  const q    = questions[idx];
  if (!q) return '';
  const lang = state.language;
  const ans  = state.subtestAnswers?.[q.id];

  return `
    <p class="q-label">${lang === 'ar' ? `السؤال ${idx + 1}` : `Question ${idx + 1}`}</p>
    <h3 class="q-text">${lang === 'ar' ? q.ar : q.en}</h3>
    <div id="st-answer-options-${q.id}" class="answer-grid" role="group">
      ${q.options.map((opt, i) => {
        const optKey = `${q.id}_${i}`;
        const sel    = ans === optKey;
        return `
          <button
            class="answer-option${sel ? ' selected' : ''}"
            data-optkey="${optKey}"
            onclick="selectSubtestAnswer('${q.id}','${optKey}')"
            type="button"
            role="radio"
            aria-checked="${sel}"
          >
            <span class="ao-letter">${ST_LETTERS[i] || i}</span>
            <span class="ao-text">${lang === 'ar' ? opt.ar : opt.en}</span>
            <span class="ao-check">
              <i data-lucide="${sel ? 'check-circle-2' : 'circle'}" style="width:1.1rem;height:1.1rem;"></i>
            </span>
          </button>`;
      }).join('')}
    </div>
  `;
}

function _stSwap(dir, questions) {
  const wrapper = document.getElementById('st-question-wrapper');
  if (!wrapper) { renderMainOnly(); return; }

  const rtl  = state.direction === 'rtl';
  const outX = dir === 'next' ? (rtl ? '24px' : '-24px') : (rtl ? '-24px' : '24px');
  const inX  = dir === 'next' ? (rtl ? '-24px' : '24px') : (rtl ? '24px' : '-24px');

  wrapper.style.transition = 'opacity .17s ease, transform .17s ease';
  wrapper.style.opacity    = '0';
  wrapper.style.transform  = `translateX(${outX})`;

  setTimeout(() => {
    if (dir === 'next') state.subtestIndex = Math.min((state.subtestIndex || 0) + 1, questions.length - 1);
    if (dir === 'prev') state.subtestIndex = Math.max((state.subtestIndex || 0) - 1, 0);
    persistState();

    wrapper.innerHTML = _stBuildQ(questions);
    if (window.lucide) lucide.createIcons();

    wrapper.style.transition = 'none';
    wrapper.style.opacity    = '0';
    wrapper.style.transform  = `translateX(${inX})`;
    wrapper.offsetHeight;

    wrapper.style.transition = 'opacity .24s ease, transform .24s cubic-bezier(.4,0,.2,1)';
    wrapper.style.opacity    = '1';
    wrapper.style.transform  = 'translateX(0)';

    _stRefreshDots(questions);
    _stRefreshMeta(questions);
  }, 180);
}

window.selectSubtestAnswer = function selectSubtestAnswer(qId, optKey) {
  if (!state.subtestAnswers) state.subtestAnswers = {};
  state.subtestAnswers[qId] = optKey;
  persistState();

  const container = document.getElementById('st-answer-options-' + qId);
  if (!container) { renderMainOnly(); return; }

  container.querySelectorAll('.answer-option').forEach(btn => {
    const sel = btn.dataset.optkey === optKey;
    btn.classList.toggle('selected', sel);
    btn.setAttribute('aria-checked', String(sel));
    const chk = btn.querySelector('.ao-check [data-lucide]');
    if (chk) chk.setAttribute('data-lucide', sel ? 'check-circle-2' : 'circle');
  });
  if (window.lucide) lucide.createIcons();

  const questions = _stQuestions();
  _stRefreshDots(questions);
  _stRefreshMeta(questions);
};

window.subtestBack = function subtestBack() {
  _stSwap('prev', _stQuestions());
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
window.subtestNext = function subtestNext() {
  const questions = _stQuestions();
  const q = questions[state.subtestIndex || 0];
  if (!state.subtestAnswers?.[q?.id]) return showToast(t('answerNeeded'), '#dc2626');
  _stSwap('next', questions);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
window.submitSubtest = function submitSubtest() {
  state.subtestComplete = true;
  persistState();
  renderMainOnly();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
window.resetSubtest = function resetSubtest() {
  state.subtestAnswers  = {};
  state.subtestIndex    = 0;
  state.subtestComplete = false;
  persistState();
  renderMainOnly();
};

// ── Results screen ───────────────────────────────────────────────
window.renderSubtrackResults = function renderSubtrackResults() {
  const isAr      = state.language === 'ar';
  const questions = _stQuestions();
  const answers   = state.subtestAnswers || {};

  if (!questions || questions.length === 0) {
    return `<div class="surface-panel section-pad" style="text-align:center;">
      <p class="text-muted">${isAr ? 'حدث خطأ في تحميل الأسئلة.' : 'Could not load questions.'}</p>
      <button class="btn btn-secondary" style="margin-top:1rem;" onclick="resetSubtest()">
        ${isAr ? 'كرر الاختبار' : 'Retake Test'}
      </button>
    </div>`;
  }

  // Tally scores
  const scores = {};
  questions.forEach(q => {
    const selectedKey = answers[q.id];
    if (!selectedKey) return;
    const optIdx = parseInt(selectedKey.split('_').pop(), 10);
    const opt    = q.options[optIdx];
    if (!opt || !opt.scores) return;
    Object.entries(opt.scores).forEach(([track, pts]) => {
      scores[track] = (scores[track] || 0) + pts;
    });
  });

  const ranked = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .filter(([, pts]) => pts > 0);

  // Guard: no scoreable answers at all
  if (!ranked || ranked.length === 0) {
    return `<div class="surface-panel section-pad" style="text-align:center;">
      <p class="text-muted" style="margin-bottom:1rem;">
        ${isAr ? 'لم تجب على أي سؤال بعد. أجب على الأسئلة أولاً ثم اضغط شوف نتيجتي.' : 'No answers recorded yet. Please answer the questions first, then submit.'}
      </p>
      <button class="btn btn-secondary" onclick="resetSubtest()">
        ${isAr ? 'ابدأ من جديد' : 'Start Over'}
      </button>
    </div>`;
  }

  const topKey   = ranked[0]?.[0];
  const maxPts   = ranked[0]?.[1] || 1;
  const platform = (topKey && window.SUBTRACK_PLATFORMS) ? SUBTRACK_PLATFORMS[topKey] : null;

  if (topKey) { state.subTrackResult = topKey; persistState(); }

  return `
    <div class="page-header" data-aos="fade-up">
      <div>
        <div class="eyebrow">${isAr ? 'نتيجة اختبار التخصص' : 'Sub-track Result'}</div>
        <h2 class="section-title" style="margin-top:.4rem;">
          ${isAr ? 'تخصصك الدقيق وضح' : 'Your Exact Sub-track is Clear'}
        </h2>
      </div>
    </div>

    ${platform ? `
      <div class="surface-panel section-pad" style="border:2px solid var(--accent);" data-aos="fade-up">
        <div class="eyebrow" style="color:var(--accent);">${isAr ? 'التخصص المقترح' : 'Recommended Sub-track'}</div>
        <div style="font-size:1.6rem;font-weight:800;margin:.5rem 0;">
          ${isAr ? platform.nameAr : platform.nameEn}
        </div>
        <p class="text-muted" style="font-size:.9rem;line-height:1.7;">
          ${isAr
            ? 'بناءً على إجاباتك، هذا المسار هو الأكثر توافقًا مع أسلوبك، اهتماماتك، وطموحاتك.'
            : 'Based on your answers, this path best matches your working style, interests, and career ambitions.'}
        </p>
      </div>
    ` : ''}

    <div class="surface-panel section-pad" data-aos="fade-up">
      <div class="eyebrow" style="margin-bottom:.85rem;">${isAr ? 'جميع نتائجك' : 'Full Breakdown'}</div>
      <div style="display:grid;gap:.65rem;">
        ${ranked.map(([key, pts], i) => {
          const pf  = window.SUBTRACK_PLATFORMS ? SUBTRACK_PLATFORMS[key] : null;
          if (!pf) return '';
          const pct = Math.round((pts / maxPts) * 100);
          return `
            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:.3rem;font-size:.88rem;">
                <span style="font-weight:${i === 0 ? '800' : '500'};">${isAr ? pf.nameAr : pf.nameEn}</span>
                <span style="color:var(--text-muted);">${pct}%</span>
              </div>
              <div style="background:var(--border);border-radius:99px;height:7px;overflow:hidden;">
                <div style="height:100%;width:${pct}%;background:${i === 0 ? 'var(--accent)' : 'var(--border-strong,#3f3f46)'};border-radius:99px;transition:width .5s ease;"></div>
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>

    ${platform ? `
      <div class="surface-panel section-pad" data-aos="fade-up">
        <div class="eyebrow" style="margin-bottom:.85rem;">${isAr ? 'منصات موصى بيها' : 'Recommended Platforms'}</div>
        <div style="display:flex;flex-wrap:wrap;gap:.5rem;">
          ${(platform.platforms || []).map(p => `
            <span class="mentor-tag" style="font-size:.82rem;padding:.3rem .8rem;">
              ${p}
              <span style="font-size:.68rem;color:#16a34a;margin-${isAr ? 'right' : 'left'}:.3rem;font-weight:700;">PROMO</span>
            </span>
          `).join('')}
        </div>
        <p class="text-muted" style="font-size:.8rem;margin-top:.75rem;line-height:1.6;">
          ${isAr
            ? 'اشتراكك في الباقة المدفوعة يخليك تصل لبرومو كود حصري من كل منصة شريكة.'
            : 'Your Premium membership unlocks exclusive promo codes for each partner platform.'}
        </p>
      </div>
    ` : ''}

    <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:.5rem;" data-aos="fade-up">
      <button class="btn btn-primary" onclick="navigateTo('roadmap')">${isAr ? 'افتح خارطة تطورك' : 'Open Your Roadmap'}</button>
      <button class="btn btn-secondary" onclick="navigateTo('progress')">${isAr ? 'شوف تقدمي' : 'View Progress'}</button>
      <button class="btn btn-secondary" onclick="resetSubtest()">${isAr ? 'كرر الاختبار' : 'Retake Test'}</button>
    </div>
  `;
};

// ── Main render ───────────────────────────────────────────────
window.renderSubtrackTestView = function renderSubtrackTestView() {
  const isAr      = state.language === 'ar';
  const questions = _stQuestions();

  if (state.subtestComplete) return renderSubtrackResults();

  if (!state.completedMilestones?.sessionBooked) {
    return `
      <div class="surface-panel section-pad" style="text-align:center;max-width:520px;margin:0 auto;" data-aos="fade-up">
        <div style="width:3rem;height:3rem;border-radius:12px;background:rgba(37,99,235,.1);display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;">
          <i data-lucide="lock" style="width:1.3rem;height:1.3rem;color:var(--accent);"></i>
        </div>
        <div style="font-weight:800;font-size:1.1rem;margin-bottom:.5rem;">
          ${isAr ? 'هذا الاختبار بيتفتح بعد جلسة المرشد' : 'This test unlocks after your Mentor Session'}
        </div>
        <p class="text-muted" style="font-size:.9rem;line-height:1.7;margin-bottom:1.2rem;">
          ${isAr
            ? 'بعد ما تحضر جلسة المرشد وتفهم التخصص، هنعملك 20 سؤال يحدد تخصصك الدقيق أوتوماتيكيًا.'
            : 'After your mentor session, this 20-question test pinpoints your exact sub-track automatically.'}
        </p>
        <div style="display:flex;gap:.75rem;flex-wrap:wrap;justify-content:center;">
          <button class="btn btn-primary" onclick="navigateTo('mentors')">${isAr ? 'اطلع على المرشدين' : 'Browse Mentors'}</button>
          <button class="btn btn-secondary" onclick="navigateTo('session-booking')">${isAr ? 'احجز جلسة' : 'Book a Session'}</button>
        </div>
      </div>`;
  }

  if (!questions || questions.length === 0) {
    return `<div class="surface-panel section-pad" style="text-align:center;">
      <p class="text-muted">${isAr ? 'تعذّر تحميل الأسئلة، يرجى المحاولة مجددًا.' : 'Could not load questions, please try again.'}</p>
      <button class="btn btn-secondary" style="margin-top:1rem;" onclick="renderMainOnly()">${isAr ? 'إعادة المحاولة' : 'Retry'}</button>
    </div>`;
  }

  const idx      = state.subtestIndex || 0;
  const total    = questions.length;
  const isFirst  = idx === 0;
  const isLast   = idx >= total - 1;
  const lang     = state.language;
  const pct      = ((idx + 1) / total) * 100;
  const answered = questions.filter(q => state.subtestAnswers?.[q.id]).length;
  const backDisabled = isFirst ? 'disabled style="opacity:.35;pointer-events:none;"' : '';

  const dots = questions.map((q, i) => {
    const done   = !!state.subtestAnswers?.[q.id];
    const active = i === idx;
    return `<div style="width:${active ? '1.8rem' : '.5rem'};height:5px;border-radius:999px;background:${(done||active)?'var(--accent)':'var(--surface-4)'};opacity:${(done||active)?'1':'.3'};transition:width .28s cubic-bezier(.4,0,.2,1),background .2s ease;flex-shrink:0;"></div>`;
  }).join('');

  return `
  <div class="test-shell">

    <div class="test-question-panel">
      <div class="progress-bar" style="margin-bottom:1.6rem;">
        <span id="st-progress-fill" style="width:${pct}%"></span>
      </div>

      <div id="st-question-wrapper">${_stBuildQ(questions)}</div>

      <div class="test-nav-mobile">
        <button id="st-back-btn-m" class="btn btn-secondary" onclick="subtestBack()" ${backDisabled}>
          <i data-lucide="chevron-${lang === 'ar' ? 'right' : 'left'}" style="width:.95rem;height:.95rem;"></i>
          ${t('back')}
        </button>
        <button id="st-next-btn-m" class="btn btn-primary" onclick="${isLast ? 'submitSubtest()' : 'subtestNext()'}">
          ${isLast ? (lang === 'ar' ? 'شوف نتيجتي' : 'See My Result') : t('next')}
          ${!isLast ? `<i data-lucide="chevron-${lang === 'ar' ? 'left' : 'right'}" style="width:.95rem;height:.95rem;"></i>` : ''}
        </button>
      </div>
    </div>

    <aside class="test-meta">
      <div class="eyebrow" style="margin-bottom:.5rem;">${isAr ? 'اختبار التخصص الدقيق' : 'Sub-track Test'}</div>
      <p style="font-size:1.2rem;font-weight:800;line-height:1.25;letter-spacing:-.025em;color:var(--text);">
        ${isAr ? 'اختار تخصصك الدقيق' : 'Find Your Exact Specialization'}
      </p>
      <p class="text-muted" style="margin-top:.5rem;font-size:.86rem;line-height:1.7;">
        ${isAr
          ? 'هذا الاختبار متاح بعد جلسة المرشد فقط — 20 سؤال بيحدد تخصصك الدقيق.'
          : 'This test runs after your mentor session — 20 questions to pinpoint your exact sub-track.'}
      </p>

      <div class="test-counter-block">
        <span id="st-counter" class="test-counter-num">
          ${idx + 1}<span style="font-size:1rem;font-weight:500;opacity:.4;">/${total}</span>
        </span>
        <span class="eyebrow" style="margin-top:.25rem;">${t('question')}</span>
      </div>

      <div id="st-step-dots" style="display:flex;align-items:center;gap:.4rem;margin-top:1rem;flex-wrap:wrap;">${dots}</div>
      <span id="st-answered-badge" style="display:block;font-size:.75rem;color:var(--text-faint);margin-top:.35rem;">
        ${answered}/${total} ${lang === 'ar' ? 'مكتمل' : 'answered'}
      </span>

      <div class="test-nav-desktop">
        <button id="st-back-btn" class="btn btn-secondary" onclick="subtestBack()" ${backDisabled}>
          <i data-lucide="chevron-${lang === 'ar' ? 'right' : 'left'}" style="width:.95rem;height:.95rem;"></i>
          ${t('back')}
        </button>
        <button id="st-next-btn" class="btn btn-primary" onclick="${isLast ? 'submitSubtest()' : 'subtestNext()'}">
          ${isLast ? (lang === 'ar' ? 'شوف نتيجتي' : 'See My Result') : t('next')}
          ${!isLast ? `<i data-lucide="chevron-${lang === 'ar' ? 'left' : 'right'}" style="width:.95rem;height:.95rem;"></i>` : ''}
        </button>
      </div>
    </aside>

  </div>`;
};
