window.renderSubTrackResultView = function renderSubTrackResultView() {
  const isAr = state.language === 'ar';

  // Gate: must have completed subtrack test
  if (!state.subtestComplete) {
    return `
      <div class="surface-panel section-pad" style="text-align:center;max-width:520px;margin:0 auto;" data-aos="fade-up">
        <div style="width:3rem;height:3rem;border-radius:12px;background:var(--accent-soft,rgba(37,99,235,.1));display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;">
          <i data-lucide="flask-conical" style="width:1.3rem;height:1.3rem;color:var(--accent);"></i>
        </div>
        <div style="font-weight:800;font-size:1.1rem;margin-bottom:.5rem;">
          ${isAr ? '\u0623\u0643\u0645\u0644 \u0627\u062e\u062a\u0628\u0627\u0631 \u0627\u0644\u062a\u062e\u0635\u0635 \u0623\u0648\u0644\u0627\u064b' : 'Complete the Sub-track Test First'}
        </div>
        <p class="text-muted" style="font-size:.9rem;line-height:1.7;margin-bottom:1.2rem;">
          ${isAr
            ? '\u0646\u062a\u064a\u062c\u062a\u0643 \u0627\u0644\u062f\u0642\u064a\u0642\u0629 \u0628\u062a\u062a\u062d\u062f\u062f \u0628\u0639\u062f \u0627\u062e\u062a\u0628\u0627\u0631 20 \u0633\u0624\u0627\u0644 \u064a\u062a\u0641\u062a\u062d \u0628\u0639\u062f \u062c\u0644\u0633\u0629 \u0627\u0644\u0645\u0631\u0634\u062f.'
            : 'Your exact sub-track is determined after the 20-question test, which unlocks after your mentor session.'}
        </p>
        <div style="display:flex;gap:.75rem;flex-wrap:wrap;justify-content:center;">
          <button class="btn btn-primary" onclick="navigateTo('subtrack-test')">${isAr ? '\u0627\u0628\u062f\u0623 \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631' : 'Start Test'}</button>
          <button class="btn btn-secondary" onclick="navigateTo('session-booking')">${isAr ? '\u0627\u062d\u062c\u0632 \u062c\u0644\u0633\u0629 \u0623\u0648\u0644\u0627\u064b' : 'Book Session First'}</button>
        </div>
      </div>
    `;
  }

  // ── Compute result from subtrack-test answers ──────────
  const fieldMap = {
    power: 'electrical', embedded: 'electrical', communications: 'electrical',
    frontend: 'software', backend: 'software', data: 'software', cyber: 'software'
  };
  const topTrack  = state.rankedTracks?.[0]?.id || 'embedded';
  const fieldKey  = fieldMap[topTrack] || state.subtestField || 'electrical';
  const questions = (typeof SUBTRACK_QUESTIONS !== 'undefined' && SUBTRACK_QUESTIONS && SUBTRACK_QUESTIONS[fieldKey]) ? SUBTRACK_QUESTIONS[fieldKey] : [];
  const answers   = state.subtestAnswers || {};

  const scores = {};
  questions.forEach(q => {
    const selectedKey = answers[q.id];
    if (!selectedKey) return;
    const optIdx = parseInt(selectedKey.split('_').pop(), 10);
    const opt = q.options && q.options[optIdx];
    if (!opt || !opt.scores) return;
    Object.entries(opt.scores).forEach(([track, pts]) => {
      scores[track] = (scores[track] || 0) + pts;
    });
  });

  const ranked = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .filter(([, pts]) => pts > 0);

  const topKey  = ranked[0]?.[0];
  const maxPts  = ranked[0]?.[1] || 1;

  // Safe SUBTRACK_PLATFORMS lookup
  const PLATFORMS = (typeof SUBTRACK_PLATFORMS !== 'undefined') ? SUBTRACK_PLATFORMS : null;
  const platform  = (topKey && PLATFORMS && PLATFORMS[topKey]) ? PLATFORMS[topKey] : null;

  // Save result to state
  if (topKey && state.subTrackResult !== topKey) {
    state.subTrackResult = topKey;
    persistState();
  }

  // ── Next-step actions ───────────────────────────────────
  const nextSteps = [
    {
      icon: 'map',
      titleEn: 'Open Your Roadmap',
      titleAr: '\u0627\u0641\u062a\u062d \u062e\u0627\u0631\u0637\u0629 \u062a\u0637\u0648\u0631\u0643',
      descEn:  'See the exact steps to master your sub-track.',
      descAr:  '\u0634\u0648\u0641 \u0627\u0644\u062e\u0637\u0648\u0627\u062a \u0627\u0644\u062f\u0642\u064a\u0642\u0629 \u0644\u062a\u0637\u0648\u064a\u0631 \u062a\u062e\u0635\u0635\u0643.',
      action:  "navigateTo('roadmap')"
    },
    {
      icon: 'library',
      titleEn: 'Recorded Library',
      titleAr: '\u0645\u0643\u062a\u0628\u0629 \u0627\u0644\u062c\u0644\u0633\u0627\u062a',
      descEn:  'Watch expert sessions tailored to your sub-track.',
      descAr:  '\u0634\u0627\u0647\u062f \u062c\u0644\u0633\u0627\u062a \u062e\u0628\u0631\u0627\u0621 \u0645\u0635\u0645\u0645\u0629 \u0644\u062a\u062e\u0635\u0635\u0643 \u0627\u0644\u062f\u0642\u064a\u0642.',
      action:  "navigateTo('recorded-library')"
    },
    {
      icon: 'message-square',
      titleEn: 'Chat with Mentor',
      titleAr: '\u062a\u0648\u0627\u0635\u0644 \u0645\u0639 \u0627\u0644\u0645\u0631\u0634\u062f',
      descEn:  'Ask your mentor anything about your sub-track.',
      descAr:  '\u0627\u0633\u0623\u0644 \u0645\u0631\u0634\u062f\u0643 \u0639\u0646 \u0623\u064a \u0634\u064a\u0621 \u0641\u064a \u062a\u062e\u0635\u0635\u0643.',
      action:  "navigateTo('chat')"
    }
  ];

  const trackColors = { power: '#2563eb', embedded: '#7c3aed', communications: '#059669' };
  const accentColor = trackColors[topTrack] || 'var(--accent)';

  // ── Fallback when no scores computed yet ───────────────
  if (!ranked.length) {
    return `
      <div class="surface-panel section-pad" style="text-align:center;max-width:520px;margin:0 auto;" data-aos="fade-up">
        <div style="width:3rem;height:3rem;border-radius:12px;background:var(--accent-soft,rgba(37,99,235,.1));display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;">
          <i data-lucide="alert-circle" style="width:1.3rem;height:1.3rem;color:var(--accent);"></i>
        </div>
        <div style="font-weight:800;font-size:1.1rem;margin-bottom:.5rem;">
          ${isAr ? '\u0644\u0645 \u064a\u062a\u0645 \u062a\u062d\u062f\u064a\u062f \u0627\u0644\u0646\u062a\u064a\u062c\u0629 \u0628\u0639\u062f' : 'Result Not Ready Yet'}
        </div>
        <p class="text-muted" style="font-size:.9rem;line-height:1.7;margin-bottom:1.2rem;">
          ${isAr
            ? '\u064a\u0628\u062f\u0648 \u0625\u0646\u0643 \u0644\u0645 \u062a\u062c\u0628 \u0639\u0644\u0649 \u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631 \u0628\u0639\u062f. \u0623\u0643\u0645\u0644 \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631 \u0644\u062a\u0634\u0648\u0641 \u0646\u062a\u064a\u062c\u062a\u0643.'
            : "It looks like the test answers weren't recorded. Complete the test to see your result."}
        </p>
        <button class="btn btn-primary" onclick="navigateTo('subtrack-test')">
          ${isAr ? '\u0627\u0628\u062f\u0623 \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631' : 'Take the Test'}
        </button>
      </div>
    `;
  }

  return `
    <!-- Hero result -->
    <div class="surface-panel section-pad" style="border:2px solid ${accentColor};text-align:center;" data-aos="fade-up">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:4rem;height:4rem;border-radius:50%;background:${accentColor}18;margin-bottom:1rem;">
        <i data-lucide="target" style="width:1.8rem;height:1.8rem;color:${accentColor};"></i>
      </div>
      <div class="eyebrow" style="color:${accentColor};">${isAr ? '\u062a\u062e\u0635\u0635\u0643 \u0627\u0644\u062f\u0642\u064a\u0642' : 'Your Exact Sub-track'}</div>
      <h2 style="font-size:2rem;font-weight:900;margin:.5rem 0;line-height:1.2;">
        ${platform ? (isAr ? platform.nameAr : platform.nameEn) : (topKey || (isAr ? '\u063a\u064a\u0631 \u0645\u062d\u062f\u062f' : 'Not determined'))}
      </h2>
      <p class="text-muted" style="font-size:.9rem;line-height:1.7;max-width:480px;margin:0 auto;">
        ${isAr
          ? '\u0628\u0646\u0627\u0621\u064b \u0639\u0644\u0649 \u0625\u062c\u0627\u0628\u0627\u062a\u0643 \u0641\u064a \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631 \u0648\u062c\u0644\u0633\u0629 \u0627\u0644\u0645\u0631\u0634\u062f\u060c \u0647\u0630\u0627 \u0627\u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u062f\u0642\u064a\u0642 \u0647\u0648 \u0627\u0644\u0623\u0646\u0633\u0628 \u0644\u0643.'
          : 'Based on your test answers and mentor session, this is your most fitting specialization path.'}
      </p>
    </div>

    <!-- Score breakdown -->
    <div class="surface-panel section-pad" data-aos="fade-up">
      <div class="eyebrow" style="margin-bottom:.85rem;">${isAr ? '\u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0646\u062a\u0627\u0626\u062c' : 'Score Breakdown'}</div>
      <div style="display:grid;gap:.7rem;">
        ${(ranked || []).map(([key, pts], i) => {
          const pf = PLATFORMS && PLATFORMS[key];
          const label = pf ? (isAr ? pf.nameAr : pf.nameEn) : key;
          const pct   = Math.round((pts / maxPts) * 100);
          const isTop = i === 0;
          return `
            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:.3rem;font-size:.88rem;">
                <span style="font-weight:${isTop ? '800' : '500'};display:flex;align-items:center;gap:.4rem;">
                  ${isTop ? `<i data-lucide="star" style="width:.75rem;height:.75rem;color:#f59e0b;"></i>` : ''}
                  ${label}
                </span>
                <span style="color:var(--text-muted);font-weight:${isTop ? '700' : '400'}">${pct}%</span>
              </div>
              <div style="background:var(--border);border-radius:99px;height:8px;overflow:hidden;">
                <div style="height:100%;width:${pct}%;background:${isTop ? accentColor : 'var(--border-strong,#3f3f46)'};border-radius:99px;transition:width .6s ease;"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Recommended platforms -->
    ${platform && platform.platforms && platform.platforms.length ? `
      <div class="surface-panel section-pad" data-aos="fade-up">
        <div class="eyebrow" style="margin-bottom:.85rem;">${isAr ? '\u0645\u0646\u0635\u0627\u062a \u0645\u0648\u0635\u0649 \u0628\u064a\u0647\u0627' : 'Recommended Platforms'}</div>
        <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:.75rem;">
          ${platform.platforms.map(p => `
            <span class="mentor-tag" style="font-size:.82rem;padding:.3rem .9rem;">
              ${p}
              <span style="font-size:.68rem;color:#16a34a;margin-${isAr ? 'right' : 'left'}:.35rem;font-weight:700;">PROMO</span>
            </span>
          `).join('')}
        </div>
        <p class="text-muted" style="font-size:.8rem;line-height:1.6;">
          ${isAr
            ? '\u0627\u0634\u062a\u0631\u0627\u0643\u0643 \u0641\u064a \u0627\u0644\u0628\u0627\u0642\u0629 \u0627\u0644\u0645\u062f\u0641\u0648\u0639\u0629 \u064a\u062e\u0644\u064a\u0643 \u062a\u062d\u0635\u0644 \u0639\u0644\u0649 \u0628\u0631\u0648\u0645\u0648 \u0643\u0648\u062f \u062d\u0635\u0631\u064a \u0645\u0646 \u0643\u0644 \u0645\u0646\u0635\u0629 \u0634\u0631\u064a\u0643\u0629.'
            : 'Your Premium membership gives you exclusive promo codes for each partner platform.'}
        </p>
      </div>
    ` : ''}

    <!-- Next steps -->
    <div data-aos="fade-up">
      <div class="eyebrow" style="margin-bottom:.85rem;">${isAr ? '\u0627\u0644\u062e\u0637\u0648\u0629 \u0627\u0644\u062a\u0627\u0644\u064a\u0629' : 'What to Do Next'}</div>
      <div style="display:grid;gap:.75rem;">
        ${nextSteps.map((step, i) => `
          <div
            class="surface-soft section-pad"
            style="display:flex;align-items:center;gap:1rem;cursor:pointer;transition:border-color .2s;border:1px solid ${i === 0 ? accentColor : 'transparent'};"
            onclick="${step.action}">
            <div style="width:2.4rem;height:2.4rem;border-radius:10px;background:${i === 0 ? accentColor + '18' : 'var(--surface-2,var(--surface))'};border:1px solid ${i === 0 ? accentColor + '44' : 'var(--border)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i data-lucide="${step.icon}" style="width:1rem;height:1rem;color:${i === 0 ? accentColor : 'var(--text-muted)'};"></i>
            </div>
            <div style="flex:1;">
              <div style="font-weight:700;font-size:.92rem;">${isAr ? step.titleAr : step.titleEn}</div>
              <div class="text-muted" style="font-size:.8rem;margin-top:.2rem;">${isAr ? step.descAr : step.descEn}</div>
            </div>
            <i data-lucide="chevron-${isAr ? 'left' : 'right'}" style="width:.9rem;height:.9rem;color:var(--text-muted);flex-shrink:0;"></i>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Retake -->
    <div style="text-align:center;margin-top:1rem;" data-aos="fade-up">
      <button class="btn btn-secondary" style="font-size:.82rem;" onclick="resetSubtest();navigateTo('subtrack-test');">
        <i data-lucide="rotate-ccw" style="width:.8rem;height:.8rem;"></i>
        ${isAr ? '\u0643\u0631\u0631 \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631' : 'Retake Test'}
      </button>
    </div>
  `;
};
