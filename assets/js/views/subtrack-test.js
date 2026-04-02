window.renderSubtrackTestView = function renderSubtrackTestView() {
  const isAr = state.language === 'ar';

  // Determine which question set to use based on main track
  const fieldMap = {
    power: 'electrical', embedded: 'electrical', communications: 'electrical',
    frontend: 'software', backend: 'software', data: 'software', cyber: 'software',
    'mechanical-design': 'mechanical', 'mechanical-mfg': 'mechanical', 'mechanical-thermal': 'mechanical',
    'civil-structural': 'civil', 'civil-water': 'civil', 'civil-geo': 'civil'
  };
  const topTrack = state.rankedTracks?.[0]?.id || '';
  const fieldKey = fieldMap[topTrack] || state.subtestField || 'software';
  const questions = SUBTRACK_QUESTIONS[fieldKey] || SUBTRACK_QUESTIONS.software;

  const idx = state.subtestIndex || 0;
  const answers = state.subtestAnswers || {};
  const isComplete = state.subtestComplete || false;

  // -- Results view --
  if (isComplete) {
    return renderSubtrackResults(isAr, fieldKey, answers, questions);
  }

  // -- Gate: require session booked --
  if (!state.completedMilestones.sessionBooked) {
    return `
      <div class="surface-panel section-pad" style="text-align:center;max-width:520px;margin:0 auto;" data-aos="fade-up">
        <div style="font-size:2rem;margin-bottom:.75rem;">🔒</div>
        <div style="font-weight:800;font-size:1.1rem;margin-bottom:.5rem;">
          ${isAr ? 'هذا الاختبار بيتفتح بعد جلسة المرشد' : 'This test unlocks after your Mentor Session'}
        </div>
        <p class="text-muted" style="font-size:.9rem;line-height:1.7;margin-bottom:1.2rem;">
          ${isAr
            ? 'بعد ما تحضر جلسة المرشد وتفهم التخصص، هنعملك 20 سؤال يحدد تخصصك الدقيق أوتوماتيكيًا.'
            : 'After attending the mentor session and understanding your field, this 20-question test pinpoints your exact sub-track automatically.'}
        </p>
        <div style="display:flex;gap:.75rem;flex-wrap:wrap;justify-content:center;">
          <button class="btn btn-primary" onclick="navigateTo('mentors')">${isAr ? 'اطلع على المرشدين' : 'Browse Mentors'}</button>
          <button class="btn btn-secondary" onclick="navigateTo('session-booking')">${isAr ? 'احجز جلسة' : 'Book a Session'}</button>
        </div>
      </div>
    `;
  }

  const q = questions[idx];
  const selected = answers[q.id];
  const isLast = idx === questions.length - 1;
  const progress = Math.round(((idx + (selected ? 1 : 0)) / questions.length) * 100);

  return `
    <div class="page-header" data-aos="fade-up">
      <div>
        <div class="eyebrow">${isAr ? 'اختبار التخصص الدقيق' : 'Sub-track Selector Test'}</div>
        <h2 class="section-title" style="margin-top:.4rem;">${isAr ? 'اختار تخصصك الدقيق' : 'Find Your Exact Specialization'}</h2>
        <p class="text-muted" style="font-size:.88rem;margin-top:.4rem;">
          ${isAr ? `سؤال ${idx + 1} من ${questions.length}` : `Question ${idx + 1} of ${questions.length}`}
        </p>
      </div>
    </div>

    <!-- Progress bar -->
    <div style="background:var(--border);border-radius:99px;height:6px;overflow:hidden;margin-bottom:1.5rem;">
      <div style="height:100%;width:${progress}%;background:var(--accent);border-radius:99px;transition:width .35s ease;"></div>
    </div>

    <!-- Question card -->
    <div class="surface-panel section-pad" data-aos="fade-up" style="margin-bottom:1rem;">
      <div style="font-size:1.05rem;font-weight:700;line-height:1.6;margin-bottom:1.25rem;">
        ${isAr ? q.ar : q.en}
      </div>
      <div style="display:grid;gap:.65rem;">
        ${q.options.map((opt, oi) => {
          const optKey = `${q.id}_${oi}`;
          const isSelected = selected === optKey;
          return `
            <button
              class="subtest-option ${isSelected ? 'is-selected' : ''}"
              onclick="selectSubtestAnswer('${q.id}', '${optKey}', ${oi})">
              <span class="subtest-option-letter">${String.fromCharCode(65 + oi)}</span>
              <span>${isAr ? opt.ar : opt.en}</span>
            </button>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Navigation -->
    <div style="display:flex;justify-content:space-between;gap:.75rem;">
      <button
        class="btn btn-secondary"
        ${idx === 0 ? 'disabled' : ''}
        onclick="subtestBack()">
        ${isAr ? '← رجوع' : '← Back'}
      </button>
      <button
        class="btn btn-primary"
        ${!selected ? 'disabled style="opacity:.5;cursor:not-allowed;"' : ''}
        onclick="${isLast ? 'submitSubtest()' : 'subtestNext()'}">
        ${isLast ? (isAr ? 'شوف نتيجتي →' : 'See My Result →') : (isAr ? 'التالي →' : 'Next →')}
      </button>
    </div>
  `;
};

window.renderSubtrackResults = function renderSubtrackResults(isAr, fieldKey, answers, questions) {
  // Tally scores
  const scores = {};
  questions.forEach(q => {
    const selectedKey = answers[q.id];
    if (!selectedKey) return;
    const optIdx = parseInt(selectedKey.split('_').pop(), 10);
    const opt = q.options[optIdx];
    if (!opt) return;
    Object.entries(opt.scores).forEach(([track, pts]) => {
      scores[track] = (scores[track] || 0) + pts;
    });
  });

  const ranked = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .filter(([, pts]) => pts > 0);

  const topKey = ranked[0]?.[0];
  const maxPts = ranked[0]?.[1] || 1;
  const platform = topKey ? SUBTRACK_PLATFORMS[topKey] : null;

  return `
    <div class="page-header" data-aos="fade-up">
      <div>
        <div class="eyebrow">${isAr ? 'نتيجة اختبار التخصص' : 'Sub-track Result'}</div>
        <h2 class="section-title" style="margin-top:.4rem;">
          ${isAr ? 'تخصصك الدقيق وضح' : 'Your Exact Sub-track is Clear'}
        </h2>
      </div>
    </div>

    <!-- Top match -->
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

    <!-- All ranked -->
    <div class="surface-panel section-pad" data-aos="fade-up">
      <div class="eyebrow" style="margin-bottom:.85rem;">${isAr ? 'جميع نتائجك' : 'Full Breakdown'}</div>
      <div style="display:grid;gap:.65rem;">
        ${ranked.map(([key, pts], i) => {
          const pf = SUBTRACK_PLATFORMS[key];
          if (!pf) return '';
          const pct = Math.round((pts / maxPts) * 100);
          return `
            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:.3rem;font-size:.88rem;">
                <span style="font-weight:${i === 0 ? '800' : '500'};">${isAr ? pf.nameAr : pf.nameEn}</span>
                <span style="color:var(--text-muted);">${pct}%</span>
              </div>
              <div style="background:var(--border);border-radius:99px;height:7px;overflow:hidden;">
                <div style="height:100%;width:${pct}%;background:${i === 0 ? 'var(--accent)' : 'var(--border-strong, #3f3f46)'};border-radius:99px;transition:width .5s ease;"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Platform recommendations -->
    ${platform ? `
      <div class="surface-panel section-pad" data-aos="fade-up">
        <div class="eyebrow" style="margin-bottom:.85rem;">${isAr ? 'منصات موصى بيها' : 'Recommended Platforms'}</div>
        <div style="display:flex;flex-wrap:wrap;gap:.5rem;">
          ${platform.platforms.map(p => `
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

    <!-- CTAs -->
    <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:.5rem;" data-aos="fade-up">
      <button class="btn btn-primary" onclick="navigateTo('roadmap')">${isAr ? 'افتح خارطة تطورك' : 'Open Your Roadmap'}</button>
      <button class="btn btn-secondary" onclick="navigateTo('progress')">${isAr ? 'شوف تقدمي' : 'View Progress'}</button>
      <button class="btn btn-secondary" onclick="resetSubtest()">${isAr ? 'كرر الاختبار' : 'Retake Test'}</button>
    </div>
  `;
};

// Controllers
window.selectSubtestAnswer = function selectSubtestAnswer(qId, optKey) {
  if (!state.subtestAnswers) state.subtestAnswers = {};
  state.subtestAnswers[qId] = optKey;
  renderApp();
};
window.subtestNext = function subtestNext() {
  state.subtestIndex = (state.subtestIndex || 0) + 1;
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
window.subtestBack = function subtestBack() {
  state.subtestIndex = Math.max(0, (state.subtestIndex || 0) - 1);
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
window.submitSubtest = function submitSubtest() {
  state.subtestComplete = true;
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
window.resetSubtest = function resetSubtest() {
  state.subtestAnswers = {};
  state.subtestIndex = 0;
  state.subtestComplete = false;
  renderApp();
};
