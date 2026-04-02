window.renderRoadmapView = function renderRoadmapView() {
  if (!ensureResultsOrPrompt()) return '';
  const track = getCurrentTrack();
  const steps = ROADMAP[state.selectedTrack];
  const lang = state.language;
  const isAr = lang === 'ar';
  const isPremium = state.premiumUnlocked;

  const headerCTA = isPremium
    ? `
        <div style="display:flex;align-items:center;gap:.5rem;">
          <span class="badge badge-accent" style="display:inline-flex;align-items:center;gap:.3rem;">
            <i data-lucide="shield-check" style="width:.7rem;height:.7rem;"></i>
            ${isAr ? 'مفعّل' : 'Premium active'}
          </span>
          <button class="btn btn-secondary" onclick="navigateTo('session-booking')">${t('bookSession')}</button>
        </div>
      `
    : `<button class="btn btn-secondary" onclick="openPremiumLock('pricing')">${t('unlockFullAnalysis')}</button>`;

  const quickLinks = [
    { id:'platforms',       icon:'layout-grid',   labelEn:'Learning Platforms', labelAr:'منصات التعلم' },
    { id:'progress',        icon:'target',        labelEn:'My Progress',        labelAr:'تقدمي' },
    { id:'mentors',         icon:'users-round',   labelEn:'Mentors',            labelAr:'المرشدون' },
    { id:'session-booking', icon:'calendar-days', labelEn:'Book a Session',     labelAr:'احجز جلسة', lock: !isPremium },
    { id:'chat',            icon:'message-square',labelEn:'Mentor Chat',        labelAr:'شات المرشد', lock: !isPremium },
  ];

  return `
    <section class="surface-panel section-pad">
      <div class="page-header" data-aos="fade-up">
        <div>
          <div class="eyebrow">${t('roadmapTitle')}</div>
          <h2 class="section-title" style="margin-top:.6rem;">${track.title[lang]} — ${t('roadmapTitle')}</h2>
          <p class="text-muted" style="margin-top:.8rem;">${isPremium ? (isAr ? 'جميع الخطوات مفتوحة.' : 'All steps unlocked.') : t('roadmapPreview')}</p>
        </div>
        ${headerCTA}
      </div>

      <div style="display:grid;gap:1rem;margin-top:1.4rem;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));">
        ${steps.map((step, idx) => {
          const done = !!state.roadmapProgress[`${state.selectedTrack}_${step.step}`];
          const locked = !isPremium && idx > 1;
          return `
            <div class="step-card ${locked ? 'locked' : ''}" data-aos="fade-up" data-aos-delay="${idx * 70}">
              <div class="page-header">
                <div>
                  <div class="eyebrow">${isAr ? `الخطوة ${step.step}` : `Step ${step.step}`}</div>
                  <div style="font-size:1.15rem;font-weight:800;margin-top:.45rem;">${step.title[lang]}</div>
                </div>
                <div class="badge ${done ? 'badge-success' : locked ? 'badge-accent' : ''}">
                  ${done ? t('completed') : locked ? t('locked') : idx === 0 ? t('current') : t('upcoming')}
                </div>
              </div>
              <p class="text-muted" style="margin-top:.8rem;line-height:1.8;">${step.note[lang]}</p>
              <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1rem;">
                ${locked
                  ? `<button class="btn btn-primary" onclick="openPremiumLock('roadmap')">${t('upgradeNow')}</button>`
                  : `<button class="btn ${done ? 'btn-secondary' : 'btn-primary'}" onclick="completeRoadmapStep('${state.selectedTrack}', ${step.step})">${done ? t('completed') : step.action[lang]}</button>`
                }
                <button class="btn btn-ghost" onclick="navigateTo('platforms')">${t('startLearning')}</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>

    ${renderQuickLinks(quickLinks)}
  `;
};
