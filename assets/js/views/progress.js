window.renderProgressView = function renderProgressView() {
  const isAr = state.language === 'ar';
  const next = nextRecommendedStep();
  const sessionDone = state.completedMilestones.sessionBooked;

  return `
    <section style="display:grid;gap:1.25rem;">
      ${renderProgressStrip()}

      <div class="page-grid-2">
        <!-- Left: next step + ring -->
        <div class="surface-panel section-pad" data-aos="fade-up">
          <div class="page-header">
            <div>
              <div class="eyebrow">${t('progressTitle')}</div>
              <h2 class="section-title" style="margin-top:.6rem;">${t('progressTitle')}</h2>
              <p class="text-muted" style="margin-top:.8rem;">${t('progressDesc')}</p>
            </div>
            ${renderMetricRing(progressPercentage(), t('progressTitle'))}
          </div>
          <div class="surface-soft section-pad" style="margin-top:1.25rem;">
            <div class="eyebrow">${t('topAction')}</div>
            <div style="font-size:1.15rem;font-weight:800;margin-top:.6rem;">${next.label}</div>
            <button class="btn btn-primary" style="margin-top:1rem;" onclick="navigateTo('${next.view}')">${t('startNow')}</button>
          </div>
        </div>

        <!-- Right: profile snapshot -->
        <div class="surface-panel section-pad" data-aos="fade-up" data-aos-delay="80">
          <div class="eyebrow">${t('profile')}</div>
          <div style="font-weight:800;font-size:1.15rem;margin-top:.7rem;">${state.profile.fullName ? safeProfileName() : t('noProfile')}</div>
          <div class="text-muted" style="margin-top:.45rem;">${state.profile.college || ''}</div>
          <div class="text-muted" style="margin-top:.85rem;">${t('stageLabel')}: ${next.label}</div>
        </div>
      </div>

      <!-- Sub-track Test CTA — shown after session booked -->
      ${sessionDone ? `
        <div class="surface-panel section-pad" style="border:1.5px solid var(--accent);" data-aos="fade-up">
          <div style="display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;justify-content:space-between;">
            <div>
              <div class="eyebrow" style="color:var(--accent);margin-bottom:.4rem;">${isAr ? 'جاهز لخطوتك التالية ✨' : 'Ready for your next step ✨'}</div>
              <div style="font-weight:800;font-size:1.05rem;">${isAr ? 'حضرت الجلسة — حدد تخصصك الدقيق' : 'Session done — now find your exact sub-track'}</div>
              <p class="text-muted" style="font-size:.87rem;margin-top:.35rem;line-height:1.65;max-width:480px;">
                ${isAr
                  ? 'بناءً على جلستك مع المرشد، هتعمل 20 سؤال سريع يوضحلك بالضبط هل انته فرونت أو باك أو داتا أو سايبر.'
                  : 'Based on your mentor session, 20 quick questions will pinpoint whether you\'re Frontend, Backend, Data, or Cyber — automatically.'}
              </p>
            </div>
            <button class="btn btn-primary" onclick="navigateTo('subtrack-test')">
              ${isAr ? 'ابدأ الاختبار' : 'Start Sub-track Test'}
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Milestones -->
      <div class="surface-panel section-pad">
        <div class="page-header" data-aos="fade-up">
          <div>
            <div class="eyebrow">${t('progressSnapshot')}</div>
            <div style="font-size:1.35rem;font-weight:800;margin-top:.55rem;">${t('continueJourney')}</div>
          </div>
          <button class="btn btn-secondary" onclick="navigateTo('${next.view}')">${t('startNow')}</button>
        </div>
        <div style="display:grid;gap:.8rem;margin-top:1rem;">
          ${renderMilestoneList()}
        </div>
      </div>
    </section>
  `;
};
