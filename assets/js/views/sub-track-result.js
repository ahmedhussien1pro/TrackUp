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
          ${isAr ? 'أكمل اختبار التخصص أولاً' : 'Complete the Sub-track Test First'}
        </div>
        <p class="text-muted" style="font-size:.9rem;line-height:1.7;margin-bottom:1.2rem;">
          ${isAr
            ? 'نتيجتك الدقيقة بتتحدد بعد اختبار 20 سؤال يتفتح بعد جلسة المرشد.'
            : 'Your exact sub-track is determined after the 20-question test, which unlocks after your mentor session.'}
        </p>
        <div style="display:flex;gap:.75rem;flex-wrap:wrap;justify-content:center;">
          <button class="btn btn-primary" onclick="navigateTo('subtrack-test')">${isAr ? 'ابدأ الاختبار' : 'Start Test'}</button>
          <button class="btn btn-secondary" onclick="navigateTo('session-booking')">${isAr ? 'احجز جلسة أولاً' : 'Book Session First'}</button>
        </div>
      </div>
    `;
  }

  // ── Compute result from subtrack-test answers ──────────
  const fieldMap = {
    power: 'electrical', embedded: 'electrical', communications: 'electrical',
    frontend: 'software', backend: 'software', data: 'software', cyber: 'software'
  };
  const topTrack = state.rankedTracks?.[0]?.id || 'embedded';
  const fieldKey = fieldMap[topTrack] || state.subtestField || 'electrical';
  const questions = (window.SUBTRACK_QUESTIONS && window.SUBTRACK_QUESTIONS[fieldKey]) || [];
  const answers   = state.subtestAnswers || {};

  const scores = {};
  questions.forEach(q => {
    const selectedKey = answers[q.id];
    if (!selectedKey) return;
    const optIdx = parseInt(selectedKey.split('_').pop(), 10);
    const opt = Array.isArray(q.options) ? q.options[optIdx] : undefined;
    if (!opt || !opt.scores || typeof opt.scores !== 'object') return;
    Object.entries(opt.scores).forEach(([track, pts]) => {
      scores[track] = (scores[track] || 0) + pts;
    });
  });

  const ranked = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .filter(([, pts]) => pts > 0);

  const topKey  = ranked[0]?.[0];
  const maxPts  = ranked[0]?.[1] || 1;
  const platform = (topKey && window.SUBTRACK_PLATFORMS) ? window.SUBTRACK_PLATFORMS[topKey] : null;

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
      titleAr: 'افتح خارطة تطورك',
      descEn:  'See the exact steps to master your sub-track.',
      descAr:  'شوف الخطوات الدقيقة لتطوير تخصصك الجديد.',
      action:  "navigateTo('roadmap')",
      primary: true
    },
    {
      icon: 'library',
      titleEn: 'Recorded Library',
      titleAr: 'مكتبة الجلسات',
      descEn:  'Watch expert sessions tailored to your sub-track.',
      descAr:  'شاهد جلسات خبراء مصممة لتخصصك الدقيق.',
      action:  "navigateTo('recorded-library')",
      primary: false
    },
    {
      icon: 'message-square',
      titleEn: 'Chat with Mentor',
      titleAr: 'تواصل مع المرشد',
      descEn:  'Ask your mentor anything about your sub-track.',
      descAr:  'اسأل مرشدك عن أي شيء في تخصصك.',
      action:  "navigateTo('chat')",
      primary: false
    }
  ];

  const trackColors = { power: '#2563eb', embedded: '#7c3aed', communications: '#059669' };
  const accentColor = trackColors[topTrack] || 'var(--accent)';

  return `
    <!-- Hero result -->
    <div class="surface-panel section-pad" style="border:2px solid ${accentColor};text-align:center;" data-aos="fade-up">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:4rem;height:4rem;border-radius:50%;background:${accentColor}18;margin-bottom:1rem;">
        <i data-lucide="target" style="width:1.8rem;height:1.8rem;color:${accentColor};"></i>
      </div>
      <div class="eyebrow" style="color:${accentColor};">${isAr ? 'تخصصك الدقيق' : 'Your Exact Sub-track'}</div>
      <h2 style="font-size:2rem;font-weight:900;margin:.5rem 0;line-height:1.2;">
        ${platform ? (isAr ? platform.nameAr : platform.nameEn) : (isAr ? 'غير محدد' : 'Not determined')}
      </h2>
      <p class="text-muted" style="font-size:.9rem;line-height:1.7;max-width:480px;margin:0 auto;">
        ${isAr
          ? 'بناءً على إجاباتك في الاختبار وجلسة المرشد، هذا المسار الدقيق هو الأنسب لك.'
          : 'Based on your test answers and mentor session, this is your most fitting specialization path.'}
      </p>
    </div>

    <!-- Score breakdown -->
    ${ranked.length > 0 ? `
    <div class="surface-panel section-pad" data-aos="fade-up">
      <div class="eyebrow" style="margin-bottom:.85rem;">${isAr ? 'تفاصيل النتائج' : 'Score Breakdown'}</div>
      <div style="display:grid;gap:.7rem;">
        ${ranked.map(([key, pts], i) => {
          const pf = window.SUBTRACK_PLATFORMS && window.SUBTRACK_PLATFORMS[key];
          if (!pf) return '';
          const pct = Math.round((pts / maxPts) * 100);
          const isTop = i === 0;
          return `
            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:.3rem;font-size:.88rem;">
                <span style="font-weight:${isTop ? '800' : '500'};display:flex;align-items:center;gap:.4rem;">
                  ${isTop ? `<i data-lucide="star" style="width:.75rem;height:.75rem;color:#f59e0b;"></i>` : ''}
                  ${isAr ? pf.nameAr : pf.nameEn}
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
    ` : ''}

    <!-- Recommended platforms -->
    ${platform && Array.isArray(platform.platforms) ? `
      <div class="surface-panel section-pad" data-aos="fade-up">
        <div class="eyebrow" style="margin-bottom:.85rem;">${isAr ? 'منصات موصى بيها' : 'Recommended Platforms'}</div>
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
            ? 'اشتراكك في الباقة المدفوعة يخليك تحصل على برومو كود حصري من كل منصة شريكة.'
            : 'Your Premium membership gives you exclusive promo codes for each partner platform.'}
        </p>
      </div>
    ` : ''}

    <!-- Next steps -->
    <div data-aos="fade-up">
      <div class="eyebrow" style="margin-bottom:.85rem;">${isAr ? 'الخطوة التالية' : 'What to Do Next'}</div>
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
        ${isAr ? 'كرر الاختبار' : 'Retake Test'}
      </button>
    </div>
  `;
};
